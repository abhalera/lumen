(function() {
  'use strict';
  var C = window.CHAPTER;
  var state = { question: 0, answers: {}, correct: {}, sim: {}, simReady: false, section: '' };
  function $(id) { return document.getElementById(id); }
  function esc(value) { return String(value).replace(/[&<>"']/g, function(ch) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]; }); }
  function lessonPage(section) {
    var item = (C.sectionMap || []).find(function(entry) { return entry.section === section; });
    return item ? item.page : 1;
  }
  function sourceLink(page, label) { return '<a href="' + C.source + '#page=' + page + '" target="_blank" rel="noopener">' + (label || 'NCERT source ' + pg(page)) + ' ↗</a>'; }
  function pg(page) { var off = C.pageOffset || 0; return 'PDF p.' + page + ' · printed p.' + (page + off); }
  function answerKey() { return C.code + '-' + state.question; }
  function currentQuestion() { return C.practice[state.question]; }
  function ensureSim() {
    if (!state.simReady) { state.sim = Object.assign({}, C.sim.defaults || {}); state.simReady = true; }
  }
  function updateProgress() {
    var done = Object.keys(state.correct).length;
    $('progress').value = done;
    $('progress-text').textContent = done + ' / ' + C.practice.length;
  }
  function renderNav() {
    var html = '';
    var activeSection = state.section || ((C.sectionMap || [])[0] || {}).section;
    (C.sectionMap || []).forEach(function(item, index) {
      html += '<button type="button" class="' + (item.section === activeSection ? 'active' : '') + '" data-section="' + item.section + '" data-index="' + index + '"><span class="side-num">' + esc(item.section) + '</span>' + esc(item.title) + '</button>';
    });
    $('side-nav').innerHTML = html;
  }
  function rangeControl(key, label, min, max, step, unit) {
    var value = state.sim[key];
    return '<label class="control"><span>' + esc(label) + ' <output>' + esc(value) + ' ' + esc(unit || '') + '</output></span><input type="range" aria-label="' + esc(label) + '" data-sim="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"></label>';
  }
  function selectControl(key, label, options) {
    var html = '<label class="control"><span>' + esc(label) + '</span><select aria-label="' + esc(label) + '" data-sim="' + key + '">';
    options.forEach(function(option) { html += '<option value="' + esc(option[0]) + '"' + (String(state.sim[key]) === String(option[0]) ? ' selected' : '') + '>' + esc(option[1]) + '</option>'; });
    return html + '</select></label>';
  }
  function svgText(x, y, text, color, size, anchor) {
    return '<text x="' + x + '" y="' + y + '" fill="' + (color || '#172536') + '" font-size="' + (size || 16) + '" text-anchor="' + (anchor || 'middle') + '">' + esc(text) + '</text>';
  }
  function svgShell(body, title) {
    return '<svg class="sim-svg" viewBox="0 0 760 300" role="img" aria-label="' + esc(title) + '"><rect x="0" y="0" width="760" height="300" rx="12" fill="#f8fbfe"></rect>' + body + '</svg>';
  }
  function chargeSim() {
    var step = Number(state.sim.step || 0);
    var data = C.sim.steps[step];
    var sign = function(value) { return value > 0 ? '+' : ''; };
    var marks = function(value, x, color) {
      if (!value) return svgText(x, 132, 'neutral', '#5d6d7d', 18);
      var out = '';
      for (var i = 0; i < Math.min(4, Math.abs(value)); i += 1) {
        out += '<circle cx="' + (x - 27 + i * 18) + '" cy="126" r="12" fill="' + color + '" opacity=".2"></circle>' + svgText(x - 27 + i * 18, 132, value > 0 ? '+' : '−', color, 17);
      }
      return out;
    };
    var body = '<rect x="75" y="82" width="250" height="105" rx="20" fill="#eaf2ff" stroke="#8db0d8" stroke-width="2"></rect><rect x="435" y="82" width="250" height="105" rx="20" fill="#fff1e8" stroke="#e2b794" stroke-width="2"></rect>';
    body += svgText(200, 54, 'GLASS ROD', '#1959a6', 20) + svgText(560, 54, 'SILK CLOTH', '#bd5a20', 20);
    body += marks(data.glass, 200, '#1959a6') + marks(data.silk, 560, '#bd5a20');
    if (step === 1) body += '<line x1="325" y1="220" x2="435" y2="220" stroke="#1959a6" stroke-width="3" marker-end="url(#charge-arrow)"></line>' + svgText(380, 248, 'electrons move', '#1959a6', 16);
    if (step === 3) body += '<line x1="330" y1="132" x2="430" y2="132" stroke="#176b57" stroke-width="4" marker-start="url(#charge-arrow)" marker-end="url(#charge-arrow)"></line>' + svgText(380, 112, 'attract', '#176b57', 16);
    if (step === 4) body += '<line x1="345" y1="132" x2="415" y2="132" stroke="#bd5a20" stroke-width="4" marker-end="url(#charge-arrow)"></line>' + svgText(380, 112, 'touch', '#bd5a20', 16);
    body += svgText(200, 240, 'charge: ' + sign(data.glass) + data.glass + 'e', '#172536', 16) + svgText(560, 240, 'charge: ' + sign(data.silk) + data.silk + 'e', '#172536', 16);
    body += svgText(380, 276, 'total charge of pair: ' + sign(data.total) + data.total + 'e', '#5d6d7d', 15);
    var svg = '<svg class="sim-svg" viewBox="0 0 760 300" role="img" aria-labelledby="charge-title charge-desc"><title id="charge-title">' + esc(data.title) + '</title><desc id="charge-desc">' + esc(data.detail) + '</desc><defs><marker id="charge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1959a6"></path></marker></defs>' + body + '</svg>';
    var controls = '<div class="stepper" role="group" aria-label="Charge experiment steps">';
    C.sim.steps.forEach(function(item, index) { controls += '<button type="button" class="step-button ' + (index === step ? 'active' : '') + '" data-sim-step="' + index + '"' + (index === step ? ' aria-current="step"' : '') + '><span class="step-no">' + (index + 1) + '</span>' + esc(item.short) + '</button>'; });
    controls += '</div>';
    return { svg: svg, controls: controls, readout: '<strong>' + esc(data.title) + '</strong>' + esc(data.detail) + '<br><span>Observation: ' + esc(data.relation) + '</span>' };
  }
  function potentialSim() {
    var q = Number(state.sim.q), r = Number(state.sim.r), v = 9 * q / r, e = 9 * q / (r * r);
    var body = '<circle cx="380" cy="145" r="26" fill="#eaf2ff" stroke="#1959a6" stroke-width="3"></circle>' + svgText(380, 152, q > 0 ? '+' : '−', '#1959a6', 24);
    [50, 82, 114].forEach(function(radius) { body += '<circle cx="380" cy="145" r="' + radius + '" fill="none" stroke="#8db0d8" stroke-dasharray="5 7"></circle>'; });
    body += '<circle cx="' + (380 + Math.min(180, r * 13)) + '" cy="145" r="9" fill="#bd5a20"></circle>' + svgText(380 + Math.min(180, r * 13), 183, 'test point', '#bd5a20', 14);
    body += svgText(380, 260, 'Equipotential rings are shown schematically', '#5d6d7d', 15);
    return { svg: svgShell(body, 'Potential around a point charge'), controls: rangeControl('q', 'Charge q', -5, 5, 1, 'μC') + rangeControl('r', 'Distance r', 1, 10, 1, 'm'), readout: '<strong>At the test point</strong>V ≈ ' + v.toFixed(2) + ' kV · E ≈ ' + e.toFixed(2) + ' kN/C. Potential is scalar; field has direction.' };
  }
  function circuitSim() {
    var voltage = Number(state.sim.voltage), resistance = Number(state.sim.resistance), current = voltage / resistance, power = voltage * current;
    var body = '<line x1="120" y1="150" x2="220" y2="150" stroke="#1959a6" stroke-width="5"></line><path d="M220 150 l18 -35 l36 70 l36 -70 l36 70 l18 -35" fill="none" stroke="#bd5a20" stroke-width="4"></path><line x1="364" y1="150" x2="520" y2="150" stroke="#1959a6" stroke-width="5"></line><line x1="520" y1="150" x2="520" y2="225" stroke="#1959a6" stroke-width="5"></line><line x1="520" y1="225" x2="120" y2="225" stroke="#1959a6" stroke-width="5"></line><line x1="120" y1="225" x2="120" y2="150" stroke="#1959a6" stroke-width="5"></line><line x1="95" y1="135" x2="95" y2="165" stroke="#1959a6" stroke-width="5"></line><line x1="110" y1="125" x2="110" y2="175" stroke="#1959a6" stroke-width="5"></line>' + svgText(282, 100, 'resistor R', '#bd5a20', 16) + svgText(100, 265, 'battery V', '#1959a6', 16);
    return { svg: svgShell(body, 'A simple series circuit'), controls: rangeControl('voltage', 'Voltage V', 1, 24, 1, 'V') + rangeControl('resistance', 'Resistance R', 1, 20, 1, 'Ω'), readout: '<strong>Ohm’s law</strong>I = V/R = ' + current.toFixed(2) + ' A · Power P = VI = ' + power.toFixed(2) + ' W.' };
  }
  function magneticSim() {
    var q = Number(state.sim.q), velocity = Number(state.sim.velocity), field = Number(state.sim.field), angle = Number(state.sim.angle), force = q * velocity * field * Math.sin(angle * Math.PI / 180);
    var body = '<circle cx="380" cy="150" r="38" fill="#eaf2ff" stroke="#1959a6" stroke-width="3"></circle>' + svgText(380, 158, 'q', '#1959a6', 24) + '<line x1="115" y1="150" x2="310" y2="150" stroke="#1959a6" stroke-width="5" marker-end="url(#m-arrow)"></line><line x1="450" y1="150" x2="645" y2="150" stroke="#bd5a20" stroke-width="5" marker-end="url(#m-arrow)"></line>' + svgText(210, 125, 'v', '#1959a6', 18) + svgText(550, 125, 'F', '#bd5a20', 18);
    return { svg: svgShell('<defs><marker id="m-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1959a6"></path></marker></defs>' + body, 'Magnetic force on a moving charge'), controls: rangeControl('q', 'Charge q', 1, 5, 1, 'μC') + rangeControl('velocity', 'Speed v', 1, 10, 1, '×10⁶ m/s') + rangeControl('field', 'Field B', .1, 1, .1, 'T') + rangeControl('angle', 'Angle θ', 0, 90, 5, '°'), readout: '<strong>Magnetic force</strong>F = qvB sin θ. In this scaled model the force factor is ' + force.toFixed(2) + ' arbitrary units; it is zero when the motion is parallel to the field.' };
  }
  function materialSim() {
    var material = String(state.sim.material), field = Number(state.sim.field), data = { dia: ['Diamagnetic', 'weakly repelled', 'χ < 0'], para: ['Paramagnetic', 'weakly attracted', 'χ > 0'], ferro: ['Ferromagnetic', 'strongly attracted; domains align', 'large positive χ'] }[material];
    var body = '<line x1="90" y1="150" x2="250" y2="150" stroke="#1959a6" stroke-width="4" marker-end="url(#mat-arrow)"></line><rect x="300" y="90" width="160" height="120" rx="14" fill="#f0edff" stroke="#5b4a9d" stroke-width="3"></rect><line x1="510" y1="150" x2="670" y2="150" stroke="#bd5a20" stroke-width="4" marker-end="url(#mat-arrow)"></line>' + svgText(380, 145, data[0], '#5b4a9d', 18) + svgText(380, 172, 'sample', '#5d6d7d', 14);
    return { svg: svgShell('<defs><marker id="mat-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1959a6"></path></marker></defs>' + body, 'Magnetic response of materials'), controls: selectControl('material', 'Material', [['dia','Diamagnetic'],['para','Paramagnetic'],['ferro','Ferromagnetic']]) + rangeControl('field', 'Applied field H', 0, 5, .5, 'units'), readout: '<strong>' + data[0] + '</strong>' + data[1] + '. Its susceptibility is described by ' + data[2] + '. Applied field: ' + field + ' units.' };
  }
  function inductionSim() {
    var turns = Number(state.sim.turns), area = Number(state.sim.area), field = Number(state.sim.field), omega = Number(state.sim.omega), emf = turns * area * field * omega;
    var body = '<ellipse cx="380" cy="150" rx="170" ry="78" fill="none" stroke="#1959a6" stroke-width="7"></ellipse><ellipse cx="380" cy="150" rx="125" ry="55" fill="none" stroke="#8db0d8" stroke-width="3"></ellipse><line x1="550" y1="150" x2="650" y2="150" stroke="#bd5a20" stroke-width="4" marker-end="url(#ind-arrow)"></line>' + svgText(380, 45, 'changing magnetic flux', '#1959a6', 18) + svgText(600, 130, 'induced emf', '#bd5a20', 16);
    return { svg: svgShell('<defs><marker id="ind-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#bd5a20"></path></marker></defs>' + body, 'Induced emf in a rotating coil'), controls: rangeControl('turns', 'Turns N', 1, 100, 1, '') + rangeControl('area', 'Area A', .1, 1, .1, 'm²') + rangeControl('field', 'Field B', .1, 1, .1, 'T') + rangeControl('omega', 'Angular speed ω', 0, 20, 1, 'rad/s'), readout: '<strong>Faraday’s law</strong>|ε|max = NBAω = ' + emf.toFixed(2) + ' V in this idealised rotating-coil model. Lenz’s law gives the opposing direction.' };
  }
  function acSim() {
    var voltage = Number(state.sim.voltage), frequency = Number(state.sim.frequency), phase = Number(state.sim.phase), points = '';
    for (var i = 0; i <= 720; i += 12) { var x = 70 + i * .86, y = 145 - Math.sin(i * Math.PI / 180 * 2 + phase * Math.PI / 180) * 70; points += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' '; }
    var body = '<line x1="65" y1="145" x2="690" y2="145" stroke="#d7e0e8" stroke-width="2"></line><path d="' + points + '" fill="none" stroke="#1959a6" stroke-width="4"></path>' + svgText(380, 55, 'v(t) = V₀ sin(ωt + φ)', '#1959a6', 19) + svgText(380, 265, 'one displayed cycle · phase shifts the curve', '#5d6d7d', 15);
    return { svg: svgShell(body, 'Alternating voltage waveform'), controls: rangeControl('voltage', 'Peak voltage V₀', 10, 240, 10, 'V') + rangeControl('frequency', 'Frequency f', 1, 100, 1, 'Hz') + rangeControl('phase', 'Phase φ', 0, 180, 5, '°'), readout: '<strong>AC snapshot</strong>RMS voltage ≈ ' + (voltage / Math.sqrt(2)).toFixed(1) + ' V · frequency ' + frequency + ' Hz · phase ' + phase + '°.' };
  }
  function spectrumSim() {
    var band = String(state.sim.band), data = { radio:['Radio', '10⁶–10⁹ Hz', 'broadcast and communication'], micro:['Microwave', '10⁹–10¹² Hz', 'radar, satellite links, ovens'], ir:['Infrared', '10¹²–10¹⁴ Hz', 'thermal imaging and remotes'], visible:['Visible', '4–7.5×10¹⁴ Hz', 'vision and optical instruments'], uv:['Ultraviolet', '7.5×10¹⁴–10¹⁶ Hz', 'sterilisation and fluorescence'], xray:['X-ray', '10¹⁶–10¹⁹ Hz', 'medical imaging'], gamma:['Gamma', '>10¹⁹ Hz', 'nuclear and cosmic processes'] }[band];
    var body = '<line x1="70" y1="150" x2="690" y2="150" stroke="#1959a6" stroke-width="10"></line><circle cx="' + ({radio:100,micro:190,ir:285,visible:380,uv:475,xray:570,gamma:660}[band]) + '" cy="150" r="18" fill="#bd5a20"></circle>' + svgText(380, 75, 'low frequency  ←────────────→  high frequency', '#5d6d7d', 16);
    return { svg: svgShell(body, 'Electromagnetic spectrum'), controls: selectControl('band', 'Choose a band', Object.keys({radio:1,micro:1,ir:1,visible:1,uv:1,xray:1,gamma:1}).map(function(k) { return [k, k === 'ir' ? 'Infrared' : k.charAt(0).toUpperCase() + k.slice(1)]; })), readout: '<strong>' + data[0] + '</strong>Typical range: ' + data[1] + '. Application: ' + data[2] + '. In vacuum c = fλ.' };
  }
  function raySim() {
    var u = Number(state.sim.u), f = Number(state.sim.f), denom = 1 / f - 1 / u, v = Math.abs(denom) < .0001 ? Infinity : 1 / denom, m = Number.isFinite(v) ? v / u : Infinity;
    var image = Number.isFinite(v) ? 'image distance ≈ ' + v.toFixed(1) + ' cm; magnification ≈ ' + m.toFixed(2) : 'rays leave parallel; image is at infinity';
    var body = '<line x1="60" y1="160" x2="700" y2="160" stroke="#d7e0e8" stroke-width="2"></line><line x1="380" y1="55" x2="380" y2="265" stroke="#1959a6" stroke-width="5"></line><line x1="' + (380 - Math.min(240, u * 4)) + '" y1="160" x2="380" y2="95" stroke="#bd5a20" stroke-width="4"></line><line x1="380" y1="95" x2="' + (380 + Math.min(250, Number.isFinite(v) ? v * 4 : 250)) + '" y2="160" stroke="#1959a6" stroke-width="4"></line>' + svgText(380, 40, 'principal axis', '#5d6d7d', 15);
    return { svg: svgShell(body, 'Paraxial ray model'), controls: rangeControl('u', 'Object distance u', 5, 80, 1, 'cm') + rangeControl('f', 'Focal length f', 10, 40, 1, 'cm'), readout: '<strong>Thin-lens or mirror relation</strong>Using 1/v = 1/f − 1/u: ' + image + '. Treat the diagram as a sign-aware sketch; the source chapter gives the full conventions.' };
  }
  function waveSim() {
    var lambda = Number(state.sim.lambda), slit = Number(state.sim.slit), distance = Number(state.sim.distance), beta = lambda * distance / slit / 1000;
    var body = '<line x1="365" y1="55" x2="365" y2="245" stroke="#172536" stroke-width="5"></line><line x1="395" y1="55" x2="395" y2="245" stroke="#172536" stroke-width="5"></line><path d="M365 100 C500 60 610 80 690 100 M365 200 C500 240 610 220 690 200" fill="none" stroke="#1959a6" stroke-width="3"></path>' + svgText(380, 40, 'two coherent slits', '#172536', 16);
    return { svg: svgShell(body, 'Young double-slit arrangement'), controls: rangeControl('lambda', 'Wavelength λ', 400, 700, 10, 'nm') + rangeControl('slit', 'Slit separation d', .2, 2, .1, 'mm') + rangeControl('distance', 'Screen distance D', 1, 5, .5, 'm'), readout: '<strong>Fringe width</strong>β = λD/d ≈ ' + beta.toFixed(3) + ' mm. Increasing λ or D spreads the fringes; increasing d packs them closer.' };
  }
  function photoSim() {
    var frequency = Number(state.sim.frequency), intensity = Number(state.sim.intensity), work = Number(state.sim.work), photon = .414 * frequency, kinetic = Math.max(0, photon - work), stopping = kinetic, body = '<line x1="80" y1="220" x2="680" y2="220" stroke="#d7e0e8" stroke-width="2"></line><rect x="125" y="105" width="85" height="90" rx="10" fill="#eaf2ff" stroke="#1959a6" stroke-width="3"></rect><rect x="550" y="105" width="85" height="90" rx="10" fill="#fff1e8" stroke="#bd5a20" stroke-width="3"></rect>' + svgText(167, 155, 'metal', '#1959a6', 16) + svgText(592, 155, 'collector', '#bd5a20', 16) + svgText(380, 70, 'photons → electrons', '#1959a6', 18) + '<line x1="220" y1="150" x2="545" y2="150" stroke="#1959a6" stroke-width="' + (2 + intensity / 2) + '" marker-end="url(#p-arrow)"></line>';
    return { svg: svgShell('<defs><marker id="p-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1959a6"></path></marker></defs>' + body, 'Photoelectric effect'), controls: rangeControl('frequency', 'Frequency ν', 1, 10, .5, '×10¹⁴ Hz') + rangeControl('intensity', 'Intensity', 1, 10, 1, 'units') + rangeControl('work', 'Work function φ', 1, 4, .5, 'eV'), readout: '<strong>Einstein’s equation</strong>Kmax = hν − φ = ' + kinetic.toFixed(2) + ' eV; stopping potential is about ' + stopping.toFixed(2) + ' V. Intensity changes photocurrent after the threshold, not Kmax.' };
  }
  function atomSim() {
    var n1 = Number(state.sim.n1), n2 = Number(state.sim.n2), R = 1.097e7, lambda = 1e9 / (R * (1 / (n1 * n1) - 1 / (n2 * n2)));
    var body = '<line x1="90" y1="235" x2="680" y2="235" stroke="#d7e0e8" stroke-width="2"></line>';
    for (var n = 1; n <= 5; n += 1) { var y = 235 - n * 32; body += '<line x1="160" y1="' + y + '" x2="650" y2="' + y + '" stroke="' + (n === n1 || n === n2 ? '#bd5a20' : '#8db0d8') + '" stroke-width="' + (n === n1 || n === n2 ? 4 : 2) + '"></line>' + svgText(130, y + 5, 'n=' + n, '#5d6d7d', 14, 'end'); }
    body += '<line x1="400" y1="' + (235 - n2 * 32) + '" x2="400" y2="' + (235 - n1 * 32) + '" stroke="#1959a6" stroke-width="4" marker-end="url(#a-arrow)"></line>';
    return { svg: svgShell('<defs><marker id="a-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1959a6"></path></marker></defs>' + body, 'Hydrogen energy levels'), controls: selectControl('n1', 'Lower level n₁', [['1','1'],['2','2'],['3','3']]) + selectControl('n2', 'Higher level n₂', [['2','2'],['3','3'],['4','4'],['5','5']]), readout: '<strong>Hydrogen transition</strong>For n₂ = ' + n2 + ' to n₁ = ' + n1 + ', λ ≈ ' + lambda.toFixed(1) + ' nm. A transition to n = 2 belongs to the Balmer series.' };
  }
  function nucleusSim() {
    var A = Number(state.sim.A), Z = Math.min(Number(state.sim.Z), A), neutrons = A - Z, radius = 1.2 * Math.pow(A, 1 / 3);
    var body = '<circle cx="380" cy="150" r="' + Math.min(110, 20 + radius * 2) + '" fill="#fff1e8" stroke="#bd5a20" stroke-width="4"></circle>' + svgText(380, 145, 'nucleus', '#bd5a20', 20) + svgText(380, 174, 'Z=' + Z + '  N=' + neutrons, '#172536', 15);
    return { svg: svgShell(body, 'Nuclear size model'), controls: rangeControl('A', 'Mass number A', 20, 240, 1, '') + rangeControl('Z', 'Atomic number Z', 1, 100, 1, ''), readout: '<strong>Nuclear composition</strong>N = A − Z = ' + neutrons + ' neutrons · radius R ≈ R₀A¹ᐟ³ = ' + radius.toFixed(2) + ' fm. Nuclear density stays approximately constant.' };
  }
  function diodeSim() {
    var bias = Number(state.sim.bias), current = bias > .7 ? (bias - .7) * 10 : bias < -5 ? .01 : .01;
    var body = '<line x1="90" y1="160" x2="330" y2="160" stroke="#1959a6" stroke-width="5"></line><polygon points="330,115 330,205 430,160" fill="#eaf2ff" stroke="#1959a6" stroke-width="3"></polygon><line x1="455" y1="110" x2="455" y2="210" stroke="#bd5a20" stroke-width="6"></line><line x1="455" y1="160" x2="670" y2="160" stroke="#1959a6" stroke-width="5"></line>' + svgText(380, 85, 'p–n junction diode', '#172536', 18) + svgText(390, 250, 'forward direction →', '#5d6d7d', 15);
    return { svg: svgShell(body, 'Semiconductor diode model'), controls: rangeControl('bias', 'Applied bias V', -5, 5, .1, 'V'), readout: '<strong>Diode response</strong>At V = ' + bias.toFixed(1) + ' V, the illustrative current is ' + current.toFixed(2) + ' mA. Forward bias crosses a threshold; reverse bias blocks strongly in this model.' };
  }
  function renderSim() {
    ensureSim();
    var type = C.sim.type, result;
    if (type === 'charge') result = chargeSim();
    else if (type === 'potential') result = potentialSim();
    else if (type === 'circuit') result = circuitSim();
    else if (type === 'magnetic-force') result = magneticSim();
    else if (type === 'magnetism') result = materialSim();
    else if (type === 'induction') result = inductionSim();
    else if (type === 'ac') result = acSim();
    else if (type === 'emwave') result = spectrumSim();
    else if (type === 'ray') result = raySim();
    else if (type === 'wave') result = waveSim();
    else if (type === 'photoelectric') result = photoSim();
    else if (type === 'atom') result = atomSim();
    else if (type === 'nucleus') result = nucleusSim();
    else result = diodeSim();
    $('sim').innerHTML = '<div class="sim-wrap">' + result.svg + '</div><div class="sim-controls">' + result.controls + '</div><div class="sim-readout" aria-live="polite">' + result.readout + '</div><div class="sim-footer"><button type="button" class="reset-button" id="reset-sim">Reset simulation</button><span class="source-note">Source ' + sourceLink(C.sim.page, 'NCERT ' + C.sim.section + ' · ' + pg(C.sim.page)) + '</span></div>';
  }
  function renderQuiz() {
    var q = currentQuestion(), old = state.answers[answerKey()] || {}, html = '<p class="question-meta">' + (state.question + 1) + ' OF ' + C.practice.length + ' · ' + esc(q.level) + ' · ' + esc(q.tag || 'Chapter check') + '</p><form id="quiz-form"><fieldset><legend class="question-title">' + esc(q.prompt) + '</legend>';
    if (q.type === 'mcq') {
      html += '<div class="options">';
      q.options.forEach(function(option, index) { html += '<label class="option"><input type="radio" name="answer" value="' + index + '"' + (String(old.value) === String(index) ? ' checked' : '') + '><span>' + esc(option) + '</span></label>'; });
      html += '</div>';
    } else {
      html += '<label for="numeric-answer" class="sr-only">Numeric answer</label><input class="numeric-answer" id="numeric-answer" name="answer" inputmode="decimal" autocomplete="off" value="' + esc(old.value || '') + '" placeholder="Your answer"><span> ' + esc(q.unit || '') + '</span>';
    }
    html += '</fieldset><div class="quiz-actions"><button class="primary-button" type="submit">Check answer</button><button class="hint-button" id="hint-toggle" type="button" aria-expanded="false">Give me a hint</button></div></form><div id="hint" class="hint" hidden>' + esc(q.hint) + '</div><div id="feedback" role="status" aria-live="polite"></div>';
    $('quiz').innerHTML = html;
    if (old.checked) showFeedback(q, old.value, false);
  }
  function showFeedback(q, value, record) {
    var raw = String(value === undefined || value === null ? '' : value).trim().replace(/−/g, '-');
    if (raw === '' || (q.type === 'number' && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw))) { $('feedback').className = 'feedback retry'; $('feedback').textContent = q.type === 'number' ? 'Enter a number. The unit is already shown.' : 'Choose an answer first.'; return; }
    var numeric = Number(raw), correct = q.type === 'mcq' ? numeric === q.answer : Math.abs(numeric - q.answer) <= (q.tolerance || .01);
    if (record) { state.answers[answerKey()] = { value: value, checked: true }; if (correct) state.correct[answerKey()] = true; updateProgress(); }
    $('feedback').className = 'feedback ' + (correct ? 'good' : 'retry');
    $('feedback').innerHTML = correct ? '<strong>That is right.</strong> ' + esc(q.solution) : '<strong>Try it again.</strong> ' + esc(q.hint) + '<details><summary>Show the full solution</summary><p>' + esc(q.solution) + '</p></details>';
  }
  function render() {
    var learn = C.learn.map(function(item) { return '<article class="learn-card"><h3>' + esc(item.title) + '</h3><p>' + item.text + '</p><small class="source-note">' + sourceLink(lessonPage(item.section), 'NCERT §' + item.section + ' · ' + pg(lessonPage(item.section))) + '</small></article>'; }).join('');
    var equations = C.formulas.map(function(item) { return '<div class="equation-card"><strong>' + item.formula + '</strong><small>' + esc(item.meaning) + '</small></div>'; }).join('');
    var map = (C.sectionMap || []).map(function(item) { return '<a id="map-' + esc(item.section) + '" class="map-card" href="' + C.source + '#page=' + item.page + '" target="_blank" rel="noopener"><strong>§' + esc(item.section) + '</strong><span>' + esc(item.title) + ' · ' + pg(item.page) + ' ↗</span></a>'; }).join('');
    var connect = C.connect.map(function(item) { var v = item[3] || null; var fac = (v && v.id) ? '<button class="video-facade" data-yt="' + esc(v.id) + '" aria-label="Play video: ' + esc(v.title) + '"><span class="play-btn">\u25b6</span><span class="video-title">' + esc(v.title) + ' \u00b7 ' + esc(v.channel) + '</span></button>' : ''; return '<article class="connect-card"><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p>' + fac + '</article>'; }).join('');
    var misconceptions = C.misconceptions.map(function(item) { return '<p><strong>' + esc(item[0]) + '</strong> ' + esc(item[1]) + '</p>'; }).join('');
    var exit = C.exitTicket.map(function(item) { return '<li>' + esc(item) + '</li>'; }).join('');
    var exercises = (C.exerciseNumbers || []).map(function(item) { return '<span class="exercise-chip">Q' + esc(item.number) + ' · ' + pg(item.page) + '</span>'; }).join('');
    var resCard = '<div class="resource-card" data-resource="true"><span class="res-badge">RESOURCE · OPTIONAL</span><div class="res-body"><strong>NCERT Physics Chapter ' + esc(C.chapterNumber) + ': ' + esc(C.title) + ' (official PDF)</strong><span class="res-provider">ncert.nic.in</span></div><a class="res-link" href="https://ncert.nic.in/textbook/pdf/' + esc(C.code) + '.pdf" target="_blank" rel="noopener">Open source ↗</a><span class="res-off">Needs internet · lesson works offline</span></div>';
var ncertBank = (C.ncert && C.ncert.length) ? '<section class="panel ncert-bank" data-block="ncert" aria-label="NCERT exercises"><span class="block-tag">05b &nbsp; NCERT EXERCISES \u00b7 VERBATIM</span><h2>Every exercise, worked.</h2>' + C.ncert.map(function(item) {
      var steps = (item.steps || []).map(function(s) { return '<li>' + esc(s) + '</li>'; }).join('');
      return '<details class="ncert-q"><summary><b>Q' + esc(item.number) + '</b> \u00b7 ' + pg(item.page) + '</summary><p class="ncert-stem">' + esc(item.question) + '</p><details class="ncert-hint"><summary>Hint</summary><p>' + esc(item.hint || '') + '</p></details><ol class="ncert-steps">' + steps + '</ol><p class="ncert-answer"><b>Answer.</b> ' + esc(item.answer || '') + '</p></details>';
    }).join('') + '</section>' : '';
    var mapNote = (C.ncert && C.ncert.length) ? 'Full verbatim stems with hints and worked solutions are in the NCERT bank above.' : 'The practice above is an original formative check aligned to the chapter ideas.';
        $('lesson').innerHTML = '<div class="lesson-meta"><span class="eyebrow">CHAPTER ' + esc(C.chapterNumber) + ' · ' + esc(C.code) + '</span><span class="time-badge">≈ ' + esc(C.minutes) + ' min · complete chapter guide</span></div><h2 class="lesson-title">' + esc(C.title) + '</h2><p class="lesson-deck">' + esc(C.deck) + '</p><div class="learn"><section class="panel learn-copy" data-block="learn" aria-label="Learn"><span class="block-tag">01 &nbsp; LEARN · CHUNKED FROM NCERT</span>' + learn + '<div class="equation-grid">' + equations + '</div><details><summary>Chapter idea in one paragraph</summary><p>' + esc(C.bigIdea) + '</p></details></section><section class="panel predict-card" data-block="predict" aria-label="Predict first"><span class="block-tag">02 &nbsp; PREDICT · BEFORE YOU PLAY</span><p class="play-prompt"><b>Make a prediction.</b> ' + esc(C.sim.prompt) + '</p></section><section class="panel play" data-block="play" aria-label="Interactive simulation"><div class="play-head"><strong>03 &nbsp; PLAY · ' + esc(C.sim.title) + '</strong><span class="live-label">INTERACTIVE</span></div><p class="play-prompt"><b>Test your prediction.</b> ' + esc(C.sim.prompt) + '</p><div id="sim"></div></section></div><section class="panel chapter-map" aria-label="NCERT section map"><span class="block-tag">SOURCE MAP</span><h2>Follow the chapter.</h2><div class="map-grid">' + map + '</div></section><section class="panel connect" data-block="connect" aria-label="Real-life connections"><span class="block-tag">04 &nbsp; CONNECT · PHYSICS AROUND YOU</span><h2>Where this shows up.</h2><div class="connect-grid">' + connect + '</div>' + resCard + '</section><section class="panel practice" data-block="practice" aria-labelledby="practice-title"><div class="practice-top"><div><span class="block-tag">05 &nbsp; PRACTICE</span><h2 id="practice-title">Make it stick.</h2></div><div class="question-nav" aria-label="Question navigation">' + C.practice.map(function(q, index) { return '<button type="button" class="question-button ' + (index === state.question ? 'active ' : '') + (state.correct[C.code + '-' + index] ? 'correct' : '') + '" data-question="' + index + '" aria-pressed="' + (index === state.question) + '">' + (index + 1) + '</button>'; }).join('') + '</div></div><div id="quiz"></div></section>' + ncertBank + '<section class="panel revise" data-block="revise" aria-label="Revise"><strong>06 &nbsp; REVISE · ONE-PAGE RECALL</strong><h2>Say it without looking.</h2><div class="revise-grid"><div class="revise-card"><h3>Misconceptions to avoid</h3>' + misconceptions + '</div><div class="revise-card"><h3>Exit ticket</h3><ol class="exit-ticket">' + exit + '</ol></div></div></section><section class="panel exercise-map"><details><summary>NCERT exercise map · ' + (C.exerciseNumbers || []).length + ' source questions located</summary><p>These chips link to the PDF pages where the exercise questions appear. ' + mapNote + '</p><div class="exercise-list">' + exercises + '</div></details></section>';
    renderSim(); renderQuiz(); renderNav(); updateProgress();
  }
  document.addEventListener('click', function(event) {
    var section = event.target.closest('[data-section]'); if (section) { state.section = section.getAttribute('data-section'); renderNav(); var mapCard = $('map-' + state.section); if (mapCard && mapCard.scrollIntoView) mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    var step = event.target.closest('[data-sim-step]'); if (step) { state.sim.step = Number(step.getAttribute('data-sim-step')); renderSim(); return; }
    var reset = event.target.closest('#reset-sim'); if (reset) { state.sim = Object.assign({}, C.sim.defaults || {}); renderSim(); return; }
    var question = event.target.closest('[data-question]'); if (question) { state.question = Number(question.getAttribute('data-question')); renderQuiz(); return; }
    var hint = event.target.closest('#hint-toggle'); if (hint) { var box = $('hint'), open = !box.hidden; box.hidden = open; hint.setAttribute('aria-expanded', String(!open)); return; }
    var fac = event.target.closest('.video-facade'); if (fac) { var vid = fac.getAttribute('data-yt'); var par = fac.parentElement; if (par && vid) par.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0" title="Video lesson" style="width:100%;aspect-ratio:16/9;border:none;border-radius:8px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; return; }
  });
  document.addEventListener('input', function(event) {
    var control = event.target.closest('[data-sim]'); if (!control) return;
    state.sim[control.getAttribute('data-sim')] = control.type === 'range' ? Number(control.value) : control.value;
    renderSim();
  });
  document.addEventListener('change', function(event) {
    var control = event.target.closest('[data-sim]'); if (!control) return;
    state.sim[control.getAttribute('data-sim')] = control.value;
    if (control.getAttribute('data-sim') === 'n1' && Number(state.sim.n2) <= Number(state.sim.n1)) state.sim.n2 = Number(state.sim.n1) + 1;
    if (control.getAttribute('data-sim') === 'n2' && Number(state.sim.n2) <= Number(state.sim.n1)) state.sim.n2 = Number(state.sim.n1) + 1;
    renderSim();
  });
  document.addEventListener('submit', function(event) {
    if (event.target.id !== 'quiz-form') return;
    event.preventDefault();
    showFeedback(currentQuestion(), new FormData(event.target).get('answer'), true);
  });
  window.addEventListener('DOMContentLoaded', render);
})();
