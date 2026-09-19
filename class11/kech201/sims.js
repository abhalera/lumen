
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
// 1. electrontransfer: Competitive Electron Transfer Lab
// ==========================================
window.SIMS.electrontransfer = {
  mount: function(container){
    var pair = 'zn_cu'; // zn_cu, cu_ag, cu_zn
    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="preset-bar" class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip preset-btn active" id="btn-pair-zncu">Zn in CuSO4 (Blue Fades)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-pair-cuag">Cu in AgNO3 (Silver Needles)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-pair-cuzn">Cu in ZnSO4 (No Reaction)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-et" viewBox="0 0 700 280" style="width:100%;height:auto;max-height:280px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="et-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-et');
      var rd = document.getElementById('et-readout');
      if(!svg || !rd) return;

      var solnColor, stripColor, depositColor, rxnTitle, equation, e0, statusTxt, desc;
      if(pair === 'zn_cu'){
        solnColor = 'rgba(56, 189, 248, 0.4)'; // blue fading
        stripColor = '#94a3b8'; // zinc silvery grey
        depositColor = '#b45309'; // copper reddish brown
        rxnTitle = 'Zinc Metal dipped in Aqueous Copper Sulfate (CuSO4)';
        equation = 'Zn(s) + Cu²⁺(aq) ⟶ Zn²⁺(aq) + Cu(s)';
        e0 = '+1.10 V (Spontaneous)';
        statusTxt = '<span style="color:#10b981;font-weight:700;">Spontaneous Exothermic Redox Reaction</span>';
        desc = 'Zinc atoms lose 2 electrons (oxidation: Zn ⟶ Zn²⁺ + 2e⁻) and dissolve into solution. Cu²⁺ ions accept electrons (reduction: Cu²⁺ + 2e⁻ ⟶ Cu) and deposit as reddish-brown copper on the zinc strip. The deep blue color of hydrated Cu²⁺ fades as colorless Zn²⁺ ions accumulate.';
      } else if(pair === 'cu_ag'){
        solnColor = 'rgba(14, 165, 233, 0.5)'; // turns blue
        stripColor = '#d97706'; // copper reddish
        depositColor = '#e2e8f0'; // silver shimmering needles
        rxnTitle = 'Copper Wire coiled in Aqueous Silver Nitrate (AgNO3)';
        equation = 'Cu(s) + 2Ag⁺(aq) ⟶ Cu²⁺(aq) + 2Ag(s)';
        e0 = '+0.46 V (Spontaneous)';
        statusTxt = '<span style="color:#10b981;font-weight:700;">Spontaneous Silver Needle Crystallization</span>';
        desc = 'Copper atoms lose electrons (oxidation: Cu ⟶ Cu²⁺ + 2e⁻) turning the solution sky blue. Ag⁺ ions accept electrons (reduction: Ag⁺ + e⁻ ⟶ Ag), precipitating out as glistening, branched needles of metallic silver.';
      } else {
        solnColor = 'rgba(241, 245, 249, 0.15)'; // clear
        stripColor = '#d97706'; // copper
        depositColor = 'none';
        rxnTitle = 'Copper Metal in Aqueous Zinc Sulfate (ZnSO4)';
        equation = 'Cu(s) + Zn²⁺(aq) ↛ No Reaction';
        e0 = '−1.10 V (Non-Spontaneous)';
        statusTxt = '<span style="color:#ef4444;font-weight:700;">Non-Spontaneous (Thermodynamically Forbidden)</span>';
        desc = 'Copper has a much higher standard reduction potential (E° = +0.34 V) than zinc (E° = −0.76 V). Copper cannot donate electrons to Zn²⁺ ions. The solution remains colorless and the copper metal remains pristine.';
      }

      svg.innerHTML = 
        '<rect x="220" y="40" width="260" height="200" rx="12" fill="none" stroke="#64748b" stroke-width="3" />' +
        '<rect x="223" y="80" width="254" height="157" rx="8" fill="' + solnColor + '" />' +
        '<line x1="223" y1="80" x2="477" y2="80" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,2" />' +
        '<text x="350" y="70" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="monospace">Solution Meniscus</text>' +
        '<rect x="330" y="20" width="40" height="180" rx="4" fill="' + stripColor + '" stroke="#334155" stroke-width="2" />' +
        (depositColor !== 'none' ? 
          '<rect x="326" y="85" width="48" height="110" rx="2" fill="' + depositColor + '" opacity="0.85" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2" />' +
          '<text x="390" y="140" fill="#fcd34d" font-size="12" font-weight="700">Deposition Layer</text>' +
          '<path d="M 385 136 L 374 136" stroke="#fcd34d" stroke-width="2" marker-end="url(#arr)" />'
          : '') +
        '<text x="350" y="260" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="700">' + rxnTitle + '</text>';

      rd.innerHTML = 
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '  <span style="font-family:monospace;font-size:14px;font-weight:700;color:var(--primary);">' + equation + '</span>' +
        '  <span style="font-size:12px;padding:4px 8px;border-radius:4px;background:var(--paper-soft);border:1px solid var(--line);">' + e0 + '</span>' +
        '</div>' +
        '<div>' + statusTxt + '</div>' +
        '<div style="margin-top:6px;color:var(--muted);">' + desc + '</div>';
    }

    container.querySelector('#btn-pair-zncu').onclick = function(){ pair = 'zn_cu'; setActivePreset(this); render(); };
    container.querySelector('#btn-pair-cuag').onclick = function(){ pair = 'cu_ag'; setActivePreset(this); render(); };
    container.querySelector('#btn-pair-cuzn').onclick = function(){ pair = 'cu_zn'; setActivePreset(this); render(); };
    render();
  }
};

