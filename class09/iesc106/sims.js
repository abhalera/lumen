// Class 9 Science, Chapter 6 (iesc106) — simulation labs.
// Textbook numbers (Examples 6.1–6.8, Activities 6.1–6.7, exercises) are used where given; other values are labelled illustrative.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

function box6(L, x, y, w, h, label, fill){ return L.rect(x - w / 2, y - h / 2, w, h, fill || "#334155", ' rx="6" stroke="#e2e8f0" stroke-width="2"') + L.text(x, y + 5, label, {size: 14, color: "#f8fafc", weight: 700}); }

// Lab 1 — Net force: Example 6.1 and tug of war
(function(){
  var L = LAB, C = L.C;
  var CFG = {
    a: {forces: [10, 6], name: "Example 6.1 (a)"},
    b: {forces: [10, -6], name: "Example 6.1 (b)"},
    c: {forces: [-10, 6], name: "Example 6.1 (c)"},
    tug: {forces: [300, -300], name: "Tug of war, equal pulls"}
  };
  var st = {preset: "a"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 4, step: 1, speed: 1});
    L.legend([[C.vel, "individual forces"], [C.path, "net force"]]);
    L.watch(CFG[id].name + ": each arrow's length shows its size. The block (or rope) moves only if the net force is not zero. Motion is illustrative.");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var c = CFG[st.preset], net = c.forces[0] + c.forces[1], scale = st.preset === "tug" ? 0.35 : 9;
    var shift = Math.max(-200, Math.min(200, 12 * Math.sign(net) * Math.min(t, 4) * Math.min(t, 4) * (Math.abs(net) > 0 ? 1 : 0)));
    var x = 360 + shift, m = "";
    m += L.line(60, 200, 660, 200, C.faint, 3);
    m += box6(L, x, 170, 80, 60, st.preset === "tug" ? "rope" : "block");
    c.forces.forEach(function(f, i){
      var y = 140 + i * 30, len = Math.abs(f) * scale, dir = Math.sign(f);
      var start = dir > 0 ? x - 40 - len : x + 40 + len, end = dir > 0 ? x - 42 : x + 42;
      m += L.arrow(start, y - 50, end, y - 50, C.vel, 4) + L.text((start + end) / 2, y - 58, Math.abs(f) + " N", {size: 13, color: C.vel});
    });
    if(net !== 0){ m += L.arrow(x, 250, x + Math.sign(net) * Math.abs(net) * scale, 250, C.path, 6) + L.text(x + Math.sign(net) * Math.abs(net) * scale / 2, 275, "net " + Math.abs(net) + " N", {size: 14, color: C.path, weight: 700}); }
    else m += L.text(x, 265, "net force = 0 (balanced)", {size: 15, color: C.path, weight: 700});
    L.svg(m, c.name + ": net force " + net + " newtons", 300);
    var dirTxt = net > 0 ? "towards the right" : net < 0 ? "towards the left" : "none";
    L.readout([["Forces", c.forces.map(function(f){ return Math.abs(f) + " N " + (f > 0 ? "→" : "←"); }).join(" and ")], ["Net force", Math.abs(net) + " N " + (net ? dirTxt : ""), C.path], ["Motion", net ? "starts moving " + dirTxt : "no change"]]);
    L.verdict(t < 4 ? "Adding the forces…" : st.preset === "tug" ? "<b>Balanced forces:</b> equal pulls in opposite directions give zero net force, so the rope does not move." :
      "<b>" + c.name + ":</b> net force = <b>" + Math.abs(net) + " N " + dirTxt + "</b>" + (st.preset === "a" ? " (same direction: add)." : " (opposite directions: subtract, along the larger force)."));
  }
  function mount(){ L.presets([["a", "Example 6.1 (a)"], ["b", "Example 6.1 (b)"], ["c", "Example 6.1 (c)"], ["tug", "Tug of war"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.netForce = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Activity 6.1: coin stack on different surfaces (sample distances are illustrative)
(function(){
  var L = LAB, C = L.C;
  var U = 1.2;
  var SURF = {wood: {name: "wooden table top", d: 0.30, col: "#a16207"}, laminate: {name: "laminated table top", d: 0.45, col: "#64748b"}, tiles: {name: "polished marble / tiles", d: 0.70, col: "#cbd5e1"}};
  var st = {preset: "wood"};
  function dec(s){ return U * U / (2 * SURF[s].d); }
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: U / dec(id), step: 0.1, speed: 0.5, format: function(t){ return "t = <b>" + L.num(t, 2) + " s</b>"; }});
    L.legend([["#fbbf24", "coin stack"], [C.danger, "force of friction"]]);
    L.watch("Activity 6.1 on a " + SURF[id].name + ". The rubber band launches the coins at the same speed every time (sample values).");
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var a = dec(st.preset), tt = Math.min(t, U / a), v = Math.max(0, U - a * tt), s = U * tt - 0.5 * a * tt * tt, m = "";
    var X = function(d){ return 80 + d * 800; };
    m += L.rect(40, 180, 640, 30, SURF[st.preset].col, ' rx="4"');
    for(var d = 0; d <= 0.7001; d += 0.1) m += L.line(X(d), 210, X(d), 222, C.muted, 2) + L.text(X(d), 240, Math.round(d * 100) + " cm", {size: 12, color: C.muted});
    Object.keys(SURF).forEach(function(k){ m += L.line(X(SURF[k].d), 160, X(SURF[k].d), 180, SURF[k].col, 3) + L.text(X(SURF[k].d), 152, k, {size: 11, color: C.muted}); });
    m += L.rect(X(s) - 14, 150, 28, 30, "#fbbf24", ' rx="4"');
    if(v > 0.01) m += L.arrow(X(s) - 16, 130, X(s) - 16 - 30 * a, 130, C.danger, 4) + L.text(X(s) - 30, 120, "friction", {size: 12, color: C.danger});
    L.svg(m, "Coins on " + SURF[st.preset].name, 280);
    L.readout([["Surface", SURF[st.preset].name], ["Velocity", L.num(v, 2) + " m s⁻¹", "#fbbf24"], ["Distance from C", L.num(s * 100, 1) + " cm"], ["Slowing down by (friction)", L.num(a, 2) + " m s⁻² (illustrative)", C.danger]]);
    L.verdict(v > 0.001 ? "The coins are slowing: only friction acts on them now." :
      st.preset === "tiles" ? "<b>Smallest friction:</b> on polished tiles the velocity fell most slowly and the coins travelled farthest (" + Math.round(SURF.tiles.d * 100) + " cm)." :
      st.preset === "wood" ? "<b>Largest friction:</b> on wood the coins lost velocity fastest and stopped after only " + Math.round(SURF.wood.d * 100) + " cm." :
      "On the laminated top the coins went " + Math.round(SURF.laminate.d * 100) + " cm: less friction than wood, more than tiles.");
  }
  function mount(){ L.presets([["wood", "Wooden table top"], ["laminate", "Laminated top"], ["tiles", "Polished tiles"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.friction = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — First law: frictionless, balanced push, at rest, push removed
(function(){
  var L = LAB, C = L.C;
  var CFG = {
    frictionless: {u: 2, a: 0, text: "Thought experiment: no friction and no push."},
    balanced: {u: 2, a: 0, text: "Example 6.2: the push equals friction."},
    rest: {u: 0, a: 0, text: "Example 6.3: an object at rest with no net force."},
    removed: {u: 2, a: -0.5, text: "For contrast: friction acts and the push is removed."}
  };
  var st = {preset: "frictionless"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 8, step: 1, speed: 1});
    L.legend([[C.vel, "velocity–time graph"], [C.path, "position–time graph"]]);
    L.watch(CFG[id].text + " Watch both graphs. (Values illustrative.)");
    L.controls(""); L.restart(true);
  }
  function state(c, t){ var ts = c.a < 0 ? Math.min(t, c.u / -c.a) : t; return {v: Math.max(0, c.u + c.a * ts), s: c.u * ts + 0.5 * c.a * ts * ts}; }
  function draw(t){
    var c = CFG[st.preset], s = state(c, t), m = "";
    var X = function(p){ return 40 + p * 38; };
    m += L.line(20, 90, 700, 90, C.faint, 3) + L.rect(X(s.s % 17) - 20, 60, 40, 30, "#334155", ' rx="4" stroke="#e2e8f0"');
    if(st.preset === "balanced"){ m += L.arrow(X(s.s % 17) - 70, 75, X(s.s % 17) - 22, 75, C.vel, 3) + L.arrow(X(s.s % 17) + 70, 75, X(s.s % 17) + 22, 75, C.danger, 3); }
    var gv = L.graph({x0: 60, y0: 270, w: 260, h: 130, tmax: 8, vmin: 0, vmax: 3, tStep: 2, vStep: 1, tLabel: "t", vLabel: "velocity"});
    var gp = L.graph({x0: 420, y0: 270, w: 260, h: 130, tmax: 8, vmin: 0, vmax: 18, tStep: 2, vStep: 6, tLabel: "t", vLabel: "position"});
    m += gv.svg + gp.svg;
    var ptsV = [], ptsP = [];
    for(var k = 0; k <= 40; k++){ var tk = t * k / 40, sk = state(c, tk); ptsV.push([tk, sk.v]); ptsP.push([tk, sk.s]); }
    m += L.polyline(gv, ptsV, C.vel, 3) + L.polyline(gp, ptsP, C.path, 3);
    L.svg(m, "Velocity " + L.num(s.v, 1), 300);
    var net = c.a !== 0 ? "not zero (friction)" : "zero";
    L.readout([["Net force", net, net === "zero" ? C.ok : C.danger], ["Velocity", L.num(s.v, 2) + " m s⁻¹", C.vel], ["Position", L.num(s.s, 1) + " m", C.path]]);
    L.verdict(t < 8 ? "Watching the motion…" : st.preset === "removed" ? "With friction and no push, the net force is not zero: the velocity decreases to zero." :
      st.preset === "rest" ? "<b>At rest stays at rest:</b> zero net force, zero velocity: position–time graph horizontal, velocity–time graph on the time axis." :
      "<b>Newton's first law:</b> with zero net force the object keeps moving with <b>constant velocity</b>: a horizontal velocity–time graph and a straight position–time graph.");
  }
  function mount(){ L.presets([["frictionless", "No friction, no push"], ["balanced", "Example 6.2: push = friction"], ["rest", "At rest"], ["removed", "Push removed (with friction)"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.firstLaw = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Second law: Activities 6.3–6.4 and F = ma
(function(){
  var L = LAB, C = L.C;
  var TABLE = 1.0, G = 9.8;
  var st = {preset: "act63", F: 2, m: 1};
  function runs(){
    // Simplified as in the textbook analysis: constant pull F on the cart; cup mass and friction ignored.
    if(st.preset === "act63") return [{F: 0.05 * G, M: 0.5, label: "cup 50 g"}, {F: 0.10 * G, M: 0.5, label: "cup 100 g (doubled)"}];
    if(st.preset === "act64") return [{F: 0.05 * G, M: 0.5, label: "cart 500 g"}, {F: 0.05 * G, M: 1.0, label: "cart 1000 g (doubled)"}];
    return [{F: st.F, M: st.m, label: "F = " + st.F + " N, m = " + st.m + " kg"}];
  }
  function retime(){ var a = st.F / st.m; L.timeline({maxT: Math.sqrt(2 * TABLE / a), step: 0.1, speed: 0.6, format: function(t){ return "t = <b>" + L.num(t, 2) + " s</b>"; }}); App.resetTimeline(); App.play(); }
  function select(id){
    st.preset = id; L.markPreset(id);
    var rs = runs(), tmax = Math.max.apply(null, rs.map(function(r){ return Math.sqrt(2 * TABLE / (r.F / r.M)); }));
    L.timeline({maxT: tmax, step: 0.1, speed: 0.6, format: function(t){ return "t = <b>" + L.num(t, 2) + " s</b>"; }});
    L.legend([[C.vel, "run 1"], [C.path, "run 2"]]);
    L.watch(id === "act63" ? "Activity 6.3: the same cart, pulled by a cup of 50 g, then 100 g, over a 1.0 m table (ignoring friction and the cup's own mass)." : id === "act64" ? "Activity 6.4: the same cup, pulling a 500 g cart, then a 1000 g cart." : "Choose any force and mass: a = F ÷ m.");
    if(id === "fma"){
      L.controls(L.slider("s4-F", "Net force F", 1, 10, 1, st.F, st.F + " N") + L.slider("s4-m", "Mass m", 0.5, 5, 0.5, st.m, st.m + " kg"));
      L.onInput("s4-F", function(v){ st.F = v; L.setVal("s4-F", v + " N"); retime(); });
      L.onInput("s4-m", function(v){ st.m = v; L.setVal("s4-m", v + " kg"); retime(); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var rs = runs(), m = "", X = function(d){ return 60 + d * 560; };
    rs.forEach(function(r, i){
      var a = r.F / r.M, T = Math.sqrt(2 * TABLE / a), s = Math.min(TABLE, 0.5 * a * t * t), y = 90 + i * 110, col = i ? C.path : C.vel;
      m += L.rect(40, y + 20, 600, 8, "#475569") + L.rect(X(s) - 30, y - 10, 60, 30, "#1e293b", ' rx="4" stroke="' + col + '" stroke-width="2"') + L.circle(X(s) - 18, y + 22, 6, "#94a3b8") + L.circle(X(s) + 18, y + 22, 6, "#94a3b8");
      m += L.text(40, y - 20, r.label + ": a = " + L.num(a, 2) + " m s⁻²" + (t >= T - 1e-6 ? ", T = " + L.num(T, 2) + " s" : ""), {size: 13, color: col, anchor: "start"});
    });
    L.svg(m, "Carts accelerating", 280);
    var a1 = rs[0].F / rs[0].M, cells = [["Run 1 acceleration", L.num(a1, 2) + " m s⁻²", C.vel]];
    if(rs[1]){ var a2 = rs[1].F / rs[1].M, T1 = Math.sqrt(2 / a1), T2 = Math.sqrt(2 / a2); cells.push(["Run 2 acceleration", L.num(a2, 2) + " m s⁻²", C.path], ["a₂ ÷ a₁ = T₁² ÷ T₂²", L.num(a2 / a1, 2)]); }
    L.readout(cells);
    var done = t >= App.state.maxT - 1e-6;
    L.verdict(!done ? "Carts moving…" : st.preset === "act63" ? "<b>Activity 6.3:</b> doubling the force on the same cart <b>doubled the acceleration</b> (a₂ ÷ a₁ = 2). A real cart gives a little less because of friction." :
      st.preset === "act64" ? "<b>Activity 6.4:</b> doubling the mass with the same force <b>halved the acceleration</b>." :
      "<b>F = ma:</b> a = " + st.F + " N ÷ " + st.m + " kg = " + L.num(st.F / st.m, 2) + " m s⁻².");
  }
  function mount(){ L.presets([["act63", "Activity 6.3: double the force"], ["act64", "Activity 6.4: double the mass"], ["fma", "Try F and m"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.secondLaw = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Stopping force, Example 6.6 and Example 6.5
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "catch"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "car" ? 15 : id === "push" ? 2 : 1, step: id === "car" ? 1 : 0.1, speed: id === "car" ? 2 : id === "push" ? 1 : 0.5});
    L.legend(id === "catch" ? [[C.danger, "stiff hands (0.01 s)"], [C.ok, "hands pulled back (0.1 s)"]] : id === "car" ? [[C.vel, "velocity (Fig. 6.21)"], [C.path, "force on the car"]] : [[C.vel, "applied force"], [C.danger, "friction"]]);
    L.watch({catch: "A 0.16 kg ball at 30 m s⁻¹ is stopped in 0.01 s and in 0.1 s (illustrative values).", car: "Example 6.6: a 1500 kg sports car's velocity–time graph and the force in each interval.", push: "Example 6.5: a 25 kg block with maximum friction 50 N, pushed with 55 N for 2 s."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "catch"){
      [[0.01, C.danger, 90], [0.1, C.ok, 200]].forEach(function(r){
        var f = Math.min(1, t / 1), stopT = r[0], F = 0.16 * 30 / stopT;
        m += L.text(40, r[2] - 30, "stops in " + stopT + " s → force " + L.num(F, 0) + " N", {size: 14, color: r[1], anchor: "start", weight: 700});
        m += L.rect(40, r[2] - 10, Math.min(600, F * 1.2 * f), 24, r[1], ' rx="4"');
      });
      L.svg(m, "Stopping forces", 260);
      L.readout([["Change in velocity", "30 m s⁻¹ → 0"], ["Stiff hands", "480 N", C.danger], ["Hands pulled back", "48 N", C.ok]]);
      msg = t < 1 ? "Comparing…" : "<b>Longer stopping time, smaller force:</b> taking 10 times longer makes the force <b>10 times smaller</b> (480 N vs 48 N).";
    } else if(st.preset === "car"){
      var pts = [[0, 0], [5, 10], [10, 10], [15, 0]];
      var g = L.graph({x0: 70, y0: 250, w: 560, h: 190, tmax: 15, vmin: 0, vmax: 12.5, tStep: 5, vStep: 2.5, tLabel: "Time (s)", vLabel: "Velocity (m s⁻¹)", vFmt: function(v){ return L.num(v, 1); }});
      m += g.svg + L.polyline(g, pts, C.faint, 2, "5 4") + L.polyline(g, pts.filter(function(p){ return p[0] < t; }).concat([[t, L.interp(pts, t)]]), C.vel, 4);
      var F = t < 5 ? 3000 : t < 10 ? 0 : -3000;
      m += L.circle(g.X(t), g.Y(L.interp(pts, t)), 6, C.vel);
      L.svg(m, "Sports car", 290);
      L.readout([["Time", L.num(t, 1) + " s"], ["Velocity", L.num(L.interp(pts, t), 1) + " m s⁻¹", C.vel], ["Force (1500 kg)", F === 0 ? "0 N" : Math.abs(F) + " N " + (F > 0 ? "east" : "west"), C.path]]);
      msg = t < 15 ? "Reading the graph…" : "<b>Example 6.6:</b> 0–5 s: a = 2 m s⁻², F = <b>3000 N</b> east; 5–10 s: constant velocity, F = 0; 10–15 s: a = −2 m s⁻², F = 3000 N west.";
    } else {
      var a = (55 - 50) / 25, s = 0.5 * a * t * t;
      m += L.line(40, 200, 680, 200, C.faint, 3) + L.rect(120 + s * 500 - 40, 140, 80, 60, "#334155", ' rx="4" stroke="#e2e8f0"') + L.text(120 + s * 500, 175, "25 kg", {size: 13, color: "#fff"});
      m += L.arrow(120 + s * 500 - 120, 160, 120 + s * 500 - 42, 160, C.vel, 4) + L.text(120 + s * 500 - 90, 150, "55 N", {size: 13, color: C.vel});
      m += L.arrow(120 + s * 500 + 110, 185, 120 + s * 500 + 42, 185, C.danger, 4) + L.text(120 + s * 500 + 90, 215, "friction 50 N", {size: 13, color: C.danger});
      L.svg(m, "Block pushed", 260);
      L.readout([["Net force", "55 − 50 = 5 N"], ["Acceleration", "5 ÷ 25 = 0.2 m s⁻²"], ["Displacement", L.num(s, 2) + " m", C.path]]);
      msg = t < 2 ? "Pushing…" : "<b>Example 6.5:</b> with 50 N the block stays still (balanced); with 55 N, a = 0.2 m s⁻² and in 2 s it moves <b>0.4 m</b>.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["catch", "Catching a fast ball"], ["car", "Example 6.6: sports car"], ["push", "Example 6.5: pushing a block"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.stopping = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Third law: gun recoil, spring balances, colliding carts, balloon rocket
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "gun"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: id === "springs" ? 6 : 1, step: id === "springs" ? 1 : 0.1, speed: id === "springs" ? 1 : 0.4});
    L.legend([[C.vel, "force on one object"], [C.path, "equal and opposite force on the other"]]);
    L.watch({gun: "Example 6.8: a 2 N force pushes a 0.1 kg bullet forward and a 5 kg gun backward. Distances are shown for a 1 s push (illustrative).", springs: "Activity 6.6: two spring balances hooked together, pulled harder and harder.", carts: "Exercise Q9: a loaded cart (80 kg) meets an empty cart (40 kg); an interaction force of 200 N is illustrative.", balloon: "Activity 6.7: air rushes out of a balloon threaded on a string."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "gun"){
      var sb = 0.5 * 20 * t * t, sg = 0.5 * 0.4 * t * t;
      m += L.rect(300 - sg * 60 - 90, 130, 100, 26, "#475569", ' rx="4"') + L.text(300 - sg * 60 - 40, 180, "gun 5 kg", {size: 13, color: C.muted});
      m += L.circle(320 + Math.min(360, sb * 36), 143, 7, "#fbbf24") + L.text(320 + Math.min(360, sb * 36), 120, "bullet", {size: 13, color: "#fbbf24"});
      m += L.arrow(330, 220, 400, 220, C.vel, 4) + L.text(365, 210, "2 N on bullet", {size: 12, color: C.vel}) + L.arrow(290, 220, 220, 220, C.path, 4) + L.text(255, 245, "2 N on gun", {size: 12, color: C.path});
      L.svg(m, "Gun recoil", 280);
      L.readout([["Force on bullet / gun", "2 N / 2 N"], ["Bullet acceleration", "2 ÷ 0.1 = 20 m s⁻²", C.vel], ["Gun acceleration", "2 ÷ 5 = 0.4 m s⁻²", C.path]]);
      msg = t < 1 ? "Firing…" : "<b>Example 6.8:</b> equal forces, unequal accelerations: bullet <b>20 m s⁻²</b>, gun <b>0.4 m s⁻²</b> (backwards).";
    } else if(st.preset === "springs"){
      var pull = Math.round(Math.min(t, 6)) * 5;
      [[180, "balance 1 (fixed end)"], [460, "balance 2 (your hand)"]].forEach(function(b){
        m += L.rect(b[0] - 80, 120, 160, 50, "#1e293b", ' rx="8" stroke="#94a3b8"') + L.text(b[0], 152, pull + " N", {size: 22, color: C.path, weight: 700, mono: true}) + L.text(b[0], 195, b[1], {size: 12, color: C.muted});
      });
      m += L.line(260, 145, 380, 145, "#cbd5e1", 3) + L.rect(40, 120, 60, 50, "#475569");
      L.svg(m, "Spring balances reading " + pull + " newtons", 240);
      L.readout([["Balance 1 reading", pull + " N", C.path], ["Balance 2 reading", pull + " N", C.path]]);
      msg = t < 6 ? "Pulling harder…" : "<b>Activity 6.6:</b> both balances always show the <b>same reading</b>: the forces they exert on each other are equal and opposite.";
    } else if(st.preset === "carts"){
      var F = 200, aL = F / 80, aE = F / 40, dl = 0.5 * aL * t * t, de = 0.5 * aE * t * t;
      m += L.rect(300 - dl * 60 - 110, 120, 100, 50, "#16a34a", ' rx="6"') + L.text(300 - dl * 60 - 60, 150, "loaded", {size: 13, color: "#fff"}) + L.rect(320 + de * 60, 120, 100, 50, "#64748b", ' rx="6"') + L.text(370 + de * 60, 150, "empty", {size: 13, color: "#fff"});
      m += L.arrow(310, 210, 240, 210, C.path, 4) + L.arrow(330, 210, 400, 210, C.vel, 4) + L.text(360, 240, "200 N each, opposite", {size: 13, color: C.text});
      L.svg(m, "Carts pushing apart", 260);
      L.readout([["Force on each cart", "200 N (equal)"], ["Loaded cart acceleration", L.num(aL, 1) + " m s⁻²", C.path], ["Empty cart acceleration", L.num(aE, 1) + " m s⁻²", C.vel]]);
      msg = t < 1 ? "Colliding…" : "<b>Exercise Q9:</b> the carts exert <b>equal</b> forces on each other; the lighter empty cart simply accelerates twice as much.";
    } else {
      var sBal = 0.5 * 3 * t * t;
      m += L.line(40, 120, 680, 120, "#cbd5e1", 2) + '<ellipse cx="' + (500 - sBal * 150) + '" cy="150" rx="50" ry="32" fill="#ef4444"/>' + L.rect(480 - sBal * 150, 116, 40, 8, "#fde68a");
      for(var i = 0; i < 6 && t > 0; i++) m += L.circle(560 - sBal * 150 + i * 18 + (t * 60 % 18), 150 + (i % 2 ? 8 : -8), 3, "#cbd5e1");
      m += L.arrow(470 - sBal * 150, 210, 400 - sBal * 150, 210, C.vel, 4) + L.text(435 - sBal * 150, 235, "balloon pushed", {size: 12, color: C.vel}) + L.arrow(560 - sBal * 150, 210, 630 - sBal * 150, 210, C.path, 4) + L.text(595 - sBal * 150, 235, "air pushed out", {size: 12, color: C.path});
      L.svg(m, "Balloon rocket", 260);
      L.readout([["Air rushes", "towards the right", C.path], ["Balloon moves", "towards the left", C.vel]]);
      msg = t < 1 ? "Air rushing out…" : "<b>Activity 6.7:</b> the balloon pushes air out one way and the air pushes the balloon the <b>opposite</b> way. Rockets work the same way.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["gun", "Example 6.8: gun and bullet"], ["springs", "Activity 6.6: spring balances"], ["carts", "Exercise Q9: two carts"], ["balloon", "Activity 6.7: balloon rocket"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.thirdLaw = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — System of objects (Eq. 6.4) and Exercise Q15
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "boxes", F: 30, m1: 2, m2: 4};
  function select(id){
    st.preset = id; L.markPreset(id);
    if(id === "boxes"){ st.F = 30; st.m1 = 2; st.m2 = 4; } else { st.F = 18; st.m1 = 3; st.m2 = 6; }
    L.timeline({maxT: 2, step: 0.2, speed: 0.6, format: function(t){ return "t = <b>" + L.num(t, 1) + " s</b>"; }});
    L.legend([[C.path, "external force F"], [C.vel, "tension (internal)"]]);
    L.watch(id === "boxes" ? "Two boxes (2 kg and 4 kg) joined by a string on a frictionless floor, pulled by F = 30 N." : "Exercise Q15 with sample numbers: F = 18 N gives the harrow (3 kg) 6 m s⁻² and the trolley (6 kg) 3 m s⁻². Now pull both together.");
    L.controls(L.slider("s7-F", "Force F", 6, 60, 6, st.F, st.F + " N") + L.slider("s7-m1", "m₁", 1, 10, 1, st.m1, st.m1 + " kg") + L.slider("s7-m2", "m₂", 1, 10, 1, st.m2, st.m2 + " kg"));
    L.onInput("s7-F", function(v){ st.F = v; L.setVal("s7-F", v + " N"); App.seekTimeline(App.state.maxT); });
    L.onInput("s7-m1", function(v){ st.m1 = v; L.setVal("s7-m1", v + " kg"); App.seekTimeline(App.state.maxT); });
    L.onInput("s7-m2", function(v){ st.m2 = v; L.setVal("s7-m2", v + " kg"); App.seekTimeline(App.state.maxT); });
    L.restart(true);
  }
  function draw(t){
    var a = st.F / (st.m1 + st.m2), s = 0.5 * a * t * t, x = 180 + Math.min(300, s * 6), m = "";
    m += L.line(20, 200, 700, 200, C.faint, 3);
    m += box6(L, x, 170, 90, 60, (st.preset === "q15" ? "trolley " : "Box 2 ") + st.m2 + " kg") + L.line(x + 45, 170, x + 115, 170, "#cbd5e1", 3) + box6(L, x + 160, 170, 90, 60, (st.preset === "q15" ? "harrow " : "Box 1 ") + st.m1 + " kg");
    m += L.arrow(x + 205, 170, x + 285, 170, C.path, 5) + L.text(x + 245, 155, "F = " + st.F + " N", {size: 14, color: C.path, weight: 700});
    m += L.arrow(x + 112, 140, x + 60, 140, C.vel, 2) + L.arrow(x + 48, 140, x + 100, 140, C.vel, 2) + L.text(x + 80, 128, "T (internal)", {size: 11, color: C.vel});
    L.svg(m, "System acceleration " + L.num(a, 2), 260);
    var cells = [["System mass", (st.m1 + st.m2) + " kg"], ["a = F ÷ (m₁ + m₂)", st.F + " ÷ " + (st.m1 + st.m2) + " = " + L.num(a, 2) + " m s⁻²", C.path]];
    if(st.preset === "q15") cells.push(["a₁a₂ ÷ (a₁ + a₂)", L.num(st.F / st.m1, 1) + " × " + L.num(st.F / st.m2, 1) + " ÷ (" + L.num(st.F / st.m1, 1) + " + " + L.num(st.F / st.m2, 1) + ") = " + L.num(a, 2) + " m s⁻²"]);
    L.readout(cells);
    var book = st.preset === "boxes" ? (st.F === 30 && st.m1 === 2 && st.m2 === 4) : (st.F === 18 && st.m1 === 3 && st.m2 === 6);
    L.verdict(t < 2 ? "Pulling…" : !book ? "System acceleration = " + L.num(a, 2) + " m s⁻²." : st.preset === "boxes" ? "<b>Eq. 6.4:</b> treating both boxes as one system, a = 30 N ÷ 6 kg = <b>5 m s⁻²</b>; the tension is internal and does not appear." :
      "<b>Exercise Q15:</b> a = 18 N ÷ 9 kg = <b>2 m s⁻²</b>, the same as a₁a₂ ÷ (a₁ + a₂) = 18 ÷ 9 = 2 m s⁻².");
  }
  function mount(){ L.presets([["boxes", "Two boxes (Eq. 6.4)"], ["q15", "Exercise Q15: harrow + trolley"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.system = {mount: mount, draw: draw, select: select, state: st};
})();
