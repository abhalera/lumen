// Class 10 Science, Chapter 6 (jesc106) — simulation labs.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

(function(){
  var L = LAB, C = L.C, st = {preset: "dendrite"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Fig. 6.1: information is acquired at the dendrite, travels as an electrical impulse along the axon, and becomes a chemical signal at the synapse.");
    L.legend([["#38bdf8","electrical"],["#f59e0b","chemical / synapse"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      dendrite: {t:"Dendrite — information acquired", d:"Specialised tips of nerve cells (receptors) sit in sense organs. Gustatory receptors detect taste; olfactory receptors detect smell."},
      axon: {t:"Axon — electrical impulse", d:"A chemical reaction at the dendritic tip creates an electrical impulse. It travels dendrite → cell body → axon."},
      synapse: {t:"Synapse — chemical signal", d:"At the axon ending, chemicals cross the gap (synapse) and start an impulse in the next neuron, muscle or gland."}
    };
    var r = map[st.preset];
    var m = L.circle(80, 150, 28, "#38bdf8") + L.text(80, 200, "cell body", {size: 12});
    m += L.line(108, 150, 420, 150, "#38bdf8", 4) + L.text(260, 130, "axon", {size: 13});
    m += L.circle(40, 90, 8, "#a78bfa") + L.line(48, 98, 62, 130, "#a78bfa", 2);
    m += L.circle(30, 150, 8, "#a78bfa") + L.line(38, 150, 52, 150, "#a78bfa", 2);
    m += L.text(50, 70, "dendrites", {size: 12});
    m += L.circle(470, 150, 10, "#f59e0b") + L.text(560, 150, "synapse", {size: 13, color: "#f59e0b"});
    m += L.text(360, 240, r.t, {size: 16, weight: 700});
    L.svg(m, r.t, 300);
    L.readout([["Part", r.t], ["Job", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d + " Exercise Q2: the gap is a synapse.");
  }
  function mount(){
    L.presets([["dendrite","dendrite acquires"],["axon","axon impulse"],["synapse","synapse chemicals"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.neuron = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "arc"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Thinking is too slow for a flame. A reflex arc in the spinal cord is the first meeting of input and output nerves. The brain is still informed.");
    L.legend([["#ef4444","danger / input"],["#22c55e","motor output"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      arc: {t:"Reflex arc in the spinal cord", d:"Receptor → sensory neuron → spinal cord → motor neuron → muscle. Faster than thinking. Fig. 6.2."},
      walking: {t:"Walking is voluntary", d:"Walking is not a spinal-only arc. The brain decides; the cerebellum later keeps posture and balance."},
      injury: {t:"Spinal cord injury (Q7)", d:"Signals between body and brain are cut, and reflex arcs in the cord itself are disrupted."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Path", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["arc","reflex arc"],["walking","walking vs reflex"],["injury","spinal injury / Q7"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.reflex = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "fore"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 3, step: 0.25, speed: 0.5});
    L.watch("Exercise Q3: the brain is responsible for thinking, regulating the heart beat, and balancing the body — all of the above.");
    L.legend([["#a78bfa","fore-brain"],["#f59e0b","hind-brain"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      fore: {t:"Fore-brain — thinking", d:"Main thinking part. Separate sensory areas (hearing, smell, sight), association, motor areas, hunger/fullness centre."},
      medulla: {t:"Medulla — involuntary", d:"Hind-brain. Blood pressure, salivation and vomiting. We cannot easily control these by thinking."},
      cerebellum: {t:"Cerebellum — balance", d:"Precision of voluntary actions; posture and equilibrium. Walking a line, riding a bicycle, picking up a pencil."},
      protect: {t:"Protection and muscle", d:"Brain: bony box + fluid-filled balloon. Cord: vertebral column. Muscle cells shorten when special proteins change shape."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Region", r.t], ["Job", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d + " Q3: all of the above.");
  }
  function mount(){
    L.presets([["fore","fore-brain"],["medulla","medulla"],["cerebellum","cerebellum"],["protect","box, balloon, muscle"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.brain = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "mimosa"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Plants: no nerves, no muscles. Mimosa folds by changing water in cells. Tropisms are directional growth (Activity 6.2).");
    L.legend([["#22c55e","shoot / light"],["#38bdf8","root / gravity"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      mimosa: {t:"Sensitive plant (no growth)", d:"Chhui-mui / touch-me-not. Information travels; cells swell or shrink by changing water. Independent of growth."},
      light: {t:"Phototropism (Activity 6.2)", d:"Shoots bend towards light and roots away from light. New growth re-aims if you turn the flask."},
      geo: {t:"Geotropism (Fig. 6.6)", d:"Shoots grow up and roots down in response to gravity. Chemotropism: pollen tubes towards ovules."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Movement", r.t], ["How", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["mimosa","sensitive plant"],["light","Activity 6.2 light"],["geo","geotropism"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.tropism = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "auxin"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Auxin from the shoot tip accumulates on the shady side; those cells elongate; the shoot bends towards light. Cytokinin is the plant hormone in Q1.");
    L.legend([["#eab308","auxin"],["#ef4444","inhibitor"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      auxin: {t:"Auxin and phototropism", d:"Made at the shoot tip. One-sided light: auxin diffuses to the shady side, which elongates. Tendrils: contact side grows more slowly."},
      cyto: {t:"Cytokinin (Q1)", d:"Promotes cell division; higher in fruits and seeds. Exercise Q1 (d): cytokinin is the plant hormone, not insulin/thyroxin/oestrogen."},
      aba: {t:"Abscisic acid", d:"Inhibits growth. Effects include wilting of leaves. Gibberellins, like auxins, help stem growth."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Hormone", r.t], ["Role", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["auxin","auxin / shade"],["cyto","cytokinin / Q1"],["aba","abscisic acid"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.auxin = {mount: mount, draw: draw, select: select, state: st};
})();

(function(){
  var L = LAB, C = L.C, st = {preset: "adrenaline"};
  function select(id){
    st.preset = id; L.markPreset(id); L.timeline({maxT: 4, step: 0.2, speed: 0.6});
    L.watch("Adrenaline readies fight or flight. Iodine → thyroxin (else goitre). Insulin from pancreas: feedback on blood sugar. No dosage advice.");
    L.legend([["#ef4444","adrenaline"],["#38bdf8","thyroxin / insulin"]]); L.controls(""); L.restart(true);
  }
  function draw(){
    var map = {
      adrenaline: {t:"Adrenaline (adrenal gland)", d:"Heart faster, more oxygen to muscles. Blood diverted from digestive system and skin. Breathing rate increases."},
      thyroid: {t:"Thyroxin and iodised salt", d:"Iodine is needed to make thyroxin. Thyroxin regulates carbohydrate, protein and fat metabolism. Lack → goitre (swollen neck)."},
      insulin: {t:"Insulin feedback", d:"Pancreas. High sugar → more insulin; sugar falls → less insulin. Some diabetes patients need insulin injections (doctor’s domain)."},
      table: {t:"Table 6.1 blanks (Activity 6.4)", d:"(2) Thyroxin (3) Pancreas (5) Oestrogen (7) Hypothalamus. Growth hormone: pituitary; childhood lack → dwarfism."}
    };
    var r = map[st.preset];
    var m = L.text(360, 80, r.t, {size: 18, weight: 700}) + L.text(360, 160, r.d, {size: 15});
    L.svg(m, r.t, 300);
    L.readout([["Topic", r.t], ["Point", r.d]]);
    L.verdict("<b>" + r.t + "</b> " + r.d);
  }
  function mount(){
    L.presets([["adrenaline","adrenaline"],["thyroid","thyroxin / goitre"],["insulin","insulin feedback"],["table","Table 6.1"]], st.preset, select);
    select(st.preset); App.pause(); App.resetTimeline();
  }
  window.SIMS.hormone = {mount: mount, draw: draw, select: select, state: st};
})();