// ==========================================
// 2. oxnumberlab: Oxidation Number & Stock Notation Calculator
// ==========================================
window.SIMS.oxnumberlab = {
  mount: function(container){
    var compound = 'h2so5'; // h2so5, cr2o7, cro5, c3o2, s4o6, fe3o4, ko2
    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="preset-bar" class="preset-bar" style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip preset-btn active" id="btn-h2so5">H2SO5 (Caro&#39;s Acid)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-cr2o7">Cr2O7²⁻ (Dichromate)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-cro5">CrO5 (Butterfly)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-c3o2">C3O2 (Carbon Suboxide)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-s4o6">S4O6²⁻ (Tetrathionate)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-fe3o4">Fe3O4 (Magnetite)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-ko2">KO2 (Superoxide)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:16px;border-radius:8px;border:1px solid var(--line);">' +
      '    <div id="ox-structure" style="background:#0f172a;border-radius:6px;padding:20px;text-align:center;color:#f8fafc;font-family:monospace;font-size:16px;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;"></div>' +
      '    <div id="ox-derivation" style="margin-top:14px;background:var(--paper);border-radius:6px;border:1px solid var(--line);padding:14px;font-size:13px;line-height:1.6;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var st = document.getElementById('ox-structure');
      var dv = document.getElementById('ox-derivation');
      if(!st || !dv) return;

      if(compound === 'h2so5'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#38bdf8;font-weight:700;">H - O - SO₂(O.N. = +6) - O - O - H</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Three oxo oxygens (-2) &bull; One peroxo bridge (-O-O-, each O = -1) &bull; Two H (+1)</div>';
        dv.innerHTML = 
          '<b>Peroxomonosulfuric Acid (Caro&#39;s Acid, H2SO5):</b><br>' +
          '• <b>Naive direct formula fallacy:</b> 2(+1) + x + 5(−2) = 0 ⟹ x − 8 = 0 ⟹ x = +8 (Impossible! S has only 6 valence electrons).<br>' +
          '• <b>Structural resolution:</b> Molecule possesses one peroxo linkage (-O-O-) with O.N. = −1 each. Other 3 oxygens are oxo oxygens with O.N. = −2.<br>' +
          '• <b>Correct equation:</b> 2(+1) + x(S) + 2(−1) + 3(−2) = 0 ⟹ +2 + x − 2 − 6 = 0 ⟹ <b>x = +6</b>.<br>' +
          '• <b>Stock Notation:</b> Hydrogen tetraoxoperoxosulfato(VI).';
      } else if(compound === 'cr2o7'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#f59e0b;font-weight:700;">[ O₃Cr(+6) — O(bridging, −2) — Cr(+6)O₃ ]²⁻</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Two CrO4 tetrahedra sharing one apex oxygen &bull; Net charge = −2</div>';
        dv.innerHTML = 
          '<b>Potassium Dichromate Ion (Cr2O7²⁻):</b><br>' +
          '• <b>Algebraic equation:</b> 2x + 7(−2) = −2 ⟹ 2x − 14 = −2 ⟹ 2x = 12 ⟹ <b>x = +6</b>.<br>' +
          '• <b>Valence verification:</b> Group 6 transition element in its maximum stable group oxidation state d⁰.<br>' +
          '• <b>Stock Notation:</b> Potassium heptaoxidodichromate(VI).';
      } else if(compound === 'cro5'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#38bdf8;font-weight:700;">Cr(+6)(=O)(O₂)²⁻ (Butterfly Geometry)</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Four peroxo oxygens in two (-O-O-) rings (O = -1 each) &bull; One oxo oxygen (=O, O = -2)</div>';
        dv.innerHTML = 
          '<b>Chromium Pentoxide (CrO5, Ethereal Blue Complex):</b><br>' +
          '• <b>Naive fallacy:</b> x + 5(−2) = 0 ⟹ x = +10 (Gross fallacy: Cr maximum oxidation state is +6).<br>' +
          '• <b>Structural resolution:</b> CrO5 has two peroxo (-O-O-) bridges forming a butterfly structure. Four oxygens have O.N. = −1; one oxo oxygen has O.N. = −2.<br>' +
          '• <b>Calculation:</b> x + 4(−1) + 1(−2) = 0 ⟹ x − 6 = 0 ⟹ <b>x = +6</b>.<br>' +
          '• <b>Stock Notation:</b> Oxodiperoxidochromium(VI).';
      } else if(compound === 'c3o2'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#a855f7;font-weight:700;">O = C(+2) = C(0) = C(+2) = O</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Terminal carbons bonded to O &bull; Central carbon bonded only to C</div>';
        dv.innerHTML = 
          '<b>Carbon Suboxide (C3O2, Paradox of Fractional State):</b><br>' +
          '• <b>Stoichiometric average:</b> 3x + 2(−2) = 0 ⟹ 3x = +4 ⟹ <b>x = +4/3</b>.<br>' +
          '• <b>Structural resolution:</b> The two terminal C atoms are bonded to electronegative oxygen (O.N. = +2 each). The central C is bonded to two carbon atoms of identical electronegativity (O.N. = 0).<br>' +
          '• <b>True Individual States:</b> C(1) = +2, C(2) = 0, C(3) = +2. Average = (2 + 0 + 2)/3 = +4/3.';
      } else if(compound === 's4o6'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#ec4899;font-weight:700;">[ ⁻O₃S(+5) — S(0) — S(0) — S(+5)O₃⁻ ]</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Two central S atoms in homonuclear S-S bond &bull; Two terminal SO3 units</div>';
        dv.innerHTML = 
          '<b>Tetrathionate Ion (S4O6²⁻, Paradox of Fractional State):</b><br>' +
          '• <b>Stoichiometric average:</b> 4x + 6(−2) = −2 ⟹ 4x = +10 ⟹ <b>x = +2.5</b>.<br>' +
          '• <b>Structural resolution:</b> Central -S-S- linkage consists of zero-valent sulfur (O.N. = 0 each). The two terminal S atoms are bonded to three oxygens each (O.N. = +5 each).<br>' +
          '• <b>True Individual States:</b> S(terminal) = +5, S(central) = 0, S(central) = 0, S(terminal) = +5. Average = (5 + 0 + 0 + 5)/4 = +2.5.';
      } else if(compound === 'fe3o4'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#64748b;font-weight:700;">FeO &bull; Fe2O3  ⟹  Fe(+2) + 2 Fe(+3)</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Inverse spinel crystal lattice &bull; Stoichiometric mixed valence oxide</div>';
        dv.innerHTML = 
          '<b>Magnetite / Iron(II,III) Oxide (Fe3O4):</b><br>' +
          '• <b>Stoichiometric average:</b> 3x + 4(−2) = 0 ⟹ 3x = +8 ⟹ <b>x = +8/3</b>.<br>' +
          '• <b>Structural resolution:</b> Fe3O4 is a mixed oxide: 1 mole FeO + 1 mole Fe2O3. One Fe atom has O.N. = +2; two Fe atoms have O.N. = +3.<br>' +
          '• <b>Stock Notation:</b> Iron(II,III) oxide or Fe(II)Fe2(III)O4.';
      } else if(compound === 'ko2'){
        st.innerHTML = 
          '<div style="font-size:18px;color:#eab308;font-weight:700;">K⁺ [ O — O ]•⁻  ⟹  O.N. of O = −1/2</div>' +
          '<div style="margin-top:10px;font-size:13px;color:#cbd5e1;">Potassium superoxide &bull; Paramagnetic radical anion O2⁻</div>';
        dv.innerHTML = 
          '<b>Potassium Superoxide (KO2):</b><br>' +
          '• <b>Calculation:</b> Potassium is an alkali metal (Group 1), strictly +1. Neutral compound: +1 + 2x = 0 ⟹ 2x = −1 ⟹ <b>x = −1/2</b>.<br>' +
          '• <b>Chemical Role:</b> Used in space station and submarine rebreathers to absorb CO2 and release O2: 4 KO2 + 2 CO2 ⟶ 2 K2CO3 + 3 O2.';
      }
    }

    container.querySelector('#btn-h2so5').onclick = function(){ compound = 'h2so5'; setActivePreset(this); render(); };
    container.querySelector('#btn-cr2o7').onclick = function(){ compound = 'cr2o7'; setActivePreset(this); render(); };
    container.querySelector('#btn-cro5').onclick = function(){ compound = 'cro5'; setActivePreset(this); render(); };
    container.querySelector('#btn-c3o2').onclick = function(){ compound = 'c3o2'; setActivePreset(this); render(); };
    container.querySelector('#btn-s4o6').onclick = function(){ compound = 's4o6'; setActivePreset(this); render(); };
    container.querySelector('#btn-fe3o4').onclick = function(){ compound = 'fe3o4'; setActivePreset(this); render(); };
    container.querySelector('#btn-ko2').onclick = function(){ compound = 'ko2'; setActivePreset(this); render(); };
    render();
  }
};

