// Class 10 Science, Chapter 12 (jesc112) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, st = {preset: "oersted"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Oersted 1820: a current deflects a compass. Field lines leave N, enter S, never cross.");
    L.legend([["#ef4444","N"],["#38bdf8","S"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      oersted: {t:"Activity 12.1", d:"A compass beside a copper wire twitches when the key is closed. Current has produced a magnetic field."},
      lines: {t:"Field lines", d:"Emerge from N, merge at S, closed through the magnet. Crowding means stronger B. They never cross."},
      filings: {t:"Iron filings (Activity 12.2)", d:"Each filing is a tiny dipole. The pattern is the field around the bar magnet (Fig. 12.2, 12.4)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["oersted","Oersted"],["lines","field lines"],["filings","filings"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.field = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "circ"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Concentric circles. B grows with I, falls with distance. Thumb along I.");
    L.legend([["#22c55e","I"],["#a78bfa","B"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      circ: {t:"Concentric circles", d:"Exercise Q1 (d). Filings around a straight wire form rings centred on the wire, not radial spokes."},
      thumb: {t:"Right-hand thumb rule", d:"Thumb along current, fingers wrap in the direction of B. Maxwell corkscrew is the same rule."},
      ex1: {t:"Example 12.1", d:"Power line current east to west. B is clockwise viewed from the east, anti-clockwise viewed from the west."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["circ","circles"],["thumb","thumb rule"],["ex1","Example 12.1"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.wire = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "loop"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("n turns add. Solenoid interior is uniform. Soft iron core → electromagnet.");
    L.legend([["#eab308","loop"],["#22c55e","solenoid"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      loop: {t:"Circular loop", d:"At the centre the big arcs look like parallel straight lines. n turns: field about n times one turn."},
      sol: {t:"Solenoid", d:"Like a bar magnet: N and S ends. Inside, parallel lines — the field is the same at all points (in-text Q3 d)."},
      em: {t:"Electromagnet", d:"Soft iron (Fig. 12.11 steel rod) in a current-carrying solenoid becomes a magnet you can switch off."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["loop","loop"],["sol","solenoid"],["em","electromagnet"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.sol = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "act"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Force largest when I ⟂ B. Fleming: first B, second I, thumb F. Electron: I opposite v.");
    L.legend([["#ef4444","F"],["#38bdf8","B"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      act: {t:"Activity 12.7", d:"Aluminium rod in a horseshoe field is pushed sideways. Reverse I or B, reverse the push. Largest when I is perpendicular to B."},
      flem: {t:"Fleming’s left-hand rule", d:"First finger magnetic field, second finger current, thumb force. Motors and meters use this; this reprint does not build a motor."},
      ex2: {t:"Example 12.2", d:"Electron at right angles to B. Current is opposite v_e, so the force is into the page (d)."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["act","Activity 12.7"],["flem","Fleming left"],["ex2","Example 12.2"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.force = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, st = {preset: "mains"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Live red, neutral black, earth green. 220 V. 2 kW oven on 5 A draws ~9.1 A.");
    L.legend([["#ef4444","live"],["#22c55e","earth"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      mains: {t:"Three wires", d:"Live red, neutral black, 220 V between them. Earth green to a plate in the ground. 15 A for geysers; 5 A for lamps."},
      fuse: {t:"Short-circuit and fuse", d:"Live touching neutral: current increases heavily (Q2). The fuse melts. Too many gadgets on one socket is overload too."},
      oven: {t:"2 kW on 5 A", d:"I = 2000/220 ≈ 9.1 A, above a 5 A rating. The fuse should blow. Earth the metal body so a leak is not a shock."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300); L.readout([["Idea", r.t], ["Point", r.d]]); L.verdict("<b>"+r.t+"</b> "+r.d);
  }
  function mount(){
    L.presets([["mains","mains colours"],["fuse","fuse"],["oven","2 kW oven"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.home = {mount: mount, draw: draw, select: select, state: st};
})();
