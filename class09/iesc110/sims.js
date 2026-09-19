// iesc110 labs: Sound Waves. Wave motion is slowed down and drawn to a convenient scale; example numbers are from the textbook.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clamp10(x, a, b){ return Math.max(a, Math.min(b, x)); }
function wavePath10(x0, x1, yMid, amp, cycles, phase, fn){
  var d = "", n = 160;
  for(var i = 0; i <= n; i++){ var x = x0 + (x1 - x0) * i / n, th = 2 * Math.PI * cycles * i / n - phase, y = yMid - amp * (fn ? fn(th) : Math.sin(th)); d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
  return d;
}

// Lab 1 — Vibrations and the medium (Activities 10.1–10.4, Fig. 10.7)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "band"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "belljar" ? 4 : 3, step: 0.05, speed: 0.6});
    L.legend(id === "belljar" ? [[C.vel, "air particles"], [C.path, "sound reaching the listener"]] : [[C.path, "vibration / sound"]]);
    L.watch({band: "Activity 10.1: a loose and a tight rubber band on a box are plucked together (motion slowed down).", fork: "Activity 10.2: a struck tuning fork, then one prong touches water.", media: "Activities 10.3–10.4: a knock heard through a desk, through water, and through air.", belljar: "Fig. 10.7: air is pumped out of a bell jar with a ringing bell, then let back in."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "band"){
      var amp = 22 * Math.max(0, 1 - t / 2.4), on = amp > 0.5;
      [[150, 1.6, "loose band"], [470, 3.2, "tight band"]].forEach(function(b){
        var off = amp * Math.sin(2 * Math.PI * b[1] * t);
        m += L.rect(b[0] - 90, 120, 180, 110, "#a16207", ' rx="6"') + L.rect(b[0] - 70, 130, 140, 60, "#0f172a");
        m += '<path d="M' + (b[0] - 90) + ' 125 Q' + b[0] + ' ' + (125 + off) + ' ' + (b[0] + 90) + ' 125" fill="none" stroke="#fda4af" stroke-width="3"/>' + L.text(b[0], 260, b[2], {size: 13, color: C.text});
        if(on) for(i = 1; i <= 3; i++) m += '<path d="M' + (b[0] + 100 + i * 14) + ' 95 q12 30 0 60" fill="none" stroke="' + C.path + '" stroke-width="2" opacity="' + (amp / 22).toFixed(2) + '"/>';
      });
      m += L.text(360, 50, on ? "vibrating: sound heard" : "stopped: no sound", {size: 16, color: on ? C.path : C.muted, weight: 700});
      L.svg(m, "Rubber bands on a box", 290);
      L.readout([["Bands", on ? "vibrating" : "not vibrating"], ["Sound", on ? "heard" : "none", C.path], ["Tight band", "vibrates faster: sounds different"]]);
      msg = t < 3 ? "Plucked…" : "When the vibration stopped, <b>the sound stopped too</b>: sound is produced by vibrations. The tighter band vibrated faster and sounded different.";
    } else if(st.preset === "fork"){
      var off2 = 4 * Math.sin(2 * Math.PI * 4 * t), touch = t > 1.2, tipY = touch ? 196 : 150 + 40 * clamp10(t / 1.2, 0, 1);
      m += L.rect(120, 200, 480, 80, "#38bdf8", ' opacity="0.35"') + L.line(120, 200, 600, 200, "#7dd3fc", 2);
      m += L.line(340 - off2, tipY - 110, 340 - off2, tipY, "#cbd5e1", 7) + L.line(380 + off2, tipY - 110, 380 + off2, tipY - 20, "#cbd5e1", 7) + '<path d="M' + (340 - off2) + ' ' + (tipY - 110) + ' Q360 ' + (tipY - 140) + ' ' + (380 + off2) + ' ' + (tipY - 110) + '" fill="none" stroke="#cbd5e1" stroke-width="7"/>' + L.line(360, tipY - 132, 360, tipY - 170, "#94a3b8", 6);
      if(touch) for(i = 0; i < 4; i++){ var r = ((t - 1.2) * 60 + i * 22) % 88; m += '<ellipse cx="340" cy="203" rx="' + (r * 1.6).toFixed(1) + '" ry="' + (r * 0.35).toFixed(1) + '" fill="none" stroke="#e0f2fe" stroke-width="2" opacity="' + (1 - r / 88).toFixed(2) + '"/>'; }
      L.svg(m, "Tuning fork touching water", 290);
      L.readout([["Prongs", "vibrating"], ["Sound near the ear", "heard", C.path], ["Water surface", touch ? "ripples forming" : "calm"]]);
      msg = t < 3 ? "Striking the fork…" : "The vibrating prongs make <b>ripples in the water</b>: the tuning fork produces sound by vibrating.";
    } else if(st.preset === "media"){
      [[70, "desk (solid)", "#a16207", 1.0], [150, "water (liquid)", "#38bdf8", 1.4], [230, "air (gas)", "#475569", 2.4]].forEach(function(row){
        var reach = clamp10(t / row[3], 0, 1), x = 150 + 420 * reach;
        m += L.rect(150, row[0] - 18, 420, 36, row[2], ' opacity="0.35" rx="6"') + L.text(140, row[0] + 5, row[1], {size: 13, color: C.text, anchor: "end"}) + L.circle(150, row[0], 8, C.danger) + '<path d="M594 ' + (row[0] - 10) + ' q12 -4 12 10 q0 10 -8 12" fill="none" stroke="#fda4af" stroke-width="4"/>' + L.text(600, row[0] + 26, "ear", {size: 10, color: C.muted});
        m += '<path d="M' + x + ' ' + (row[0] - 14) + ' q8 14 0 28" fill="none" stroke="' + C.path + '" stroke-width="3" opacity="' + (reach < 1 ? 1 : 0.3) + '"/>';
        if(reach >= 1) m += L.text(660, row[0] + 5, "heard", {size: 13, color: C.path, anchor: "start", weight: 700});
      });
      L.svg(m, "Sound through three media", 280);
      L.readout([["Through the desk", t >= 1 ? "heard" : "…", C.path], ["Through water", t >= 1.4 ? "heard" : "…", C.path], ["Through air", t >= 2.4 ? "heard" : "…", C.path]]);
      msg = t < 3 ? "Knocking…" : "The sound reached the ear through the <b>solid, the liquid and the gas</b>. (It arrives first through the solid; speeds come later in this chapter.)";
    } else {
      var air = t < 2.5 ? 1 - 0.98 * (t / 2.5) : t < 3 ? 0.02 : 0.02 + 0.98 * clamp10((t - 3) / 1, 0, 1);
      m += '<path d="M220 250 L220 110 Q220 40 360 40 Q500 40 500 110 L500 250 Z" fill="#0b1220" stroke="#cbd5e1" stroke-width="3"/>' + L.rect(200, 250, 320, 14, "#475569");
      for(i = 0; i < Math.round(60 * air); i++) m += L.circle(240 + (i * 53) % 240, 70 + (i * 37) % 170, 3, C.vel, ' opacity="0.7"');
      var ring = 3 * Math.sin(2 * Math.PI * 6 * t);
      m += L.circle(360, 175, 28, "#b91c1c") + L.line(360, 200, 360 + ring * 3, 150, "#fde68a", 3);
      for(i = 1; i <= 3; i++) m += '<path d="M' + (510 + i * 24) + ' 110 q20 50 0 100" fill="none" stroke="' + C.path + '" stroke-width="3" opacity="' + (air * (1 - i * 0.2)).toFixed(2) + '"/>';
      m += L.line(520, 257, 640, 257, "#94a3b8", 4) + L.text(640, 280, "to vacuum pump", {size: 12, color: C.muted, anchor: "end"});
      L.svg(m, "Vacuum bell jar", 290);
      L.readout([["Air in the jar", Math.round(air * 100) + "%", C.vel], ["Bell", "vibrating"], ["Sound heard", air > 0.6 ? "loud" : air > 0.1 ? "faint" : "almost none", C.path]]);
      msg = t < 4 ? (t < 3 ? "Pumping air out…" : "Letting air back in…") : "As air was pumped out, the ringing faded to almost nothing, and it returned when air was let back in: <b>sound needs a medium</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["band", "Activity 10.1: rubber bands"], ["fork", "Activity 10.2: tuning fork"], ["media", "Solid, liquid and gas"], ["belljar", "Fig. 10.7: vacuum bell jar"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.vibration = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Compressions, rarefactions and wave types (Figs. 10.8–10.13)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "piston"};
  var LAM = 200, F = 0.8, V = LAM * F, A = 10;
  function disp(x, t, x0){ var front = x0 + V * t; if(x > front) return 0; return A * Math.sin(2 * Math.PI * F * t - 2 * Math.PI * (x - x0) / LAM); }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 0.05, speed: 0.6});
    L.legend(id === "transverse" ? [[C.vel, "longitudinal"], [C.path, "transverse"]] : [[C.vel, "particles / turns"], [C.danger, "the marked one"]]);
    L.watch({piston: "Fig. 10.9: an oscillating piston at the left end of a tube of air (motion exaggerated and slowed).", slinky: "Activity 10.5: one end of a slinky is pushed and pulled; one turn is marked.", transverse: "Figs. 10.12–10.13: longitudinal and transverse waves side by side.", spherical: "Fig. 10.10: a small source sending sound out in all directions."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i, j, x0 = 70;
    if(st.preset === "piston" || st.preset === "slinky"){
      var pist = st.preset === "piston", front = x0 + V * t, ph = 2 * Math.PI * F * t;
      if(pist){ m += L.rect(55, 95, 640, 90, "none", ' stroke="#94a3b8" stroke-width="2"') + L.rect(40 + disp(x0, t, x0), 97, 22, 86, "#64748b"); }
      for(i = 0; i < 18; i++){
        var xe = 95 + i * 34;
        if(pist) for(j = 0; j < 4; j++){ var mark = i === 6 && j === 1; m += L.circle(xe + disp(xe, t, x0), 110 + j * 20, mark ? 6 : 4, mark ? C.danger : C.vel); }
        else { var mk = i === 6; m += '<ellipse cx="' + (xe + disp(xe, t, x0)).toFixed(1) + '" cy="140" rx="4" ry="36" fill="none" stroke="' + (mk ? C.danger : "#cbd5e1") + '" stroke-width="' + (mk ? 4 : 2.5) + '"/>'; }
      }
      m += L.line(95 + 6 * 34, 200, 95 + 6 * 34, 215, C.danger, 2) + L.text(95 + 6 * 34, 232, "mean position", {size: 11, color: C.danger});
      for(var n = 0; n < 6; n++){
        var xc = x0 + (ph / (2 * Math.PI) - n) * LAM, xr = xc + LAM / 2;
        if(xc > 80 && xc < 690 && xc <= front) m += L.text(xc, 80, "C", {size: 15, color: C.path, weight: 700});
        if(xr > 80 && xr < 690 && xr <= front) m += L.text(xr, 80, "R", {size: 15, color: C.muted, weight: 700});
      }
      L.svg(m, pist ? "Piston making compressions and rarefactions" : "Slinky with a marked turn", 250);
      L.readout([["Marked " + (pist ? "particle" : "turn"), "oscillates about its mean position", C.danger], ["Compressions and rarefactions", "travel along the " + (pist ? "tube" : "slinky"), C.path], ["Type of wave", "longitudinal"]]);
      msg = t < 4 ? "Oscillating…" : pist ? "Compressions (C) and rarefactions (R) travelled down the tube while <b>each particle only oscillated</b> about its mean position." : "Squeezed and stretched regions moved along the slinky, but <b>the marked turn only moved back and forth</b>.";
    } else if(st.preset === "transverse"){
      for(i = 0; i < 18; i++){
        var xe2 = 95 + i * 34, s = disp(xe2, t, x0);
        m += L.circle(xe2 + s, 80, 5, i === 6 ? C.danger : C.vel) + L.circle(xe2, 200 - s * 2, 5, i === 6 ? C.danger : C.path);
      }
      m += L.arrow(305, 50, 345, 50, C.vel, 2) + L.arrow(345, 50, 305, 50, C.vel, 2) + L.text(360, 44, "vibration ∥ propagation", {size: 12, color: C.vel, anchor: "start"});
      m += L.arrow(299, 150, 299, 250, C.path, 2) + L.arrow(299, 250, 299, 150, C.path, 2) + L.text(320, 150, "vibration ⟂ propagation", {size: 12, color: C.path, anchor: "start"});
      m += L.arrow(560, 275, 680, 275, C.faint, 2) + L.text(555, 280, "wave travels", {size: 12, color: C.muted, anchor: "end"});
      L.svg(m, "Longitudinal and transverse waves", 290);
      L.readout([["Longitudinal (sound)", "particles vibrate parallel to the wave", C.vel], ["Transverse", "particles vibrate perpendicular to the wave", C.path]]);
      msg = t < 4 ? "Waves travelling…" : "Longitudinal (sound): particles vibrate <b>parallel</b> to the wave's direction. Transverse: particles vibrate <b>perpendicular</b> to it.";
    } else {
      m += L.circle(360, 150, 8, C.danger);
      for(i = 0; i < 6; i++){
        var rc = 70 * t - i * 60;
        if(rc > 4 && rc < 330) m += '<circle cx="360" cy="150" r="' + rc.toFixed(1) + '" fill="none" stroke="' + C.path + '" stroke-width="3" opacity="' + (1 - rc / 330).toFixed(2) + '"/>';
        var rr = rc - 30;
        if(rr > 4 && rr < 330) m += '<circle cx="360" cy="150" r="' + rr.toFixed(1) + '" fill="none" stroke="' + C.muted + '" stroke-width="1.5" stroke-dasharray="4 5" opacity="' + (1 - rr / 330).toFixed(2) + '"/>';
      }
      L.svg(m, "Spherical sound waves", 300);
      L.readout([["Solid rings", "compressions", C.path], ["Dashed rings", "rarefactions"], ["Direction", "outwards in all directions"]]);
      msg = t < 4 ? "Spreading out…" : "From a small source, compressions and rarefactions spread out <b>in all directions</b> as spherical waves (Fig. 10.10).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["piston", "Fig. 10.9: piston in a tube"], ["slinky", "Activity 10.5: slinky"], ["transverse", "Longitudinal vs transverse"], ["spherical", "Fig. 10.10: point source"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.piston = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Energy of sound and density graphs (Activity 10.6, Figs. 10.15–10.16)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "graph"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "graph" || id === "point" ? [[C.vel, "air particles"], [C.path, "density graph"]] : [[C.path, "sound / signal"]]);
    L.watch({grains: "Activity 10.6: grains on a stretched sheet, with a plate struck softly and then hard nearby.", graph: "Fig. 10.16: a snapshot of air particles and the matching density–distance graph (slowed down).", point: "Ready to Go Beyond: density at one fixed point plotted against time (1 Hz, illustrative and slowed).", mic: "Fig. 10.15: microphone and speaker."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i, LAM = 160, K = 2 * Math.PI / LAM, W = 2 * Math.PI * 0.6;
    if(st.preset === "grains"){
      var hard = t >= 1.5, local = hard ? t - 1.5 : t, amp = (hard ? 30 : 8) * Math.max(0, 1 - local / 1.4);
      m += L.rect(420, 170, 180, 90, "#475569", ' rx="10"') + L.line(410, 170, 610, 170, "#e2e8f0", 3);
      for(i = 0; i < 14; i++){ var h = amp * Math.abs(Math.sin(9 * local + i)); m += L.rect(430 + i * 12, 162 - h, 6, 6, "#fbbf24"); }
      m += L.rect(90, 120, 90, 12, "#94a3b8") + L.line(110, 90, 150, 118, "#a16207", 5);
      if(amp > 0.5) for(i = 1; i <= 4; i++) m += '<path d="M' + (200 + i * 45) + ' 90 q25 40 0 80" fill="none" stroke="' + C.path + '" stroke-width="' + (hard ? 4 : 2) + '" opacity="' + Math.min(1, amp / 10).toFixed(2) + '"/>';
      L.svg(m, "Grains jumping on a sheet", 290);
      L.readout([["Strike", hard ? "hard" : "soft"], ["Grains jump", hard ? "high" : "a little", C.path], ["Energy carried", hard ? "more" : "less"]]);
      msg = t < 3 ? "Striking the plate…" : "A harder strike sent more energy through the air: <b>the grains jumped higher</b>. Sound carries energy.";
    } else if(st.preset === "graph" || st.preset === "point"){
      var XP = 360;
      for(i = 0; i < 260; i++){ var xe = 60 + i * 2.35, s = 14 * Math.sin(W * t - K * (xe - 60)); m += L.circle(xe + s, 40 + (i * 37) % 70, 1.8, C.vel); }
      if(st.preset === "graph"){
        m += L.line(60, 200, 670, 200, C.faint, 1.5, "6 5") + L.text(675, 204, "average", {size: 11, color: C.muted, anchor: "start"}) + L.text(40, 205, "density", {size: 11, color: C.muted, anchor: "end"});
        m += '<path d="' + wavePath10(60, 670, 200, 55, 610 / LAM, -(W * t) + Math.PI / 2, function(th){ return Math.sin(th); }) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
        for(var n = -1; n < 6; n++){ var xc = 60 + (W * t / (2 * Math.PI) - n) * LAM; if(xc > 70 && xc < 660) m += L.text(xc, 135, "C / crest", {size: 12, color: C.path, weight: 700}); var xr = xc + LAM / 2; if(xr > 70 && xr < 660) m += L.text(xr, 280, "R / trough", {size: 12, color: C.muted, weight: 700}); }
        L.svg(m, "Density graph of a sound wave", 300);
        L.readout([["Dots crowded (compression)", "crest of the graph", C.path], ["Dots spread out (rarefaction)", "trough of the graph"], ["Dashed line", "average density"]]);
        msg = t < 3 ? "The wave moves…" : "Where the dots crowd together (C) the graph shows a <b>crest</b>; where they spread out (R), a <b>trough</b> (Fig. 10.16).";
      } else {
        var osc = Math.floor(0.6 * t + 1e-9) , pts = [];
        m += L.line(XP, 30, XP, 120, C.danger, 2) + L.text(XP, 138, "fixed point", {size: 11, color: C.danger});
        for(i = 0; i <= 60; i++){ var tt = t * i / 60; pts.push((80 + tt * 190).toFixed(1) + "," + (225 - 45 * Math.cos(W * tt - K * (XP - 60))).toFixed(1)); }
        m += L.line(80, 225, 660, 225, C.faint, 1.5, "6 5") + '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>' + L.text(660, 290, "time →", {size: 12, color: C.muted, anchor: "end"}) + L.text(70, 230, "density", {size: 11, color: C.muted, anchor: "end"});
        L.svg(m, "Density at one point against time", 300);
        L.readout([["Time", L.num(t, 2) + " s"], ["Complete oscillations", String(Math.floor(0.6 * t + 1e-9)), C.path]]);
        msg = t < 3 ? "Recording…" : "At one fixed point the density rises and falls again and again: here <b>" + Math.floor(0.6 * 3 + 1e-9) + " complete oscillation</b> and more in 3 s of slowed motion.";
      }
    } else {
      var ph = 2 * Math.PI * 1.2 * t;
      for(i = 1; i <= 3; i++) m += '<path d="M' + (40 + i * 22) + ' 110 q14 35 0 70" fill="none" stroke="' + C.path + '" stroke-width="3" opacity="' + (0.4 + 0.6 * Math.abs(Math.sin(ph - i))).toFixed(2) + '"/>';
      m += L.rect(140, 115, 50, 60, "#334155", ' rx="20"') + L.line(165 + 4 * Math.sin(ph), 120, 165 + 4 * Math.sin(ph), 170, "#e2e8f0", 3) + L.text(165, 200, "microphone", {size: 12, color: C.text});
      m += '<path d="' + wavePath10(200, 500, 145, 18, 4, ph) + '" fill="none" stroke="#facc15" stroke-width="3"/>' + L.text(350, 105, "electrical signal", {size: 12, color: "#facc15"});
      m += '<polygon points="510,125 540,105 540,185 510,165" fill="#475569"/>' + L.line(540 + 5 * Math.sin(ph), 105, 540 + 5 * Math.sin(ph), 185, "#e2e8f0", 3) + L.text(540, 210, "speaker", {size: 12, color: C.text});
      for(i = 1; i <= 3; i++) m += '<path d="M' + (560 + i * 22) + ' 110 q14 35 0 70" fill="none" stroke="' + C.path + '" stroke-width="3" opacity="' + (0.4 + 0.6 * Math.abs(Math.sin(ph - i))).toFixed(2) + '"/>';
      L.svg(m, "Microphone and speaker", 260);
      L.readout([["Microphone", "sound → electrical signal", C.path], ["Speaker", "electrical signal → sound", C.path]]);
      msg = t < 3 ? "Converting…" : "The microphone's diaphragm turns sound energy into an <b>electrical signal</b>; the speaker's cone turns it back into sound (Fig. 10.15).";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["grains", "Activity 10.6: jumping grains"], ["graph", "Fig. 10.16: density graph"], ["point", "Density at one point"], ["mic", "Microphone and speaker"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.densityGraph = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Wavelength, frequency, time period, amplitude, intensity (Section 10.6.1–10.6.2)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex101", f: 500, a: 2};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "ex101" ? {maxT: 2, step: 0.02, speed: 0.25} : {maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "intensity" ? [[C.path, "energy on the wave front"]] : [[C.path, "density"], [C.faint, "average density"]]);
    L.watch({ex101: "Example 10.1: density oscillations at one position over 2 s (slowed down).", fig1019: "Fig. 10.19: density against distance, with ticks every 1.5 cm.", amplitude: "Fig. 10.20: two waves with the same wavelength but different amplitudes.", intensity: "Fig. 10.21: the same energy spreading out from a point source.", explore: "Choose a frequency and amplitude for a sound in air (340 m s⁻¹). The graph spans 3.4 m."}[id]);
    if(id === "explore"){
      L.controls(L.slider("wp-f", "Frequency", 100, 1000, 100, st.f, st.f + " Hz") + L.slider("wp-a", "Amplitude", 1, 3, 1, st.a, st.a + " units"));
      L.onInput("wp-f", function(v){ st.f = v; L.setVal("wp-f", v + " Hz"); App.resetTimeline(); App.play(); });
      L.onInput("wp-a", function(v){ st.a = v; L.setVal("wp-a", v + " units"); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function axes(m, x0, y0, w, ylab, xlab){ return m + L.line(x0, y0, x0 + w, y0, C.faint, 1.5, "6 5") + L.line(x0, y0 - 90, x0, y0 + 90, "#94a3b8", 1.5) + L.text(x0 - 8, y0 - 80, ylab, {size: 11, color: C.muted, anchor: "end"}) + L.text(x0 + w, y0 + 105, xlab, {size: 11, color: C.muted, anchor: "end"}); }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "ex101"){
      var pts = [], osc = Math.floor(5 * t + 1e-9);
      m = axes(m, 70, 150, 590, "density", "time (s)");
      for(i = 0; i <= 400; i++){ var tt = t * i / 400; pts.push((70 + tt * 290).toFixed(1) + "," + (150 - 70 * Math.sin(2 * Math.PI * 5 * tt)).toFixed(1)); }
      m += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="2.5"/>';
      [0, 1, 2].forEach(function(s){ m += L.text(70 + s * 290, 270, s + " s", {size: 12, color: C.muted}); });
      L.svg(m, "Density oscillations at one position", 290);
      L.readout([["Time", L.num(t, 2) + " s"], ["Oscillations counted", String(osc), C.path], ["Frequency", "10 ÷ 2 s = 5 Hz"], ["Time period", "2 s ÷ 10 = 0.2 s"]]);
      msg = t < 2 ? "Counting oscillations…" : "<b>Example 10.1:</b> 10 oscillations in 2 s give ν = <b>5 Hz</b>, and each takes T = 2 s ÷ 10 = <b>0.2 s</b>.";
    } else if(st.preset === "fig1019"){
      var X = function(cm){ return 80 + cm * 95; }, f = clamp10(t / 1.5, 0, 1);
      m = axes(m, 80, 150, 580, "density", "distance (cm)");
      m += '<path d="' + wavePath10(X(0), X(6), 150, 60, 2, 0) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
      [1.5, 3, 4.5, 6].forEach(function(c){ m += L.text(X(c), 262, c.toFixed(1), {size: 12, color: C.muted}); });
      var x1 = X(0.75), x2 = X(0.75 + 3 * f);
      m += L.line(x1, 80, x1, 150, C.vel, 1.5, "4 4") + L.line(X(3.75), 80, X(3.75), 150, C.vel, 1.5, "4 4") + L.arrow(x1, 70, x2, 70, C.vel, 3);
      if(f >= 1) m += L.text((x1 + x2) / 2, 55, "λ = 3.0 cm", {size: 14, color: C.vel, weight: 700}) + L.arrow(X(0), 230, X(1.5), 230, C.ok, 2) + L.text(X(0.75), 222, "λ/2 = 1.5 cm", {size: 12, color: C.ok, weight: 700});
      L.svg(m, "Fig. 10.19 wave", 280);
      L.readout([["Crest to crest", f >= 1 ? "0.75 cm → 3.75 cm" : "measuring…", C.vel], ["Wavelength", f >= 1 ? "3.0 cm" : "…", C.path], ["Half the wavelength", f >= 1 ? "1.5 cm" : "…", C.ok]]);
      msg = t < 2 ? "Measuring…" : "<b>Fig. 10.19:</b> consecutive crests are 3.0 cm apart, so λ = 3.0 cm and <b>half the wavelength is 1.5 cm</b> (Pause and Ponder 9).";
    } else if(st.preset === "amplitude"){
      var ph = 2 * Math.PI * 0.5 * t;
      [[80, 18, "(a) low amplitude"], [210, 45, "(b) high amplitude"]].forEach(function(r){
        m += L.line(80, r[0], 660, r[0], C.faint, 1.5, "6 5") + '<path d="' + wavePath10(80, 660, r[0], r[1], 3, ph) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>' + L.text(70, r[0] - 50 + (r[1] > 30 ? -10 : 20), r[2], {size: 13, color: C.text, anchor: "start"});
        m += L.line(90 + 580 / 12, r[0], 90 + 580 / 12, r[0] - r[1], C.vel, 2) + L.text(100 + 580 / 12, r[0] - r[1] / 2, "amplitude", {size: 11, color: C.vel, anchor: "start"});
      });
      L.svg(m, "Low and high amplitude waves", 290);
      L.readout([["Wavelength", "the same in (a) and (b)"], ["Amplitude", "(b) larger", C.vel], ["Energy carried", "(b) more", C.path]]);
      msg = t < 2 ? "Comparing…" : "Same wavelength, but the bigger change in density means a <b>larger amplitude</b>, and the wave carries more energy (Fig. 10.20).";
    } else if(st.preset === "intensity"){
      var R = 40 + 120 * clamp10(t / 2, 0, 1);
      m += L.circle(200, 150, 7, C.danger);
      [60, 110, 160].forEach(function(rr){ m += '<path d="M' + (200 + rr * Math.cos(-0.6)).toFixed(1) + ' ' + (150 + rr * Math.sin(-0.6)).toFixed(1) + ' A' + rr + ' ' + rr + ' 0 0 1 ' + (200 + rr * Math.cos(0.6)).toFixed(1) + ' ' + (150 + rr * Math.sin(0.6)).toFixed(1) + '" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>'; });
      m += '<path d="M' + (200 + R * Math.cos(-0.6)).toFixed(1) + ' ' + (150 + R * Math.sin(-0.6)).toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' + (200 + R * Math.cos(0.6)).toFixed(1) + ' ' + (150 + R * Math.sin(0.6)).toFixed(1) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
      for(i = 0; i < 9; i++){ var an = -0.55 + i * 1.1 / 8; m += L.circle(200 + R * Math.cos(an), 150 + R * Math.sin(an), 4, "#facc15"); }
      m += L.text(470, 120, "same 9 energy packets", {size: 14, color: "#facc15", anchor: "start"}) + L.text(470, 150, "spread over a " + (R > 100 ? "larger" : "smaller") + " area", {size: 14, color: C.text, anchor: "start"});
      L.svg(m, "Sound energy spreading out", 290);
      L.readout([["Energy on the front", "unchanged"], ["Area it covers", R > 100 ? "larger" : "small", C.path], ["Intensity", t >= 2 ? "decreased" : "decreasing"]]);
      msg = t < 2 ? "Spreading out…" : "The same energy spreads over a larger area as the wave moves out, so <b>the intensity decreases with distance</b> (Fig. 10.21).";
    } else {
      var lam = 340 / st.f, T = 1 / st.f, ph2 = 2 * Math.PI * 0.8 * t;
      m = axes(m, 60, 150, 600, "density", "distance (3.4 m shown)");
      m += '<path d="' + wavePath10(60, 660, 150, st.a * 25, 3.4 / lam, ph2) + '" fill="none" stroke="' + C.path + '" stroke-width="2.5"/>';
      L.svg(m, "Sound wave with chosen frequency", 280);
      L.readout([["Frequency ν", st.f + " Hz"], ["Time period T = 1/ν", T.toFixed(4) + " s"], ["Wavelength λ = v/ν", lam.toFixed(2) + " m", C.path], ["Amplitude", st.a + " units"]]);
      msg = "ν = " + st.f + " Hz, so T = 1/ν = " + T.toFixed(4) + " s and λ = 340 ÷ " + st.f + " = <b>" + lam.toFixed(2) + " m</b>. Higher frequency means a shorter wavelength and a shorter time period.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["ex101", "Example 10.1: counting"], ["fig1019", "Fig. 10.19: wavelength"], ["amplitude", "Fig. 10.20: amplitude"], ["intensity", "Fig. 10.21: intensity"], ["explore", "Explore ν, T and λ"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.waveProps = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Speed of sound (Section 10.6.3, Examples 10.2–10.4, Table 10.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "ex103"};
  function select(id){
    st.preset = id; L.markPreset(id);
    var cfg = {ex102: [1, 0.05, 0.6], ex103: [5, 0.1, 1], ex104: [0.02, 0.0005, 0.02], race: [1, 0.005, 0.25], temperature: [5.3, 0.05, 1]}[id];
    L.timeline({maxT: cfg[0], step: cfg[1], speed: cfg[2], format: function(t){ return "t = <b>" + (id === "ex104" ? L.num(t, 4) : L.num(t, id === "race" ? 3 : 2)) + " s</b>"; }});
    L.legend(id === "race" ? [["#94a3b8", "steel"], ["#38bdf8", "water"], [C.path, "air"]] : id === "temperature" ? [[C.danger, "22 °C (344 m s⁻¹)"], [C.vel, "0 °C (331 m s⁻¹)"]] : [[C.path, "sound"]]);
    L.watch({ex102: "Example 10.2: the lowest and highest frequencies we hear, in air at 344 m s⁻¹.", ex103: "Example 10.3: thunder heard 5 s after the lightning flash (340 m s⁻¹).", ex104: "Example 10.4: a sound wave in steel (5000 m s⁻¹), from the graph in Fig. 10.22.", race: "Table 10.1 and Pause and Ponder 11: a knock travels 340 m through steel, water and air.", temperature: "Exercise Q12: thunder travels 1720 m on a 22 °C day and on a 0 °C day."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "ex102"){
      var f = clamp10(t, 0, 1);
      m += L.text(40, 60, "20 Hz: λ = 344 ÷ 20 = 17.2 m", {size: 15, color: C.path, anchor: "start", weight: 700}) + L.rect(40, 75, 600 * f, 26, C.path, ' rx="4"') + L.text(40, 125, "bar drawn to scale: 600 px = 17.2 m", {size: 11, color: C.muted, anchor: "start"});
      m += L.text(40, 180, "20 kHz: λ = 344 ÷ 20000 = 0.0172 m = 1.72 cm", {size: 15, color: C.vel, anchor: "start", weight: 700}) + L.rect(40, 195, Math.max(1, 0.6 * f), 26, C.vel) + L.text(52, 213, "← 1.72 cm on the same scale (0.6 px)", {size: 12, color: C.vel, anchor: "start"});
      m += '<path d="' + wavePath10(360, 680, 250, 12, 18 * f, 0) + '" fill="none" stroke="' + C.vel + '" stroke-width="1.2"/>' + L.text(355, 255, "many short waves", {size: 11, color: C.muted, anchor: "end"});
      L.svg(m, "Wavelengths at 20 Hz and 20 kHz", 290);
      L.readout([["Speed in air", "344 m s⁻¹"], ["20 Hz", "λ = 17.2 m", C.path], ["20 kHz", "λ = 1.72 cm", C.vel]]);
      msg = t < 1 ? "Comparing…" : "<b>Example 10.2:</b> λ = 344 ÷ 20 = <b>17.2 m</b>, and 344 ÷ 20000 = <b>1.72 cm</b>. The speed is the same; only the wavelength changes.";
    } else if(st.preset === "ex103"){
      var d = Math.min(1700, 340 * t), X = function(md){ return 620 - md / 1700 * 520; };
      m += L.line(40, 250, 700, 250, C.faint, 2) + '<polygon points="620,40 600,120 625,115 605,200 650,100 625,105 645,40" fill="' + (t < 0.2 ? "#fde047" : "#854d0e") + '"/>';
      m += person(90, 250) + '<path d="M' + X(d).toFixed(1) + ' 170 q-18 40 0 80" fill="none" stroke="' + C.path + '" stroke-width="4"/>';
      m += L.text(360, 285, "distance travelled by the thunder: " + Math.round(d) + " m", {size: 14, color: C.path, weight: 700});
      L.svg(m, "Lightning and thunder", 300);
      L.readout([["Time since flash", L.num(t, 1) + " s"], ["Sound travelled", Math.round(d) + " m", C.path], ["Light", "arrived almost instantly"]]);
      msg = t < 5 ? "Waiting for the thunder…" : "<b>Example 10.3:</b> 340 m s⁻¹ × 5 s = <b>1700 m</b>: the lightning struck about 1.7 km away.";
    } else if(st.preset === "ex104"){
      var X4 = function(md){ return 80 + md * 5.6; }, shift = 5000 * t;
      m += L.line(80, 150, 660, 150, C.faint, 1.5, "6 5") + L.line(80, 60, 80, 240, "#94a3b8", 1.5) + L.text(70, 70, "density", {size: 11, color: C.muted, anchor: "end"});
      m += '<path d="' + wavePath10(X4(0), X4(100), 150, 60, 2, 2 * Math.PI * shift / 50) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
      [25, 50, 75, 100].forEach(function(x){ m += L.text(X4(x), 262, x + " m", {size: 12, color: C.muted}); });
      m += L.arrow(X4(12.5), 70, X4(62.5), 70, C.vel, 2) + L.text(X4(37.5), 58, "λ = 50 m", {size: 13, color: C.vel, weight: 700});
      L.svg(m, "Sound wave in steel", 280);
      L.readout([["Wavelength (graph)", "50 m", C.vel], ["Frequency", "5000 ÷ 50 = 100 Hz", C.path], ["Time period", "1 ÷ 100 = 0.01 s"]]);
      msg = t < 0.02 ? "The wave moves 5000 m each second…" : "<b>Example 10.4:</b> λ = 50 m, so ν = 5000 m s⁻¹ ÷ 50 m = <b>100 Hz</b> and T = 1 ÷ 100 Hz = 0.01 s.";
    } else if(st.preset === "race"){
      [[80, "steel fence", "#94a3b8", 5000], [160, "water", "#38bdf8", 1500], [240, "air", C.path, 340]].forEach(function(r){
        var arr = 340 / r[3], fr = clamp10(t / arr, 0, 1), x = 110 + 540 * fr;
        m += L.rect(110, r[0] - 14, 540, 28, r[2], ' opacity="0.25" rx="5"') + L.text(100, r[0] + 5, r[1], {size: 13, color: C.text, anchor: "end"});
        m += '<path d="M' + x.toFixed(1) + ' ' + (r[0] - 12) + ' q10 12 0 24" fill="none" stroke="' + r[2] + '" stroke-width="4"/>';
        m += L.text(655, r[0] + 5, fr >= 1 ? arr.toFixed(3) + " s" : "", {size: 12, color: r[2], anchor: "start", weight: 700});
      });
      m += L.text(380, 285, "340 m", {size: 12, color: C.muted});
      L.svg(m, "Sound racing through three media", 300);
      L.readout([["Steel (5000 m s⁻¹)", "340 ÷ 5000 = 0.068 s", "#94a3b8"], ["Water (1500 m s⁻¹)", "340 ÷ 1500 = 0.227 s", "#38bdf8"], ["Air (340 m s⁻¹)", "340 ÷ 340 = 1 s", C.path], ["Air minus steel", "0.932 s"]]);
      msg = t < 1 ? "Racing…" : "Over 340 m the knock takes 0.068 s through steel and 1 s through air: they arrive <b>0.932 s apart</b>, more than 0.1 s, so Gunjan hears two separate sounds (Pause and Ponder 11).";
    } else {
      [[110, 344, C.danger, "22 °C"], [200, 331, C.vel, "0 °C"]].forEach(function(r){
        var arr = 1720 / r[1], fr = clamp10(t / arr, 0, 1), x = 90 + 560 * fr;
        m += L.rect(90, r[0] - 16, 560, 32, r[2], ' opacity="0.18" rx="5"') + L.text(80, r[0] + 5, r[3], {size: 13, color: C.text, anchor: "end"});
        m += '<path d="M' + x.toFixed(1) + ' ' + (r[0] - 14) + ' q10 14 0 28" fill="none" stroke="' + r[2] + '" stroke-width="4"/>' + L.text(655, r[0] + 5, fr >= 1 ? arr.toFixed(2) + " s" : "", {size: 12, color: r[2], anchor: "start", weight: 700});
      });
      m += L.text(370, 270, "1720 m", {size: 12, color: C.muted});
      L.svg(m, "Thunder on a warm and a cold day", 290);
      L.readout([["At 22 °C", "1720 ÷ 344 = 5.00 s", C.danger], ["At 0 °C", "1720 ÷ 331 = 5.20 s", C.vel], ["Extra time", "about 0.2 s"]]);
      msg = t < 5.3 ? "Travelling…" : "At 22 °C the thunder takes 1720 ÷ 344 = 5.00 s; at 0 °C, 1720 ÷ 331 = 5.20 s. It takes about <b>0.2 s longer</b> in the colder air (Exercise Q12).";
    }
    L.verdict(msg);
  }
  function person(x, y){ return L.circle(x, y - 62, 8, "#e2e8f0") + L.line(x, y - 54, x, y - 25, "#e2e8f0", 3) + L.line(x, y - 25, x - 9, y, "#e2e8f0", 3) + L.line(x, y - 25, x + 9, y, "#e2e8f0", 3); }
  function mount(){ L.presets([["ex102", "Example 10.2: 20 Hz and 20 kHz"], ["ex103", "Example 10.3: thunder"], ["ex104", "Example 10.4: steel"], ["race", "Table 10.1: race"], ["temperature", "Exercise Q12: temperature"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.speed = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Human perception: range, pitch, loudness, timbre, octave (Section 10.6.4)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "range"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.02, speed: 0.4});
    L.legend(id === "range" ? [[C.vel, "infrasonic"], [C.ok, "audible"], [C.path, "ultrasonic"]] : [[C.path, "sound wave"], [C.vel, "comparison wave"]]);
    L.watch({range: "Section 10.6.4: a frequency sweep from 5 Hz to 60 kHz on a logarithmic scale.", pitch: "Two tones of 200 Hz and 800 Hz (illustrative), drawn over the same short time.", loudness: "Three sounds of increasing amplitude, with typical decibel levels from the textbook.", timbre: "Fig. 10.25: a pure tone and a musical note with overtones (shapes illustrative).", octave: "Threads of Curiosity: notes of 200 Hz and 400 Hz."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = clamp10(t / 2, 0, 1);
    if(st.preset === "range"){
      var X = function(hz){ return 60 + (Math.log(hz) / Math.LN10) * 120; }, hz = 5 * Math.pow(12000, f), cat = hz < 20 ? "infrasonic" : hz <= 20000 ? "audible" : "ultrasonic";
      m += L.rect(X(1), 120, X(20) - X(1), 50, C.vel, ' opacity="0.5"') + L.rect(X(20), 120, X(20000) - X(20), 50, C.ok, ' opacity="0.5"') + L.rect(X(20000), 120, X(100000) - X(20000), 50, C.path, ' opacity="0.5"');
      [1, 10, 100, 1000, 10000, 100000].forEach(function(v){ m += L.line(X(v), 170, X(v), 178, "#94a3b8", 1.5) + L.text(X(v), 195, v >= 1000 ? v / 1000 + " kHz" : v + " Hz", {size: 11, color: C.muted}); });
      m += L.text((X(1) + X(20)) / 2, 150, "infrasonic", {size: 12, color: "#0f172a", weight: 700}) + L.text((X(20) + X(20000)) / 2, 150, "audible to humans", {size: 13, color: "#0f172a", weight: 700}) + L.text((X(20000) + X(100000)) / 2, 150, "ultrasonic", {size: 12, color: "#0f172a", weight: 700});
      m += L.text((X(1) + X(20)) / 2, 100, "elephants", {size: 12, color: C.vel}) + L.text((X(20000) + X(100000)) / 2, 100, "dogs, cats, bats, dolphins", {size: 12, color: C.path});
      m += L.line(X(hz), 60, X(hz), 180, "#facc15", 3) + L.text(X(hz), 50, Math.round(hz) + " Hz", {size: 13, color: "#facc15", weight: 700});
      L.svg(m, "Hearing range", 230);
      L.readout([["Frequency", Math.round(hz) + " Hz"], ["Category", cat, cat === "audible" ? C.ok : cat === "infrasonic" ? C.vel : C.path], ["Human range", "20 Hz to 20 kHz"]]);
      msg = t < 2 ? "Sweeping…" : "Below 20 Hz sound is <b>infrasonic</b>; from 20 Hz to 20 kHz it is audible to humans; above 20 kHz it is ultrasonic.";
    } else if(st.preset === "pitch" || st.preset === "octave"){
      var oct = st.preset === "octave", lo = oct ? 200 : 200, hi = oct ? 400 : 800, cyc = oct ? 3 : 2;
      m += L.line(60, 90, 660, 90, C.faint, 1, "5 5") + L.line(60, 210, 660, 210, C.faint, 1, "5 5");
      m += '<path d="' + wavePath10(60, 60 + 600 * f, 90, 45, cyc * f, 0) + '" fill="none" stroke="' + C.vel + '" stroke-width="3"/>' + '<path d="' + wavePath10(60, 60 + 600 * f, 210, 45, cyc * hi / lo * f, 0) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>';
      m += L.text(60, 30, lo + " Hz", {size: 14, color: C.vel, anchor: "start", weight: 700}) + L.text(60, 150, hi + " Hz", {size: 14, color: C.path, anchor: "start", weight: 700});
      L.svg(m, oct ? "Two notes an octave apart" : "Low and high pitch", 270);
      L.readout(oct ? [["Lower note", "200 Hz", C.vel], ["Upper note", "400 Hz = 2 × 200 Hz", C.path], ["Interval", "one octave"]] : [["200 Hz", "lower pitch (deeper)", C.vel], ["800 Hz", "higher pitch (shriller)", C.path], ["Oscillations in the same time", "4 times as many at 800 Hz"]]);
      msg = t < 2 ? "Drawing…" : oct ? "400 Hz is double 200 Hz, so the two notes are <b>an octave apart</b>: the upper wave fits exactly two oscillations into each one of the lower." : "The 800 Hz wave oscillates 4 times as often, so it has a <b>higher pitch</b> (shriller) than the 200 Hz wave.";
    } else if(st.preset === "loudness"){
      [[60, 6, "rustling leaves: a few dB"], [150, 20, "conversation: about 60 dB"], [245, 40, "firecracker: over 100 dB"]].forEach(function(r){
        m += L.line(260, r[0], 680, r[0], C.faint, 1, "5 5") + '<path d="' + wavePath10(260, 260 + 420 * f, r[0], r[1], 5 * f, 0) + '" fill="none" stroke="' + C.path + '" stroke-width="2.5"/>' + L.text(250, r[0] + 5, r[2], {size: 13, color: C.text, anchor: "end"});
      });
      L.svg(m, "Loudness and amplitude", 300);
      L.readout([["Larger amplitude", "heard as louder", C.path], ["Normal conversation", "about 60 dB"], ["Firecrackers", "over 100 dB"]]);
      msg = t < 2 ? "Comparing…" : "Larger amplitude is heard as louder: rustling leaves (a few dB), conversation (<b>about 60 dB</b>), firecrackers (over 100 dB). Long exposure to loud sound can damage hearing.";
    } else {
      m += L.line(60, 90, 660, 90, C.faint, 1, "5 5") + L.line(60, 215, 660, 215, C.faint, 1, "5 5");
      m += '<path d="' + wavePath10(60, 60 + 600 * f, 90, 45, 4 * f, 0) + '" fill="none" stroke="' + C.vel + '" stroke-width="3"/>' + L.text(60, 30, "(a) tone: a single frequency (tuning fork, whistle)", {size: 13, color: C.vel, anchor: "start"});
      m += '<path d="' + wavePath10(60, 60 + 600 * f, 215, 30, 4 * f, 0, function(th){ return Math.sin(th) + 0.5 * Math.sin(2 * th) + 0.3 * Math.sin(3 * th); }) + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>' + L.text(60, 150, "(b) note: fundamental + overtones (singing, tanpura)", {size: 13, color: C.path, anchor: "start"});
      L.svg(m, "Tone and note", 280);
      L.readout([["Tone", "one frequency", C.vel], ["Note", "fundamental + overtones", C.path], ["Timbre", "set by the pattern of overtones"]]);
      msg = t < 2 ? "Drawing…" : "A tone has one frequency; a note adds <b>overtones</b> to its fundamental. The overtone pattern gives each instrument its timbre, so a flute and a tabla sound different.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["range", "Hearing range"], ["pitch", "Pitch"], ["loudness", "Loudness"], ["timbre", "Tone, note and timbre"], ["octave", "Octave"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.hearing = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Echo, reverberation, sonar, echolocation (Sections 10.7–10.8, Examples 10.5–10.6)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "minEcho"};
  var CFG = {minEcho: {v: 340, d: 17, name: "wall"}, ex105: {v: 340, d: 85, name: "wall"}, sonar: {v: 1530, d: 688.5, name: "object"}, bat: {v: 340, d: 3, name: "moth"}};
  function select(id){
    st.preset = id; L.markPreset(id);
    var T = id === "reverb" ? 3 : 2 * CFG[id].d / CFG[id].v;
    L.timeline({maxT: T, step: T / 100, speed: T / 3, format: function(t){ return "t = <b>" + L.num(t, 3) + " s</b>"; }});
    L.legend(id === "reverb" ? [[C.path, "reflected sound"], [C.vel, "sound level"]] : [[C.path, "outgoing sound"], [C.vel, "echo"]]);
    L.watch({minEcho: "Section 10.7.1: a wall 17 m away, speed of sound 340 m s⁻¹.", ex105: "Example 10.5: a clap in an empty corridor, echo after 0.5 s.", reverb: "Section 10.7.2: many reflections in a hall; soft panels are added after 1.5 s (illustrative).", sonar: "Example 10.6: a naval sonar pulse in seawater (1530 m s⁻¹) returning after 0.90 s.", bat: "Section 10.8.1: a bat's ultrasonic call reflects from a moth 3 m away (illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "reverb"){
      var soft = t >= 1.5, level = soft ? 0.35 * Math.exp(-(t - 1.5) * 6) : Math.exp(-(t % 1.5) * 1.5) * (t % 1.5 < 0.05 ? 1 : 0.9);
      m += L.rect(80, 40, 560, 220, "none", ' stroke="' + (soft ? "#a16207" : "#cbd5e1") + '" stroke-width="' + (soft ? 10 : 4) + '"');
      for(var i = 0; i < 10; i++){
        var ang = i * 0.63 + 0.3, len = 700 * ((t % 1.5) / 1.5) * (soft ? 0.5 : 1), x = 360, y = 150, dx = Math.cos(ang), dy = Math.sin(ang), pts = [x + "," + y], rem = len;
        for(var b = 0; b < 6 && rem > 0; b++){
          var tx = dx > 0 ? (640 - x) / dx : (80 - x) / dx, ty = dy > 0 ? (260 - y) / dy : (40 - y) / dy, step = Math.min(tx, ty, rem);
          x += dx * step; y += dy * step; rem -= step; pts.push(x.toFixed(1) + "," + y.toFixed(1));
          if(step === tx) dx = -dx; else if(step === ty) dy = -dy;
        }
        m += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="1.5" opacity="' + (0.25 + 0.5 * level).toFixed(2) + '"/>';
      }
      m += L.circle(360, 150, 8, C.danger) + L.rect(660, 260 - 200 * level, 30, 200 * level, C.vel) + L.text(675, 285, "level", {size: 11, color: C.muted});
      L.svg(m, "Reverberation in a hall", 300);
      L.readout([["Reflections", "arrive less than 0.05 s apart"], ["Walls", soft ? "soft absorbing panels" : "hard, reflecting", soft ? "#a16207" : C.text], ["Sound lingers", soft ? "briefly" : "for a long time", C.vel]]);
      msg = t < 3 ? "Echoing around the hall…" : "Many reflections arriving less than 0.05 s apart make the sound linger: <b>reverberation</b>. Soft panels, curtains and upholstered chairs absorb sound and cut it down.";
    } else {
      var P = CFG[st.preset], T = 2 * P.d / P.v, half = T / 2, out = t <= half, frac = out ? t / half : (T - t) / half, sonar = st.preset === "sonar", bat = st.preset === "bat";
      var sx = 80, ex = 620, pos = sx + (ex - sx) * clamp10(frac, 0, 1);
      if(sonar){
        m += L.rect(0, 70, 720, 230, "#0c4a6e") + '<polygon points="50,55 150,55 135,75 65,75" fill="#cbd5e1"/>';
        var py = 75 + 200 * clamp10(frac, 0, 1);
        m += L.rect(560, 262, 110, 22, "#475569", ' rx="10"') + L.text(615, 256, "object", {size: 12, color: C.text});
        m += '<path d="M60 ' + py.toFixed(1) + ' q40 ' + (out ? 12 : -12) + ' 80 0" fill="none" stroke="' + (out ? C.path : C.vel) + '" stroke-width="4" transform="translate(' + (500 * clamp10(frac, 0, 1)).toFixed(1) + ' 0)"/>';
        m += L.text(360, 40, out ? "pulse going down" : "echo coming back", {size: 14, color: out ? C.path : C.vel, weight: 700});
      } else {
        m += L.line(20, 250, 700, 250, C.faint, 2) + (bat ? '<path d="M60 130 q20 -25 40 0 q20 -25 40 0 l-40 18 z" fill="#475569"/>' + L.circle(ex, 140, 9, "#fde68a") + L.text(ex, 120, "moth", {size: 12, color: C.text}) : L.rect(ex, 60, 30, 190, "#78716c") + L.circle(sx, 188, 8, "#e2e8f0") + L.line(sx, 196, sx, 225, "#e2e8f0", 3) + L.line(sx, 225, sx - 9, 250, "#e2e8f0", 3) + L.line(sx, 225, sx + 9, 250, "#e2e8f0", 3));
        m += '<path d="M' + pos.toFixed(1) + ' ' + (bat ? 115 : 160) + ' q' + (out ? 14 : -14) + ' 25 0 50" fill="none" stroke="' + (out ? C.path : C.vel) + '" stroke-width="4"/>';
        m += L.text((sx + ex) / 2, 285, P.d + " m", {size: 13, color: C.muted});
      }
      L.svg(m, sonar ? "Sonar pulse" : bat ? "Bat echolocation" : "Echo from a wall", 300);
      var rows = [["Time", L.num(t, 3) + " s"], ["Sound path so far", L.num(P.v * t, 1) + " m", C.path], ["Distance to " + P.name, "v × t ÷ 2 = " + P.v + " × " + L.num(T, 3) + " ÷ 2 = " + P.d + " m", C.vel]];
      if(st.preset === "minEcho") rows.push(["Gap after the shout", "0.1 s: just enough for an echo"]);
      L.readout(rows);
      var done = t >= T - 1e-9;
      msg = !done ? "Sound travelling…" : {minEcho: "In 0.1 s sound travels 34 m, there and back, so the wall must be at least <b>17 m</b> away to hear an echo.", ex105: "<b>Example 10.5:</b> the clap travels 340 × 0.5 = 170 m there and back, so the wall is <b>85 m</b> away.", sonar: "<b>Example 10.6:</b> the pulse took 0.45 s each way, so the object is 1530 m s⁻¹ × 0.45 s = <b>688.5 m</b> away.", bat: "The bat times its ultrasonic echo: 2 × 3 m ÷ 340 m s⁻¹ ≈ <b>0.018 s</b> tells it the moth is 3 m away."}[st.preset];
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["minEcho", "Minimum echo distance"], ["ex105", "Example 10.5: corridor"], ["reverb", "Reverberation"], ["sonar", "Example 10.6: sonar"], ["bat", "Bat echolocation"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.echo = {mount: mount, draw: draw, select: select, state: st};
})();