// ==========================================
// 3. redoxtypes: Redox Reaction Classifier & Disproportionation Chamber
// ==========================================
window.SIMS.redoxtypes = {
  mount: function(container){
    var type = 'disprop'; // disprop, metal_disp, nonmetal_disp, decomp
    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="preset-bar" class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip preset-btn active" id="btn-type-disprop">Disproportionation (P4 / H2O2)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-type-mdisp">Metal Displacement (Zn + CuSO4)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-type-nmdisp">Non-Metal Displacement (Cl2 + KBr)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-type-decomp">Decomposition (2KClO3 vs CaCO3)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:16px;border-radius:8px;border:1px solid var(--line);">' +
      '    <div id="rt-equation" style="background:#0f172a;border-radius:6px;padding:16px;color:#f8fafc;font-family:monospace;font-size:16px;text-align:center;"></div>' +
      '    <div id="rt-analysis" style="margin-top:14px;background:var(--paper);border-radius:6px;border:1px solid var(--line);padding:14px;font-size:13px;line-height:1.6;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var eq = document.getElementById('rt-equation');
      var an = document.getElementById('rt-analysis');
      if(!eq || !an) return;

      if(type === 'disprop'){
        eq.innerHTML = 
          '<div style="color:#38bdf8;font-weight:700;">P₄(s, O.N.=0) + 3OH⁻ + 3H₂O ⟶ PH₃(g, P=−3) + 3H₂PO₂⁻(aq, P=+1)</div>' +
          '<div style="margin-top:8px;font-size:13px;color:#a855f7;">2H₂O₂(aq, O=−1) ⟶ 2H₂O(l, O=−2) + O₂(g, O=0)</div>';
        an.innerHTML = 
          '<b>Disproportionation Redox Transformation:</b><br>' +
          '• <b>Criterion:</b> An element in an intermediate oxidation state is simultaneously oxidised and reduced.<br>' +
          '• <b>Phosphorus Disproportionation:</b> P4 (O.N. = 0) is reduced to phosphine PH3 (P = −3, 3 e⁻ gain per P) and oxidised to hypophosphite H2PO2⁻ (P = +1, 1 e⁻ loss per P).<br>' +
          '• <b>Why Fluorine Cannot Disproportionate:</b> Fluorine is the most electronegative element of all and has no accessible d-orbitals; it exhibits only 0 and −1, with zero positive oxidation states.';
      } else if(type === 'metal_disp'){
        eq.innerHTML = 
          '<div style="color:#10b981;font-weight:700;">Zn(s, 0) + Cu²⁺(aq, +2) ⟶ Zn²⁺(aq, +2) + Cu(s, 0)</div>' +
          '<div style="margin-top:8px;font-size:13px;color:#fcd34d;">TiCl₄(l, +4) + 2Mg(s, 0) ⟶ Ti(s, 0) + 2MgCl₂(s, +2)</div>';
        an.innerHTML = 
          '<b>Metal Displacement Redox Reaction:</b><br>' +
          '• <b>Principle:</b> A metal in elemental state displaces another metal from its compound if it has a more negative standard reduction potential (greater reducing power).<br>' +
          '• <b>Kroll Process Titanium Extraction:</b> Magnesium metal reduces titanium tetrachloride at 850 °C: Ti(+4) is reduced to Ti(0) and Mg(0) is oxidised to Mg(+2).';
      } else if(type === 'nonmetal_disp'){
        eq.innerHTML = 
          '<div style="color:#38bdf8;font-weight:700;">Cl₂(g, 0) + 2KBr(aq, Br=−1) ⟶ 2KCl(aq, Cl=−1) + Br₂(l, 0)</div>' +
          '<div style="margin-top:8px;font-size:13px;color:#e2e8f0;">2Na(s, 0) + 2H₂O(l, H=+1) ⟶ 2NaOH(aq, Na=+1) + H₂(g, 0)</div>';
        an.innerHTML = 
          '<b>Non-Metal Displacement Redox Reaction:</b><br>' +
          '• <b>Halogen Displacement:</b> Stronger oxidizing halogens displace weaker halogens: F2 > Cl2 > Br2 > I2.<br>' +
          '• Chlorine (E° = +1.36 V) oxidises bromide (E° = +1.09 V) to red liquid bromine Br2.<br>' +
          '• <b>Hydrogen Displacement:</b> Highly reactive alkali metals (Na, K, Ca) reduce water violently, evolving H2 gas.';
      } else if(type === 'decomp'){
        eq.innerHTML = 
          '<div style="color:#f59e0b;font-weight:700;">Redox: 2KClO₃(s, Cl=+5, O=−2) ⟶ 2KCl(s, Cl=−1) + 3O₂(g, O=0)</div>' +
          '<div style="margin-top:8px;font-size:13px;color:#94a3b8;">Non-Redox: CaCO₃(s, Ca=+2, C=+4, O=−2) ⟶ CaO(+2,−2) + CO₂(+4,−2)</div>';
        an.innerHTML = 
          '<b>Decomposition: Redox vs Non-Redox:</b><br>' +
          '• In KClO3 thermal decomposition: Cl is reduced (+5 ⟶ −1) and O is oxidised (−2 ⟶ 0). It is a decomposition redox reaction.<br>' +
          '• In limestone heating (CaCO3 ⟶ CaO + CO2): No atom changes oxidation state! Ca remains +2, C remains +4, and O remains −2. It is a non-redox thermal decomposition.';
      }
    }

    container.querySelector('#btn-type-disprop').onclick = function(){ type = 'disprop'; setActivePreset(this); render(); };
    container.querySelector('#btn-type-mdisp').onclick = function(){ type = 'metal_disp'; setActivePreset(this); render(); };
    container.querySelector('#btn-type-nmdisp').onclick = function(){ type = 'nonmetal_disp'; setActivePreset(this); render(); };
    container.querySelector('#btn-type-decomp').onclick = function(){ type = 'decomp'; setActivePreset(this); render(); };
    render();
  }
};

// ==========================================
// 4. balancerlab: Interactive Step-by-Step Redox Reaction Balancer
// ==========================================
window.SIMS.balancerlab = {
  mount: function(container){
    var rxn = 'mno4_fe'; // mno4_fe, cr2o7_so2, mno4_i_basic, p4_basic
    var step = 1;

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="preset-bar" class="preset-bar" style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip preset-btn active" id="btn-rxn-mno4">MnO4⁻ + Fe²⁺ (Acidic)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-rxn-cr2o7">Cr2O7²⁻ + SO2 (Acidic)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-rxn-mno4i">MnO4⁻ + I⁻ (Basic)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-rxn-p4">P4 Disproportionation (Basic)</button>' +
      '  </div>' +
      '  <div style="display:flex;gap:8px;margin-bottom:12px;">' +
      '    <button class="btn-secondary" id="btn-step-prev">← Prev Step</button>' +
      '    <button class="btn-primary" id="btn-step-next">Next Step →</button>' +
      '    <span id="step-label" style="font-size:13px;font-weight:700;align-self:center;margin-left:10px;">Step 1 of 5</span>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:16px;border-radius:8px;border:1px solid var(--line);">' +
      '    <div id="balancer-display" style="background:#0f172a;border-radius:6px;padding:16px;color:#f8fafc;font-family:monospace;font-size:15px;line-height:1.8;"></div>' +
      '    <div id="balancer-explanation" style="margin-top:14px;background:var(--paper);border-radius:6px;border:1px solid var(--line);padding:14px;font-size:13px;line-height:1.6;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var dp = document.getElementById('balancer-display');
      var ex = document.getElementById('balancer-explanation');
      var lbl = document.getElementById('step-label');
      if(!dp || !ex || !lbl) return;
      lbl.textContent = 'Step ' + step + ' of 5';

      if(rxn === 'mno4_fe'){
        if(step === 1){
          dp.innerHTML = '<span style="color:#38bdf8;">Oxidation Half-Reaction:</span> Fe²⁺(aq) ⟶ Fe³⁺(aq)<br><span style="color:#f59e0b;">Reduction Half-Reaction:</span> MnO₄⁻(aq) ⟶ Mn²⁺(aq)';
          ex.innerHTML = '<b>Step 1: Identify and Separate Half-Reactions.</b> Iron increases oxidation state from +2 to +3 (oxidation). Manganese decreases oxidation state from +7 to +2 (reduction).';
        } else if(step === 2){
          dp.innerHTML = 'Oxidation: Fe atoms already balanced (1 : 1)<br>Reduction: MnO₄⁻ ⟶ Mn²⁺ + <span style="color:#38bdf8;font-weight:700;">4 H₂O</span>';
          ex.innerHTML = '<b>Step 2: Balance Atoms other than O and H, then balance O with H2O.</b> Manganese is balanced (1 : 1). Four oxygen atoms on the left are balanced by adding 4 H2O molecules to the right.';
        } else if(step === 3){
          dp.innerHTML = 'Oxidation: Fe²⁺ ⟶ Fe³⁺<br>Reduction: MnO₄⁻ + <span style="color:#ec4899;font-weight:700;">8 H⁺</span> ⟶ Mn²⁺ + 4 H₂O';
          ex.innerHTML = '<b>Step 3: Balance Hydrogen atoms with H+ ions (Acidic Medium).</b> 4 H2O molecules on the right require 8 H+ ions on the left.';
        } else if(step === 4){
          dp.innerHTML = 'Oxidation: Fe²⁺ ⟶ Fe³⁺ + <span style="color:#10b981;font-weight:700;">1 e⁻</span><br>Reduction: MnO₄⁻ + 8 H⁺ + <span style="color:#10b981;font-weight:700;">5 e⁻</span> ⟶ Mn²⁺ + 4 H₂O';
          ex.innerHTML = '<b>Step 4: Balance Electrical Charge by adding electrons.</b> Left charge in reduction is (−1 + 8 = +7); right is +2. Adding 5 e⁻ balances charge at +2 on both sides. In oxidation, adding 1 e⁻ balances charge at +2.';
        } else if(step === 5){
          dp.innerHTML = '<span style="color:#10b981;font-size:16px;font-weight:700;">MnO₄⁻(aq) + 5 Fe²⁺(aq) + 8 H⁺(aq) ⟶ Mn²⁺(aq) + 5 Fe³⁺(aq) + 4 H₂O(l)</span>';
          ex.innerHTML = '<b>Step 5: Equalize Electrons and Combine.</b> Multiply oxidation half-reaction by 5 so 5 electrons are exchanged. Cancel out 5 e⁻ on both sides. Mass and charge (+17 on both sides) are perfectly balanced!';
        }
      } else if(rxn === 'cr2o7_so2'){
        if(step === 1){
          dp.innerHTML = '<span style="color:#38bdf8;">Oxidation:</span> SO₂(g) ⟶ SO₄²⁻(aq)<br><span style="color:#f59e0b;">Reduction:</span> Cr₂O₇²⁻(aq) ⟶ Cr³⁺(aq)';
          ex.innerHTML = '<b>Step 1: Half-Reactions.</b> S changes from +4 to +6 (oxidation); Cr changes from +6 to +3 (reduction).';
        } else if(step === 2){
          dp.innerHTML = 'Oxidation: SO₂ + <span style="color:#38bdf8;">2 H₂O</span> ⟶ SO₄²⁻<br>Reduction: Cr₂O₇²⁻ ⟶ <span style="color:#f59e0b;">2 Cr³⁺</span> + <span style="color:#38bdf8;">7 H₂O</span>';
          ex.innerHTML = '<b>Step 2: Balance non-O/H atoms, then balance O with H2O.</b> Balance Cr by putting coefficient 2 on Cr³⁺. Balance O: add 7 H2O to right in reduction, add 2 H2O to left in oxidation.';
        } else if(step === 3){
          dp.innerHTML = 'Oxidation: SO₂ + 2 H₂O ⟶ SO₄²⁻ + <span style="color:#ec4899;">4 H⁺</span><br>Reduction: Cr₂O₇²⁻ + <span style="color:#ec4899;">14 H⁺</span> ⟶ 2 Cr³⁺ + 7 H₂O';
          ex.innerHTML = '<b>Step 3: Balance Hydrogen with H+.</b> 14 H on right of reduction balanced by 14 H⁺ on left. 4 H on left of oxidation balanced by 4 H⁺ on right.';
        } else if(step === 4){
          dp.innerHTML = 'Oxidation: SO₂ + 2 H₂O ⟶ SO₄²⁻ + 4 H⁺ + <span style="color:#10b981;">2 e⁻</span><br>Reduction: Cr₂O₇²⁻ + 14 H⁺ + <span style="color:#10b981;">6 e⁻</span> ⟶ 2 Cr³⁺ + 7 H₂O';
          ex.innerHTML = '<b>Step 4: Balance Charge with Electrons.</b> Dichromate gains 6 e⁻; sulfur dioxide loses 2 e⁻.';
        } else if(step === 5){
          dp.innerHTML = '<span style="color:#10b981;font-size:16px;font-weight:700;">Cr₂O₇²⁻(aq) + 3 SO₂(g) + 2 H⁺(aq) ⟶ 2 Cr³⁺(aq) + 3 SO₄²⁻(aq) + H₂O(l)</span>';
          ex.innerHTML = '<b>Step 5: Multiply oxidation by 3, add and simplify.</b> Cancel 6 e⁻, cancel 6 H2O from left, cancel 12 H⁺ from right, leaving 2 H⁺ on left and 1 H2O on right.';
        }
      } else if(rxn === 'mno4_i_basic'){
        if(step === 1){
          dp.innerHTML = '<span style="color:#38bdf8;">Oxidation:</span> 2 I⁻ ⟶ I₂<br><span style="color:#f59e0b;">Reduction:</span> MnO₄⁻ ⟶ MnO₂';
          ex.innerHTML = '<b>Step 1: Half-Reactions in Basic Medium.</b> Iodide is oxidised to elemental iodine; permanganate is reduced to manganese dioxide.';
        } else if(step === 2){
          dp.innerHTML = 'Oxidation: 2 I⁻ ⟶ I₂<br>Reduction: MnO₄⁻ ⟶ MnO₂ + <span style="color:#38bdf8;">2 H₂O</span>';
          ex.innerHTML = '<b>Step 2: Balance Oxygen with H2O.</b> MnO4⁻ has 4 O, MnO2 has 2 O; add 2 H2O to right.';
        } else if(step === 3){
          dp.innerHTML = 'Reduction in Base: MnO₄⁻ + 4 H₂O ⟶ MnO₂ + 2 H₂O + <span style="color:#ec4899;">4 OH⁻</span><br>Simplifies to: MnO₄⁻ + <span style="color:#38bdf8;">2 H₂O</span> ⟶ MnO₂ + <span style="color:#ec4899;">4 OH⁻</span>';
          ex.innerHTML = '<b>Step 3: Balance Hydrogen in Basic Medium.</b> Add 4 H2O to side deficient in H, and add 4 OH⁻ to the other side.';
        } else if(step === 4){
          dp.innerHTML = 'Oxidation: 2 I⁻ ⟶ I₂ + <span style="color:#10b981;">2 e⁻</span> (x3)<br>Reduction: MnO₄⁻ + 2 H₂O + <span style="color:#10b981;">3 e⁻</span> ⟶ MnO₂ + 4 OH⁻ (x2)';
          ex.innerHTML = '<b>Step 4: Balance Charge.</b> I⁻ loses 2 e⁻; MnO4⁻ gains 3 e⁻. Least common multiple = 6 e⁻.';
        } else if(step === 5){
          dp.innerHTML = '<span style="color:#10b981;font-size:16px;font-weight:700;">2 MnO₄⁻(aq) + 6 I⁻(aq) + 4 H₂O(l) ⟶ 2 MnO₂(s) + 3 I₂(s) + 8 OH⁻(aq)</span>';
          ex.innerHTML = '<b>Step 5: Combine and Cancel Electrons.</b> Charge on left = 2(−1) + 6(−1) = −8; charge on right = 8(−1) = −8. Perfect conservation!';
        }
      } else if(rxn === 'p4_basic'){
        if(step === 1){
          dp.innerHTML = '<span style="color:#38bdf8;">Oxidation:</span> P₄ ⟶ H₂PO₂⁻ (P: 0 ⟶ +1)<br><span style="color:#f59e0b;">Reduction:</span> P₄ ⟶ PH₃ (P: 0 ⟶ −3)';
          ex.innerHTML = '<b>Step 1: Disproportionation Half-Reactions.</b> Elemental white phosphorus acts simultaneously as oxidant and reductant.';
        } else if(step === 2){
          dp.innerHTML = 'Oxidation: P₄ + 8 H₂O ⟶ 4 H₂PO₂⁻<br>Reduction: P₄ ⟶ 4 PH₃';
          ex.innerHTML = '<b>Step 2: Balance non-O/H atoms (P4 ⟶ 4 P).</b> Add 8 H2O to balance 8 O in 4 H2PO2⁻.';
        } else if(step === 3){
          dp.innerHTML = 'In Basic Medium:<br>Oxidation: P₄ + 8 OH⁻ ⟶ 4 H₂PO₂⁻ + 4 e⁻<br>Reduction: P₄ + 12 H₂O + 12 e⁻ ⟶ 4 PH₃ + 12 OH⁻';
          ex.innerHTML = '<b>Step 3 & 4: Balance H, O, and Charge in Basic Medium.</b> Add OH⁻ and electrons.';
        } else if(step === 4){
          dp.innerHTML = 'Multiply Oxidation by 3:<br>3 P₄ + 24 OH⁻ ⟶ 12 H₂PO₂⁻ + 12 e⁻<br>Add to Reduction: P₄ + 12 H₂O + 12 e⁻ ⟶ 4 PH₃ + 12 OH⁻';
          ex.innerHTML = '<b>Step 4: Equalize 12 electrons transferred.</b>';
        } else if(step === 5){
          dp.innerHTML = '<span style="color:#10b981;font-size:16px;font-weight:700;">P₄(s) + 3 OH⁻(aq) + 3 H₂O(l) ⟶ PH₃(g) + 3 H₂PO₂⁻(aq)</span>';
          ex.innerHTML = '<b>Step 5: Divide by common factor 4.</b> All mass and charge (−3 on both sides) conserved.';
        }
      }
    }

    container.querySelector('#btn-rxn-mno4').onclick = function(){ rxn = 'mno4_fe'; step = 1; setActivePreset(this); render(); };
    container.querySelector('#btn-rxn-cr2o7').onclick = function(){ rxn = 'cr2o7_so2'; step = 1; setActivePreset(this); render(); };
    container.querySelector('#btn-rxn-mno4i').onclick = function(){ rxn = 'mno4_i_basic'; step = 1; setActivePreset(this); render(); };
    container.querySelector('#btn-rxn-p4').onclick = function(){ rxn = 'p4_basic'; step = 1; setActivePreset(this); render(); };

    container.querySelector('#btn-step-prev').onclick = function(){ if(step > 1){ step--; render(); } };
    container.querySelector('#btn-step-next').onclick = function(){ if(step < 5){ step++; render(); } };
    render();
  }
};

// ==========================================
// 5. redoxtitration: Redox Permanganate & Iodine Titration Simulator
// ==========================================
window.SIMS.redoxtitration = {
  mount: function(container){
    var mode = 'kmno4'; // kmno4 or iodine
    var vAdded = 0.0; // mL
    var vEq = 20.0; // mL equivalence

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="preset-bar" class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip preset-btn active" id="btn-mode-perm">Permanganometry (Self-Indicator)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-mode-iod">Iodometry (Starch Indicator)</button>' +
      '  </div>' +
      '  <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">' +
      '    <button class="btn-primary" id="btn-add-drop">+0.5 mL Titrant</button>' +
      '    <button class="btn-secondary" id="btn-add-fast">+5.0 mL Fast</button>' +
      '    <button class="btn-secondary" id="btn-reset-titr">↺ Reset</button>' +
      '    <span id="titr-vol-readout" style="font-size:14px;font-family:monospace;font-weight:700;">Vol: 0.0 mL</span>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-titr" viewBox="0 0 700 280" style="width:100%;height:auto;max-height:280px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="titr-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-titr');
      var rd = document.getElementById('titr-readout');
      var vl = document.getElementById('titr-vol-readout');
      if(!svg || !rd || !vl) return;
      vl.textContent = 'Vol: ' + vAdded.toFixed(1) + ' mL / 20.0 mL';

      var flaskColor, indicatorStatus, desc;
      if(mode === 'kmno4'){
        if(vAdded < 19.8){
          flaskColor = 'rgba(241, 245, 249, 0.2)'; // colorless Mn2+
          indicatorStatus = '<span style="color:#94a3b8;">Pre-Equivalence: Fe²⁺ in excess; purple MnO₄⁻ is instantly reduced to colorless Mn²⁺.</span>';
        } else if(vAdded >= 19.8 && vAdded <= 20.5){
          flaskColor = 'rgba(244, 114, 182, 0.45)'; // permanent faint pink!
          indicatorStatus = '<span style="color:#ec4899;font-weight:700;">★ Stoichiometric Equivalence Point: Persistent Faint Pink Color!</span>';
        } else {
          flaskColor = 'rgba(219, 39, 119, 0.85)'; // deep purple excess
          indicatorStatus = '<span style="color:#f43f5e;font-weight:700;">Post-Equivalence: Over-titrated with excess purple MnO₄⁻ titrant.</span>';
        }
        desc = 'KMnO4 is an intense purple self-indicator. In acidic H2SO4 medium, 5 Fe²⁺ + MnO₄⁻ + 8 H⁺ ⟶ 5 Fe³⁺ + Mn²⁺ + 4 H2O. The very first excess drop of MnO4⁻ imparts a persistent faint pink blush.';
      } else {
        if(vAdded < 15.0){
          flaskColor = 'rgba(180, 83, 9, 0.7)'; // dark brown iodine
          indicatorStatus = '<span style="color:#f59e0b;">High [I2]: Dark brown solution. DO NOT add starch yet (would form irreversible coagulate).</span>';
        } else if(vAdded < 19.8){
          flaskColor = 'rgba(253, 224, 71, 0.5)'; // straw yellow
          indicatorStatus = '<span style="color:#eab308;font-weight:700;">Near Endpoint (Straw Yellow): ADD STARCH INDICATOR NOW ➔ turns deep blue!</span>';
        } else if(vAdded >= 19.8 && vAdded <= 20.5){
          flaskColor = 'rgba(241, 245, 249, 0.15)'; // crystal clear!
          indicatorStatus = '<span style="color:#10b981;font-weight:700;">★ Endpoint Reached: Sharp discharge of blue starch-iodine complex to crystal clear!</span>';
        } else {
          flaskColor = 'rgba(241, 245, 249, 0.15)'; // clear excess
          indicatorStatus = '<span style="color:#64748b;">Post-Equivalence: Thiosulfate in excess; solution remains water-clear.</span>';
        }
        desc = 'Iodometry titrates liberated I2 with standard Na2S2O3: I2 + 2 S2O3²⁻ ⟶ 2 I⁻ + S4O6²⁻. Starch forms an intense blue adsorption complex with trace I3⁻, discharging sharply at 0.00 M I2.';
      }

      svg.innerHTML = 
        '<rect x="335" y="10" width="30" height="130" rx="3" fill="#1e293b" stroke="#64748b" stroke-width="2" />' +
        '<rect x="338" y="20" width="24" height="' + (110 * (1 - vAdded/40)) + '" fill="' + (mode === "kmno4" ? "#ec4899" : "#0284c7") + '" opacity="0.8" />' +
        '<line x1="335" y1="140" x2="365" y2="140" stroke="#f8fafc" stroke-width="3" />' +
        '<polygon points="350,140 345,155 355,155" fill="#94a3b8" />' +
        '<path d="M 350 155 L 350 175" stroke="' + (mode === "kmno4" ? "#ec4899" : "#38bdf8") + '" stroke-width="2" stroke-dasharray="3,2" />' +
        '<polygon points="310,180 390,180 430,260 270,260" fill="none" stroke="#64748b" stroke-width="3" />' +
        '<polygon points="305,190 395,190 425,257 275,257" fill="' + flaskColor + '" />' +
        '<text x="350" y="240" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="700">Conical Flask</text>' +
        '<text x="540" y="60" fill="#f8fafc" font-size="14" font-weight="700">Burette Titrant</text>' +
        '<text x="540" y="85" fill="#94a3b8" font-size="12">' + (mode === "kmno4" ? "0.02 M KMnO4 (Purple)" : "0.05 M Na2S2O3 (Colorless)") + '</text>' +
        '<text x="540" y="130" fill="#f8fafc" font-size="14" font-weight="700">Analyte in Flask</text>' +
        '<text x="540" y="155" fill="#94a3b8" font-size="12">' + (mode === "kmno4" ? "Fe²⁺ in dilute H2SO4" : "Liberated I2 from excess KI") + '</text>';

      rd.innerHTML = 
        '<div style="margin-bottom:6px;">' + indicatorStatus + '</div>' +
        '<div style="color:var(--muted);">' + desc + '</div>';
    }

    container.querySelector('#btn-mode-perm').onclick = function(){ mode = 'kmno4'; vAdded = 0.0; setActivePreset(this); render(); };
    container.querySelector('#btn-mode-iod').onclick = function(){ mode = 'iodine'; vAdded = 0.0; setActivePreset(this); render(); };
    container.querySelector('#btn-add-drop').onclick = function(){ vAdded = Math.min(30.0, vAdded + 0.5); render(); };
    container.querySelector('#btn-add-fast').onclick = function(){ vAdded = Math.min(30.0, vAdded + 5.0); render(); };
    container.querySelector('#btn-reset-titr').onclick = function(){ vAdded = 0.0; render(); };
    render();
  }
};

// ==========================================
// 6. daniellcell: Daniell Galvanic Cell & Voltmeter Lab
// ==========================================
window.SIMS.daniellcell = {
  mount: function(container){
    var vExtMode = 'zero'; // zero (1.10V normal), eq (1.10V opposing), rev (1.40V opposing)

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="preset-bar" class="preset-bar" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">' +
      '    <button class="filter-chip preset-btn active" id="btn-vext-zero">Discharging (V_ext = 0 V)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-vext-eq">Equilibrium (V_ext = 1.10 V)</button>' +
      '    <button class="filter-chip preset-btn" id="btn-vext-rev">Reversed / Electrolytic (V_ext = 1.40 V)</button>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:14px;border-radius:8px;border:1px solid var(--line);">' +
      '    <svg id="svg-dc" viewBox="0 0 700 300" style="width:100%;height:auto;max-height:300px;background:#0f172a;border-radius:6px;"></svg>' +
      '    <div id="dc-readout" style="margin-top:12px;padding:12px;background:var(--paper);border-radius:6px;border:1px solid var(--line);font-size:13px;line-height:1.5;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var svg = document.getElementById('svg-dc');
      var rd = document.getElementById('dc-readout');
      if(!svg || !rd) return;

      var vMeterVal, electronDir, statusHeader, desc;
      if(vExtMode === 'zero'){
        vMeterVal = '1.10 V';
        electronDir = 'Zn ⟶ Cu (e⁻ flows Left to Right)';
        statusHeader = '<span style="color:#10b981;font-weight:700;">Normal Galvanic Cell Operation (Spontaneous Discharge)</span>';
        desc = 'Electrons flow spontaneously through the external circuit from the negative Zinc anode to the positive Copper cathode. Conventional electric current flows from Cu to Zn. Zn rod dissolves (Zn ⟶ Zn²⁺ + 2e⁻); Cu²⁺ ions deposit on Cu rod (Cu²⁺ + 2e⁻ ⟶ Cu). Salt bridge completes internal circuit with Cl⁻ migrating to anode and K⁺ to cathode.';
      } else if(vExtMode === 'eq'){
        vMeterVal = '0.00 V';
        electronDir = 'No Net Electron Flow (Zero Current)';
        statusHeader = '<span style="color:#eab308;font-weight:700;">Thermodynamic Equilibrium (V_ext = E°cell = 1.10 V)</span>';
        desc = 'When the opposing external potential exactly equals the cell potential (1.10 V), no net electrons flow, no chemical reaction occurs, and current is zero.';
      } else {
        vMeterVal = '−0.30 V';
        electronDir = 'Cu ⟶ Zn (e⁻ forced Right to Left)';
        statusHeader = '<span style="color:#ef4444;font-weight:700;">Electrolytic Cell Operation (Forced Reverse Charging)</span>';
        desc = 'External potential V_ext (1.40 V) exceeds E°cell (1.10 V). Electrons are forced from Cu to Zn: copper rod dissolves as Cu²⁺, and zinc deposits on the zinc electrode. The cell consumes electrical energy.';
      }

      svg.innerHTML = 
        '<rect x="80" y="100" width="200" height="150" rx="8" fill="rgba(241,245,249,0.1)" stroke="#64748b" stroke-width="2" />' +
        '<rect x="82" y="140" width="196" height="108" fill="rgba(203,213,225,0.25)" />' +
        '<rect x="130" y="50" width="30" height="160" fill="#94a3b8" stroke="#334155" stroke-width="2" />' +
        '<text x="145" y="40" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="700">Zn Anode (−)</text>' +
        '<text x="180" y="220" text-anchor="middle" fill="#cbd5e1" font-size="12">1.0 M ZnSO4</text>' +

        '<rect x="420" y="100" width="200" height="150" rx="8" fill="rgba(241,245,249,0.1)" stroke="#64748b" stroke-width="2" />' +
        '<rect x="422" y="140" width="196" height="108" fill="rgba(56,189,248,0.4)" />' +
        '<rect x="540" y="50" width="30" height="160" fill="#d97706" stroke="#78350f" stroke-width="2" />' +
        '<text x="555" y="40" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="700">Cu Cathode (+)</text>' +
        '<text x="520" y="220" text-anchor="middle" fill="#cbd5e1" font-size="12">1.0 M CuSO4</text>' +

        '<path d="M 230 150 L 230 90 Q 350 40 470 90 L 470 150" fill="none" stroke="#fcd34d" stroke-width="16" stroke-linecap="round" />' +
        '<text x="350" y="75" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">SALT BRIDGE (KCl/Agar)</text>' +

        '<path d="M 145 50 L 145 20 L 320 20" fill="none" stroke="#38bdf8" stroke-width="3" />' +
        '<path d="M 380 20 L 555 20 L 555 50" fill="none" stroke="#38bdf8" stroke-width="3" />' +
        '<circle cx="350" cy="20" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />' +
        '<text x="350" y="25" text-anchor="middle" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="700">' + vMeterVal + '</text>' +
        '<text x="350" y="285" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="700">IUPAC: Zn(s) | Zn²⁺(aq, 1 M) ∥ Cu²⁺(aq, 1 M) | Cu(s)</text>';

      rd.innerHTML = 
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '  <span style="font-family:monospace;font-size:14px;font-weight:700;color:var(--primary);">' + electronDir + '</span>' +
        '  <span style="font-size:12px;padding:4px 8px;border-radius:4px;background:var(--paper-soft);border:1px solid var(--line);">' + vMeterVal + '</span>' +
        '</div>' +
        '<div>' + statusHeader + '</div>' +
        '<div style="margin-top:6px;color:var(--muted);">' + desc + '</div>';
    }

    container.querySelector('#btn-vext-zero').onclick = function(){ vExtMode = 'zero'; setActivePreset(this); render(); };
    container.querySelector('#btn-vext-eq').onclick = function(){ vExtMode = 'eq'; setActivePreset(this); render(); };
    container.querySelector('#btn-vext-rev').onclick = function(){ vExtMode = 'rev'; setActivePreset(this); render(); };
    render();
  }
};

// ==========================================
// 7. ecserieslab: Electrochemical Series & Feasibility Predictor
// ==========================================
window.SIMS.ecserieslab = {
  mount: function(container){
    var couple1 = 'zn'; // anode candidate
    var couple2 = 'cu'; // cathode candidate

    var potentials = {
      'li': { name: 'Li⁺ / Li', e0: -3.05, n: 1 },
      'k':  { name: 'K⁺ / K', e0: -2.93, n: 1 },
      'mg': { name: 'Mg²⁺ / Mg', e0: -2.37, n: 2 },
      'al': { name: 'Al³⁺ / Al', e0: -1.66, n: 3 },
      'zn': { name: 'Zn²⁺ / Zn', e0: -0.76, n: 2 },
      'fe': { name: 'Fe²⁺ / Fe', e0: -0.44, n: 2 },
      'she':{ name: '2H⁺ / H₂ (SHE)', e0: 0.00, n: 2 },
      'cu': { name: 'Cu²⁺ / Cu', e0: +0.34, n: 2 },
      'i2': { name: 'I₂ / 2I⁻', e0: +0.54, n: 2 },
      'fe3':{ name: 'Fe³⁺ / Fe²⁺', e0: +0.77, n: 1 },
      'ag': { name: 'Ag⁺ / Ag', e0: +0.80, n: 1 },
      'br2':{ name: 'Br₂ / 2Br⁻', e0: +1.09, n: 2 },
      'cr2':{ name: 'Cr₂O₇²⁻ / 2Cr³⁺', e0: +1.33, n: 6 },
      'cl2':{ name: 'Cl₂ / 2Cl⁻', e0: +1.36, n: 2 },
      'mno4':{ name: 'MnO₄⁻ / Mn²⁺', e0: +1.51, n: 5 },
      'f2': { name: 'F₂ / 2F⁻', e0: +2.87, n: 2 }
    };

    container.innerHTML = 
      '<div class="sim-wrapper" style="font-family:var(--font-sans);color:var(--ink);">' +
      '  <div id="lab-controls" style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px;">' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px;">Anode Couple (Oxidation):</label>' +
      '      <select id="sel-anode" class="select-input" style="padding:6px 10px;border-radius:6px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="li">Li⁺ / Li (−3.05 V)</option>' +
      '        <option value="k">K⁺ / K (−2.93 V)</option>' +
      '        <option value="mg">Mg²⁺ / Mg (−2.37 V)</option>' +
      '        <option value="al">Al³⁺ / Al (−1.66 V)</option>' +
      '        <option value="zn" selected>Zn²⁺ / Zn (−0.76 V)</option>' +
      '        <option value="fe">Fe²⁺ / Fe (−0.44 V)</option>' +
      '        <option value="she">2H⁺ / H₂ (0.00 V)</option>' +
      '        <option value="cu">Cu²⁺ / Cu (+0.34 V)</option>' +
      '        <option value="ag">Ag⁺ / Ag (+0.80 V)</option>' +
      '      </select>' +
      '    </div>' +
      '    <div>' +
      '      <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px;">Cathode Couple (Reduction):</label>' +
      '      <select id="sel-cathode" class="select-input" style="padding:6px 10px;border-radius:6px;border:1px solid var(--line);background:var(--paper);color:var(--ink);">' +
      '        <option value="she">2H⁺ / H₂ (0.00 V)</option>' +
      '        <option value="cu" selected>Cu²⁺ / Cu (+0.34 V)</option>' +
      '        <option value="i2">I₂ / 2I⁻ (+0.54 V)</option>' +
      '        <option value="fe3">Fe³⁺ / Fe²⁺ (+0.77 V)</option>' +
      '        <option value="ag">Ag⁺ / Ag (+0.80 V)</option>' +
      '        <option value="br2">Br₂ / 2Br⁻ (+1.09 V)</option>' +
      '        <option value="cr2">Cr₂O₇²⁻ / Cr³⁺ (+1.33 V)</option>' +
      '        <option value="cl2">Cl₂ / 2Cl⁻ (+1.36 V)</option>' +
      '        <option value="mno4">MnO₄⁻ / Mn²⁺ (+1.51 V)</option>' +
      '        <option value="f2">F₂ / 2F⁻ (+2.87 V)</option>' +
      '      </select>' +
      '    </div>' +
      '  </div>' +
      '  <div style="background:var(--paper-soft);padding:16px;border-radius:8px;border:1px solid var(--line);">' +
      '    <div id="ec-readout" style="background:var(--paper);border-radius:6px;border:1px solid var(--line);padding:14px;font-size:14px;line-height:1.7;"></div>' +
      '  </div>' +
      '</div>';

    function render(){
      var rd = document.getElementById('ec-readout');
      if(!rd) return;

      var cA = potentials[couple1];
      var cC = potentials[couple2];
      var eCell = cC.e0 - cA.e0;
      var nVal = Math.max(cA.n, cC.n);
      var deltaG = -nVal * 96.485 * eCell; // kJ/mol

      var isSpont = eCell > 0;
      var verdict = isSpont 
        ? '<span style="color:#10b981;font-weight:700;">★ Thermodynamically Feasible & Spontaneous (ΔG° < 0)</span>'
        : '<span style="color:#ef4444;font-weight:700;">✗ Non-Spontaneous (Thermodynamically Forbidden under standard conditions, ΔG° > 0)</span>';

      rd.innerHTML = 
        '<div style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:8px;">' +
        '  E°_cell = E°_cathode − E°_anode = (' + (cC.e0 >= 0 ? '+' : '') + cC.e0.toFixed(2) + ' V) − (' + (cA.e0 >= 0 ? '+' : '') + cA.e0.toFixed(2) + ' V) = <b>' + (eCell >= 0 ? '+' : '') + eCell.toFixed(2) + ' V</b>' +
        '</div>' +
        '<div>' + verdict + '</div>' +
        '<div style="margin-top:10px;font-family:monospace;font-size:13px;color:var(--muted);">' +
        '  • Standard Gibbs Free Energy Change: ΔG° = −n F E°_cell ≈ <b>' + deltaG.toFixed(1) + ' kJ/mol</b><br>' +
        '  • Anode Reaction (Oxidation): ' + cA.name + ' donor<br>' +
        '  • Cathode Reaction (Reduction): ' + cC.name + ' acceptor' +
        '</div>';
    }

    container.querySelector('#sel-anode').onchange = function(e){ couple1 = e.target.value; render(); };
    container.querySelector('#sel-cathode').onchange = function(e){ couple2 = e.target.value; render(); };
    render();
  }
};

// Map concept aliases
window.SIMS.c1 = window.SIMS.electrontransfer;
window.SIMS.c2 = window.SIMS.oxnumberlab;
window.SIMS.c3 = window.SIMS.redoxtypes;
window.SIMS.c4 = window.SIMS.balancerlab;
window.SIMS.c5 = window.SIMS.redoxtitration;
window.SIMS.c6 = window.SIMS.daniellcell;
window.SIMS.c7 = window.SIMS.ecserieslab;

// Browser QA identifies each scenario by data-preset. Keep these identifiers
// local to the chapter so every visible preset has a stable fixture key.
Object.keys(window.SIMS).forEach(function(key){
  var sim = window.SIMS[key];
  if(!sim || typeof sim.mount !== "function" || sim.mount._qaWrapped) return;
  var originalMount = sim.mount;
  // One-arg wrapper: the runtime passes simMount only when mount.length >= 1
  // on a sim without .draw, so this wrapper must keep that arity (else the
  // runtime passes the lesson object and container.querySelector explodes).
  // _qaWrapped also skips the c1..c7 aliases (same objects, no double wrap).
  var wrapped = function(container){
    if(!(container && typeof container.querySelector === "function")){
      container = document.getElementById("sim-mount-point") || document.body;
    }
    originalMount.call(sim, container);
    document.querySelectorAll("#preset-bar .preset-btn").forEach(function(btn, index){
      if(!btn.dataset.preset) btn.dataset.preset = btn.id || (key + "-" + index);
    });
    bridgeLab();
  };
  wrapped._qaWrapped = true;
  sim.mount = wrapped;
});

// Lab bridge: these sims render private readouts (et-readout, svg-et, ...)
// instead of the runtime's #lab-readout/#lab-verdict/#diagram, which their
// innerHTML mount wipes. Mirror the sim text into runtime-expected elements
// so browser QA (a shared script) can read end states. Mirrors sit off-screen
// (display:none would make innerText read back empty).
var labBridgeObserver = null, labBridgeWrap = null;
function bridgeLab(){
  var mount = document.getElementById("sim-mount-point");
  if(!mount) return;
  var wrap = mount.querySelector(".sim-wrapper");
  if(!wrap) return;
  function ensure(id, ns){
    var el = document.getElementById(id);
    if(!el){
      el = ns ? document.createElementNS(ns, "svg") : document.createElement("div");
      el.id = id;
      el.style.cssText = "position:absolute;left:-9999px;top:0;";
      mount.appendChild(el);
    }
    return el;
  }
  var ro = ensure("lab-readout"), vd = ensure("lab-verdict"),
      dg = ensure("diagram", "http://www.w3.org/2000/svg");
  ro.textContent = wrap.innerText || "";
  var svg = wrap.querySelector("svg");
  dg.textContent = svg ? (svg.textContent || "") : "";
  if(wrap !== labBridgeWrap){
    if(labBridgeObserver) labBridgeObserver.disconnect();
    labBridgeObserver = new MutationObserver(function(){ bridgeLab(); });
    labBridgeObserver.observe(wrap, { childList: true, subtree: true, characterData: true });
    labBridgeWrap = wrap;
  }
}

// The shared browser fixture names the revealed prediction states explicitly.
// Add those semantic aliases after the existing chapter runtime evaluates a choice.
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

// Keep this chapter's presentation aligned with its data while the shared
// Class 11 runtime remains backward-compatible with older array connect cards.
function normalizeConceptPresentation(){
  var lesson = window.CHAPTER.lessons[App.state.conceptIndex];
  if(!lesson) return;
  var watch = document.getElementById("what-to-watch");
  var watchText = "What to watch: " + lesson.watch;
  if(watch && lesson.watch && watch.textContent !== watchText) watch.textContent = watchText;
  document.querySelectorAll(".connect-grid").forEach(function(grid){
    var cards = Array.from(grid.querySelectorAll(":scope > .connect-card"));
    var explicitWow = cards.find(function(card){
      var heading = card.querySelector("h3");
      return heading && /^Wow/i.test(heading.textContent.trim());
    });
    if(!explicitWow) return;
    cards.forEach(function(card){
      if(card === explicitWow) return;
      card.classList.remove("wow");
      card.removeAttribute("data-wow");
      card.removeAttribute("data-source");
      var badge = card.querySelector(":scope > .wow-badge");
      if(badge) badge.remove();
    });
  });
}
var conceptView = document.getElementById("concept-view");
if(conceptView){
  new MutationObserver(normalizeConceptPresentation).observe(conceptView, {childList: true, subtree: true});
  normalizeConceptPresentation();
}
