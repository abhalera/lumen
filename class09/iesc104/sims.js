// Class 9 Science, Chapter 4 (iesc104) — simulation labs.
// Every scenario uses the numbers from the NCERT textbook unless its label says otherwise.
var App = window.App;
var LAB = window.LAB;
window.SIMS = {};

// -------------------------------------------------------------------------
// Lab 1 — Distance and displacement on a straight track (Fig. 4.4, Pause & Ponder Q1, Activity 4.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fig44", turnAt: 100, stopAt: 40};

  var TRIPS = {
    // NCERT Fig. 4.4: O at 0 s, B (40 m) at 4 s, A (100 m) at 10 s, back to B at 16 s.
    fig44: {pts: [[0, 0], [10, 100], [16, 40]], stamps: [[0, 0], [4, 40], [10, 100], [16, 40]],
      labels: [[0, "O"], [40, "B"], [100, "A"]]},
    // Pause & Ponder Q1: out to A and all the way back to O.
    ponder1: {pts: [[0, 0], [10, 100], [20, 0]], stamps: [[0, 0], [10, 100], [20, 0]], labels: [[0, "O"], [100, "A"]]}
  };

  function customTrip(){
    var a = st.turnAt, b = st.stopAt, t1 = a / 10;
    var pts = [[0, 0], [t1, a]];
    if(b !== a) pts.push([t1 + Math.abs(a - b) / 10, b]);
    var labels = [[0, "O"], [a, "A"]];
    if(b !== a && b !== 0) labels.push([b, "B"]);
    return {pts: pts, stamps: pts.slice(), labels: labels};
  }

  function trip(){ return st.preset === "custom" ? customTrip() : TRIPS[st.preset]; }

  // Toss (Activity 4.1): thrown up from O to B = 140 cm, falls back to O. g = 9.8 m s⁻².
  var G = 9.8, H = 1.4, U0 = Math.sqrt(2 * G * H), TUP = U0 / G, TTOT = 2 * TUP;
  function heightAt(t){ return Math.max(0, U0 * t - 0.5 * G * t * t) * 100; }
  function timeUpAt(hcm){ var h = hcm / 100; return (U0 - Math.sqrt(U0 * U0 - 2 * G * h)) / G; }
  function timeDownAt(hcm){ var h = hcm / 100; return (U0 + Math.sqrt(U0 * U0 - 2 * G * h)) / G; }
  var TOSS_ROWS = [
    ["O", 0, 0, 0],
    ["A", timeUpAt(40), 40, 40],
    ["B", TUP, 140, 140],
    ["C", timeDownAt(80), 200, 80],
    ["O", TTOT, 280, 0]
  ];

  function select(id){
    st.preset = id;
    L.markPreset(id);
    if(id === "toss"){
      L.timeline({maxT: TTOT, step: 0.05, speed: 0.25, format: function(t){ return "t = <b>" + L.num(t, 2) + " s</b>"; }});
      L.legend([[C.path, "path travelled (distance)"], [C.disp, "displacement from O (upward +)"]]);
      L.watch("Activity 4.1 in slow motion. The table fills in as the ball passes O, A, B, C and returns to O. Two lines are drawn only for clarity; the ball really goes up and down the same line.");
    } else {
      var tr = trip();
      L.timeline({maxT: tr.pts[tr.pts.length - 1][0], step: 1, speed: 2});
      L.legend([[C.path, "path travelled (distance)"], [C.disp, "displacement from O"], ["#f8fafc", "athlete"]]);
      if(id === "fig44") L.watch("NCERT Fig. 4.4. The athlete passes B at 4 s, reaches A at 10 s, and is back at B at 16 s. Compare the amber path with the violet arrow.");
      else if(id === "ponder1") L.watch("Pause & Ponder Q1: the athlete runs to A and all the way back to O. When is the displacement zero?");
      else L.watch("Your own trip at 10 m s⁻¹. Set where the athlete turns (A) and stops (B). Try stopping to the left of O.");
    }
    if(id === "custom") renderControls(); else L.controls("");
    L.restart(id !== "custom");
  }

  function renderControls(){
    L.controls(
      L.slider("c1-turn", "Make your own trip: turn back at A", 20, 100, 10, st.turnAt, st.turnAt + " m") +
      L.slider("c1-stop", "…and stop at B", -40, 100, 10, st.stopAt, L.signed(st.stopAt, 0) + " m")
    );
    L.onInput("c1-turn", function(v){ st.turnAt = v; L.setVal("c1-turn", v + " m"); if(st.stopAt > v) { st.stopAt = v; var s = L.$("c1-stop"); if(s) s.value = v; L.setVal("c1-stop", L.signed(v, 0) + " m"); } goCustom(); });
    L.onInput("c1-stop", function(v){ if(v > st.turnAt){ v = st.turnAt; L.$("c1-stop").value = v; } st.stopAt = v; L.setVal("c1-stop", L.signed(v, 0) + " m"); goCustom(); });
  }
  function goCustom(){
    st.preset = "custom";
    L.markPreset("custom");
    var tr = customTrip();
    L.timeline({maxT: tr.pts[tr.pts.length - 1][0], step: 1, speed: 2});
    L.watch("Your own trip at 10 m s⁻¹: turn back at A = " + st.turnAt + " m, stop at B = " + L.signed(st.stopAt, 0) + " m. Press Play.");
    App.resetTimeline();
  }

  function distanceAt(pts, t){
    var d = 0;
    for(var i = 1; i < pts.length; i++){
      var a = pts[i - 1], b = pts[i];
      if(t >= b[0]) d += Math.abs(b[1] - a[1]);
      else { if(t > a[0]) d += Math.abs(b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); break; }
    }
    return d;
  }

  function drawTrack(t){
    var tr = trip(), pts = tr.pts, end = pts[pts.length - 1][0];
    var x = L.interp(pts, t), dist = distanceAt(pts, t), disp = x;
    var X = function(p){ return 80 + (p + 40) * (560 / 140); };
    var m = "";
    // Track and scale
    m += L.rect(40, 186, 640, 12, "#1e293b", ' rx="6"');
    for(var p = -40; p <= 100; p += 20){
      m += L.line(X(p), 180, X(p), 204, C.faint, 2);
      m += L.text(X(p), 226, (p > 0 ? "+" : p < 0 ? "−" : "") + Math.abs(p) + " m", {size: 14, color: C.muted});
    }
    m += L.text(X(-40) - 30, 196, "−", {size: 18, color: C.muted}) + L.text(X(100) + 30, 197, "+", {size: 18, color: C.muted});
    // Named points
    tr.labels.forEach(function(lb){
      m += L.circle(X(lb[0]), 192, 6, lb[1] === "O" ? C.vel : "#f8fafc");
      m += L.text(X(lb[0]), 252, lb[1], {size: 16, weight: 700, color: lb[1] === "O" ? C.vel : "#f8fafc"});
    });
    // Path legs: one amber line per leg, stacked, drawn only as far as travelled.
    for(var i = 1; i < pts.length; i++){
      var a = pts[i - 1], b = pts[i];
      if(t <= a[0]) break;
      var f = Math.min(1, (t - a[0]) / (b[0] - a[0]));
      var xe = a[1] + (b[1] - a[1]) * f, y = 90 + (i - 1) * 34;
      m += L.arrow(X(a[1]), y, X(xe), y, C.path, 4);
      m += L.text((X(a[1]) + X(xe)) / 2, y - 9, "leg " + i + ": " + L.num(Math.abs(xe - a[1]), 0) + " m", {size: 14, color: C.path});
    }
    // Displacement arrow
    if(Math.abs(disp) > 0.5){
      m += L.arrow(X(0), 40, X(disp), 40, C.disp, 5);
      m += L.text((X(0) + X(disp)) / 2, 28, "displacement " + L.signed(disp, 0) + " m", {size: 15, color: C.disp, weight: 700});
    } else if(t > 0){
      m += L.text(X(0), 34, "displacement 0 m", {size: 15, color: C.disp, weight: 700});
    }
    // Athlete
    var ax = X(x);
    m += '<g transform="translate(' + ax + ',186)">' + L.circle(0, -34, 7, "#f8fafc") + L.line(0, -27, 0, -12, "#f8fafc", 3) +
      L.line(0, -12, -6, 0, "#f8fafc", 3) + L.line(0, -12, 6, 0, "#f8fafc", 3) + L.line(-7, -22, 7, -20, "#f8fafc", 3) + '</g>';
    // Clock stamps reached so far (like Fig. 4.4)
    var seen = {};
    tr.stamps.forEach(function(s){
      var key = String(s[1]);
      var row = seen[key] || 0;
      seen[key] = row + 1;
      if(t + 1e-6 >= s[0]) m += L.text(X(s[1]), 272 + row * 15, "t = " + L.num(s[0], 0) + " s", {size: 12, color: C.muted});
    });
    L.svg(m, "Athlete at " + L.signed(x, 0) + " m after " + L.num(t, 1) + " s. Distance travelled " + L.num(dist, 0) + " m, displacement " + L.signed(disp, 0) + " m.", 290);

    var equal = Math.abs(dist - Math.abs(disp)) < 0.5;
    L.readout([
      ["Time", L.num(t, 1) + " s"],
      ["Position", L.signed(x, 1) + " m"],
      ["Distance travelled", L.num(dist, 1) + " m", C.path],
      ["Displacement", L.signed(disp, 1) + " m", C.disp],
      ["Distance = |displacement|?", t === 0 ? "—" : (equal ? "yes" : "no")]
    ]);

    var msg;
    if(t <= 0) msg = "Press <b>Play</b>. The athlete starts at the reference point O (position 0 m).";
    else if(t >= end - 1e-6){
      if(st.preset === "fig44") msg = "<b>Fig. 4.4 result:</b> between t = 0 s and t = 16 s, distance = OA + AB = 100 m + 60 m = <b>160 m</b>, but displacement = <b>40 m in the positive direction</b>. They differ because she turned back.";
      else if(st.preset === "ponder1") msg = "<b>Pause & Ponder Q1:</b> the displacement is zero when she is back at O. By then the distance travelled is 100 m + 100 m = <b>200 m</b>.";
      else msg = "<b>Your trip:</b> distance = " + L.num(dist, 0) + " m, displacement = " + L.signed(disp, 0) + " m" + (disp < 0 ? " (negative: she ends to the left of O)." : disp === 0 ? " (back at O)." : ".") + (equal ? " She never turned back, so the two are equal." : " She turned back, so distance &gt; |displacement|.");
    } else if(equal) msg = "Moving in one direction: distance travelled (" + L.num(dist, 0) + " m) equals the magnitude of displacement.";
    else msg = "She has turned back. The distance keeps adding up (" + L.num(dist, 0) + " m) while the displacement shrinks (" + L.signed(disp, 0) + " m): it only compares where she is now with O.";
    L.verdict(msg);
  }

  function drawToss(t){
    var h = heightAt(t), rising = t <= TUP;
    var dist = rising ? h : 140 + (140 - h), disp = h;
    var Y = function(cm){ return 262 - cm * 1.55; };
    var m = "";
    m += L.line(250, Y(0), 250, Y(140) - 12, C.muted, 2);
    for(var cm = 0; cm <= 140; cm += 20){
      m += L.line(244, Y(cm), 256, Y(cm), C.muted, 2);
      m += L.text(236, Y(cm) + 5, cm + " cm", {size: 13, color: C.muted, anchor: "end"});
    }
    // Hand at O
    m += '<path d="M300 ' + (Y(0) + 14) + ' q30 -14 60 0" stroke="#fbbf24" stroke-width="6" fill="none" stroke-linecap="round"/>';
    m += L.text(330, Y(0) + 34, "O (hand)", {size: 13, color: C.muted});
    // Up path and down path (two lines for clarity, as in Fig. 4.5)
    var upTop = rising ? h : 140;
    if(t > 0) m += L.arrow(310, Y(0), 310, Y(upTop), C.path, 4);
    if(!rising) m += L.arrow(350, Y(140), 350, Y(h), C.path, 4);
    m += L.text(298, Y(115), "up", {size: 13, color: C.path, anchor: "end"}) + (rising ? "" : L.text(362, Y(115), "down", {size: 13, color: C.path, anchor: "start"}));
    // Marked positions
    [["A", 40, 310], ["B", 140, 330], ["C", 80, 350]].forEach(function(p){
      m += L.text(p[2] + (p[0] === "B" ? 0 : (p[0] === "A" ? -22 : 22)), Y(p[1]) + 5, p[0], {size: 15, weight: 700, color: "#f8fafc"});
    });
    // Ball
    m += L.circle(rising ? 310 : 350, Y(h), 11, "#fb923c", ' stroke="#fff" stroke-width="2"');
    // Displacement arrow
    if(disp > 1) {
      m += L.arrow(420, Y(0), 420, Y(disp), C.disp, 5);
      m += L.text(432, Y(disp / 2) + 5, "displacement " + L.num(disp, 0) + " cm up", {size: 14, color: C.disp, anchor: "start", weight: 700});
    }
    m += L.text(600, 40, "distance so far", {size: 13, color: C.muted}) + L.text(600, 64, L.num(dist, 0) + " cm", {size: 20, color: C.path, weight: 700, mono: true});
    L.svg(m, "Ball at height " + L.num(h, 0) + " centimetres. Distance travelled " + L.num(dist, 0) + " cm, displacement " + L.num(disp, 0) + " cm upward.", 300);

    var rows = TOSS_ROWS.map(function(r, k){
      var done = t + 1e-4 >= r[1];
      return "<tr" + (done ? "" : ' class="pending"') + "><td>" + (k + 1) + ".</td><td>" + r[0] + "</td><td>" + (done ? r[2] + " cm" : "?") + "</td><td>" +
        (done ? (r[3] === 0 ? "0 cm" : r[3] + " cm upward") : "?") + "</td></tr>";
    }).join("");
    L.readoutHTML('<table class="lab-table"><caption>Table 4.1: distance travelled and displacement of the ball</caption>' +
      '<thead><tr><th>S. No.</th><th>Position</th><th>Total distance from O</th><th>Displacement from O</th></tr></thead><tbody>' + rows + '</tbody></table>');

    var msg;
    if(t <= 0) msg = "Press <b>Play</b> to throw the ball straight up from O.";
    else if(t >= TTOT - 1e-3) msg = "<b>Activity 4.1:</b> back at O the distance is <b>280 cm</b> but the displacement is <b>0 cm</b>. Of the four statements, only <b>(iii)</b> is always true: the magnitude of displacement is less than or equal to the total distance travelled.";
    else if(rising) msg = "Going up without turning back: distance (" + L.num(dist, 0) + " cm) = magnitude of displacement (" + L.num(disp, 0) + " cm).";
    else msg = "Coming down: the distance keeps growing (" + L.num(dist, 0) + " cm) while the displacement from O decreases (" + L.num(disp, 0) + " cm).";
    L.verdict(msg);
  }

  function draw(t){ if(st.preset === "toss") drawToss(t); else drawTrack(t); }

  function mount(){
    L.presets([["fig44", "Fig. 4.4: O → A → B"], ["ponder1", "Pause & Ponder Q1: back to O"], ["toss", "Activity 4.1: ball thrown up"], ["custom", "Your own trip"]], st.preset, select);
    select(st.preset === "custom" ? "custom" : st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.track1d = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 2 — Average speed and average velocity (Example 4.2, Pause & Ponder Q4, Example 4.1)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "sarang"};

  var SARANG = [[0, 0], [25, 25], [50, 0]];          // seconds, metres from the starting end
  var TRIP = [[0, 0], [3, 200], [5, 0]];              // hours, km north of home

  function dist(pts, t){
    var d = 0;
    for(var i = 1; i < pts.length; i++){
      var a = pts[i - 1], b = pts[i];
      if(t >= b[0]) d += Math.abs(b[1] - a[1]);
      else { if(t > a[0]) d += Math.abs(b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); break; }
    }
    return d;
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    if(id === "sarang"){
      L.timeline({maxT: 50, step: 5, speed: 5});
      L.legend([[C.path, "path swum (distance)"], [C.disp, "displacement from the starting end"]]);
      L.watch("NCERT Example 4.2. Sarang swims the 25 m pool and back in 50 s. Watch the last two readouts as he turns at the far end.");
    } else if(id === "trip"){
      L.timeline({maxT: 5, step: 0.25, speed: 0.5, format: function(t){ return "t = <b>" + L.num(t, 2) + " h</b>"; }});
      L.legend([[C.path, "road travelled (distance)"], [C.disp, "displacement from home (north +)"]]);
      L.watch("Pause & Ponder Q4. 200 km north in 3 h, then 200 km south in 2 h. During the first leg the two averages are equal; watch what happens after the turn.");
    } else {
      L.timeline({maxT: 15, step: 1, speed: 1.5, format: function(t){ return "day <b>" + L.num(t, 1) + "</b>"; }});
      L.legend([[C.vel, "first postman (9 yojanas per day)"], [C.path, "second postman (5 yojanas per day)"]]);
      L.watch("Example 4.1 from the Ganitakaumudi. Each day the gap between the postmen shrinks by 9 + 5 = 14 yojanas.");
    }
    L.controls("");
    L.restart(true);
  }

  function averages(d, s, t, unit, dp){
    return [
      ["Average speed so far", t > 0 ? L.num(d / t, dp) + " " + unit : "—", C.path],
      ["Average velocity so far", t > 0 ? L.signed(s / t, dp) + " " + unit : "—", C.disp]
    ];
  }

  function drawSarang(t){
    var x = L.interp(SARANG, t), d = dist(SARANG, t), s = x;
    var X = function(m){ return 110 + m * 20; };
    var mk = "";
    for(var m = 0; m <= 25; m += 5){
      mk += L.line(X(m), 58, X(m), 68, C.muted, 2) + L.text(X(m), 52, m + " m", {size: 13, color: C.muted});
    }
    mk += L.rect(X(0), 72, 500, 130, "#0e4a6b", ' rx="4"');
    [104, 136, 168].forEach(function(y){ mk += L.line(X(0), y, X(25), y, "#7dd3fc", 1.5, "3 6"); });
    mk += L.rect(X(0) - 8, 72, 8, 130, "#cbd5e1") + L.rect(X(25), 72, 8, 130, "#cbd5e1");
    mk += L.text(X(0) - 4, 222, "start", {size: 13, color: C.muted}) + L.text(X(25) + 4, 222, "far end", {size: 13, color: C.muted});
    var goingOut = t <= 25;
    mk += '<g transform="translate(' + X(x) + ',120)">' + L.circle(0, 0, 9, "#fde68a") +
      L.line(goingOut ? -18 : 18, -6, goingOut ? 10 : -10, 6, "#fde68a", 3) + '</g>';
    if(t > 0) mk += L.arrow(X(0), 244, X(Math.min(x, 25) * (goingOut ? 1 : 0) + (goingOut ? 0 : 25)), 244, C.path, 4);
    if(!goingOut) mk += L.arrow(X(25), 266, X(x), 266, C.path, 4);
    if(s > 0.3){
      mk += L.arrow(X(0), 28, X(s), 28, C.disp, 5);
      mk += L.text(X(s) + 8, 33, "displacement " + L.num(s, 1) + " m", {size: 14, color: C.disp, anchor: "start", weight: 700});
    }
    L.svg(mk, "Swimmer " + L.num(x, 1) + " metres from the starting end after " + L.num(t, 0) + " seconds.", 280);

    L.readout([["Time", L.num(t, 1) + " s"], ["Distance swum", L.num(d, 1) + " m", C.path], ["Displacement", L.num(s, 1) + " m", C.disp]].concat(averages(d, s, t, "m s⁻¹", 2)));

    var msg;
    if(t <= 0) msg = "Press <b>Play</b>. Sarang starts at one end of the 25 m pool.";
    else if(t >= 50 - 1e-6) msg = "<b>Example 4.2:</b> average speed = 50 m ÷ 50 s = <b>1 m s⁻¹</b>; he is back where he started, so average velocity = 0 m ÷ 50 s = <b>0 m s⁻¹</b>.";
    else if(goingOut) msg = "Swimming in one direction: distance = displacement, so average speed = average velocity (" + L.num(d / t, 2) + " m s⁻¹).";
    else msg = "He has turned back. The distance keeps growing, but the displacement shrinks, so the average velocity falls below the average speed.";
    L.verdict(msg);
  }

  function drawTrip(t){
    var y = L.interp(TRIP, t), d = dist(TRIP, t), s = y;
    var v = t < 3 ? 200 / 3 : 100;
    var Y = function(km){ return 258 - km * 1.1; };
    var mk = "";
    mk += L.rect(186, Y(200) - 10, 28, 240, "#1e293b", ' rx="6"');
    for(var km = 0; km <= 200; km += 50){
      mk += L.line(172, Y(km), 180, Y(km), C.muted, 2) + L.text(166, Y(km) + 5, km + " km", {size: 13, color: C.muted, anchor: "end"});
    }
    mk += L.text(200, Y(0) + 30, "home", {size: 14, color: C.text, weight: 700});
    mk += L.arrow(60, 110, 60, 50, C.text, 3) + L.text(60, 40, "N", {size: 16, weight: 700});
    // Car
    var north = t < 3;
    mk += '<g transform="translate(200,' + Y(y) + ')">' + L.rect(-10, -16, 20, 32, "#f8fafc", ' rx="5"') +
      L.rect(-7, north ? -12 : 4, 14, 8, "#38bdf8", ' rx="2"') + '</g>';
    // Legs
    if(t > 0) mk += L.arrow(260, Y(0), 260, Y(north ? y : 200), C.path, 4);
    if(!north) mk += L.arrow(290, Y(200), 290, Y(y), C.path, 4);
    mk += L.text(260, Y(0) + 18, "leg 1", {size: 12, color: C.path});
    if(!north) mk += L.text(290, Y(200) - 14, "leg 2", {size: 12, color: C.path});
    if(s > 1){
      mk += L.arrow(340, Y(0), 340, Y(s), C.disp, 5);
      mk += L.text(352, Y(s / 2) + 5, "displacement " + L.num(s, 0) + " km north", {size: 14, color: C.disp, anchor: "start", weight: 700});
    }
    mk += L.text(700, 60, "leg 1: 200 km north in 3 h", {size: 14, color: north ? C.text : C.muted, anchor: "end"});
    mk += L.text(700, 82, "(66.7 km h⁻¹)", {size: 13, color: C.muted, anchor: "end"});
    mk += L.text(700, 116, "leg 2: 200 km south in 2 h", {size: 14, color: north ? C.muted : C.text, anchor: "end"});
    mk += L.text(700, 138, "(100 km h⁻¹)", {size: 13, color: C.muted, anchor: "end"});
    L.svg(mk, "Car " + L.num(y, 0) + " kilometres north of home after " + L.num(t, 2) + " hours.", 300);

    L.readout([["Time", L.num(t, 2) + " h"], ["Distance", L.num(d, 0) + " km", C.path], ["Displacement (north +)", L.signed(s, 0) + " km", C.disp],
      ["Speedometer now", (t >= 5 ? "0" : L.num(v, 1)) + " km h⁻¹"]].concat(averages(d, s, t, "km h⁻¹", 1)));

    var msg;
    if(t <= 0) msg = "Press <b>Play</b> to start the road trip from home.";
    else if(t >= 5 - 1e-6) msg = "<b>Pause & Ponder Q4:</b> average speed = 400 km ÷ 5 h = <b>80 km h⁻¹</b>; displacement = 0, so average velocity = <b>0 km h⁻¹</b>. Note: 80 is not the average of 66.7 and 100, because more time was spent on the slower leg.";
    else if(north) msg = "Moving in one direction (north): average speed and average velocity are equal (" + L.num(d / t, 1) + " km h⁻¹).";
    else msg = "Driving back south: the distance still increases, but the displacement from home decreases. The two averages are no longer equal.";
    L.verdict(msg);
  }

  function drawPostmen(t){
    var p1 = 9 * t, p2 = 210 - 5 * t;
    var X = function(y){ return 60 + y * (600 / 210); };
    var mk = "";
    mk += L.rect(X(0), 144, 600, 12, "#1e293b", ' rx="6"');
    for(var y = 0; y <= 210; y += 30){
      mk += L.line(X(y), 160, X(y), 170, C.muted, 2) + L.text(X(y), 188, String(y), {size: 13, color: C.muted});
    }
    mk += L.text(360, 214, "yojanas from the first postman's starting point", {size: 13, color: C.muted});
    if(t > 0){
      mk += L.rect(X(0), 144, X(p1) - X(0), 12, C.vel, ' rx="6"');
      mk += L.rect(X(p2), 144, X(210) - X(p2), 12, C.path, ' rx="6"');
    }
    mk += L.circle(X(p1), 120, 12, C.vel) + L.text(X(p1), 96, L.num(p1, 0), {size: 14, color: C.vel, weight: 700});
    mk += L.circle(X(p2), 120, 12, C.path) + L.text(X(p2), 96, L.num(210 - p2, 0), {size: 14, color: C.path, weight: 700});
    if(p2 - p1 > 8){
      mk += L.line(X(p1) + 16, 60, X(p2) - 16, 60, C.muted, 1.5, "4 4");
      mk += L.text((X(p1) + X(p2)) / 2, 52, "gap " + L.num(p2 - p1, 0) + " yojanas", {size: 14, color: C.text});
    } else {
      mk += L.text(X(p1), 60, "they meet!", {size: 16, color: C.ok, weight: 700});
    }
    L.svg(mk, "Day " + L.num(t, 1) + ": first postman has walked " + L.num(p1, 0) + " yojanas, second " + L.num(210 - p2, 0) + " yojanas.", 230);

    L.readout([["Day", L.num(t, 1)], ["First postman walked", L.num(p1, 0) + " yojanas", C.vel], ["Second postman walked", L.num(210 - p2, 0) + " yojanas", C.path],
      ["Covered together", L.num(14 * t, 0) + " yojanas"], ["Gap left", L.num(Math.max(0, p2 - p1), 0) + " yojanas"]]);

    L.verdict(t >= 15 - 1e-6
      ? "<b>Example 4.1:</b> together they cover 9 + 5 = 14 yojanas per day, so they meet after 210 ÷ 14 = <b>15 days</b>. The first postman walks 135 yojanas and the second 75 yojanas."
      : (t <= 0 ? "Press <b>Play</b>. The postmen start 210 yojanas apart and walk towards each other." : "Each day the gap shrinks by 14 yojanas."));
  }

  function draw(t){
    if(st.preset === "sarang") drawSarang(t);
    else if(st.preset === "trip") drawTrip(t);
    else drawPostmen(t);
  }

  function mount(){
    L.presets([["sarang", "Example 4.2: Sarang's swim"], ["trip", "Pause & Ponder Q4: road trip"], ["postmen", "Example 4.1: two postmen"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.speedvel = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 3 — Average acceleration (Example 4.3, Example 4.4, Activity 4.2)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "busUp", t100: 10};

  function model(){
    if(st.preset === "busUp") return {u: 10, a: 0.5, T: 10, name: "Example 4.3 (i)"};
    if(st.preset === "busBrake") return {u: 15, a: -3, T: 5, name: "Example 4.3 (ii)"};
    if(st.preset === "drop") return {u: 0, a: 9.8, T: 4, name: "Example 4.4"};
    return {u: 0, a: (100 / 3.6) / st.t100, T: st.t100, name: "Activity 4.2"};
  }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    var m = model();
    L.timeline({maxT: m.T, step: m.T <= 5 ? 0.5 : 1, speed: id === "drop" ? 0.5 : 1});
    L.legend([[C.vel, "velocity"], [C.acc, "acceleration"]]);
    if(id === "busUp") L.watch("Example 4.3 (i): the driver presses the accelerator. The bus goes from 36 km h⁻¹ (10 m s⁻¹) to 54 km h⁻¹ (15 m s⁻¹) in 10 s. Direction of motion is positive.");
    else if(id === "busBrake") L.watch("Example 4.3 (ii): the driver brakes from 54 km h⁻¹ (15 m s⁻¹) to rest in 5 s. The velocity arrow still points forward, but the acceleration arrow points backward.");
    else if(id === "drop") L.watch("Example 4.4 / Fig. 4.10: an object dropped from rest. Here downward is positive. Read the velocity at each second.");
    else L.watch("Activity 4.2: a car goes from 0 to 100 km h⁻¹ (27.8 m s⁻¹). Set the time you found for a real car and compare accelerations.");
    if(id === "car100"){
      L.controls(L.slider("c3-t100", "Time from 0 to 100 km h⁻¹", 4, 15, 0.5, st.t100, L.num(st.t100, 1) + " s"));
      L.onInput("c3-t100", function(v){
        st.t100 = v;
        L.setVal("c3-t100", L.num(v, 1) + " s");
        L.timeline({maxT: v, step: 1, speed: 1});
        App.resetTimeline();
      });
    } else {
      L.controls("");
    }
    L.restart(true);
  }

  function chips(m, t){
    var out = [];
    for(var k = 0; k <= Math.floor(t + 1e-6); k++){
      out.push('<span class="chip"><b>' + k + ' s</b> ' + L.num(m.u + m.a * k, 1) + '</span>');
    }
    return '<div class="lab-chips"><span class="lab-chips-label">Velocity at each second (m s⁻¹):</span>' + out.join("") + '</div>';
  }

  function cells(m, t, v){
    var dv = v - m.u;
    return [
      ["Time", L.num(t, 1) + " s"],
      ["Velocity", L.num(v, 1) + " m s⁻¹ (" + L.num(v * 3.6, 0) + " km h⁻¹)", C.vel],
      ["Change in velocity", L.signed(dv, 1) + " m s⁻¹"],
      ["Average acceleration so far", t > 0 ? L.signed(dv / t, 2) + " m s⁻²" : "—", C.acc]
    ];
  }

  function cellsHTML(list){
    return '<div class="lab-readout-grid">' + list.map(function(c){
      return '<div class="telemetry-cell"><div class="telemetry-label">' + c[0] + '</div><div class="telemetry-val"' + (c[2] ? ' style="color:' + c[2] + '"' : '') + '>' + c[1] + '</div></div>';
    }).join("") + '</div>';
  }

  function drawRoad(m, t){
    var v = m.u + m.a * t, s = m.u * t + 0.5 * m.a * t * t;
    var sEnd = m.u * m.T + 0.5 * m.a * m.T * m.T;
    var span = Math.max(20, Math.ceil(sEnd * 1.15 / 10) * 10);
    var tick = span <= 60 ? 10 : span <= 160 ? 20 : 50;
    var X = function(x){ return 90 + x * (540 / span); };
    var vmax = Math.max(Math.abs(m.u), Math.abs(m.u + m.a * m.T));
    var mk = "";
    mk += L.rect(40, 176, 640, 54, "#1e293b");
    mk += L.line(40, 203, 680, 203, C.faint, 2, "14 12");
    for(var x = 0; x <= span + 1e-6; x += tick){
      mk += L.line(X(x), 232, X(x), 242, C.muted, 2) + L.text(X(x), 260, x + " m", {size: 13, color: C.muted});
    }
    var bx = X(s);
    mk += '<g transform="translate(' + bx + ',190)">' + L.rect(-64, -22, 64, 30, "#2563eb", ' rx="5" stroke="#fff" stroke-width="1.5"') +
      L.rect(-58, -17, 12, 9, "#bfdbfe") + L.rect(-42, -17, 12, 9, "#bfdbfe") + L.rect(-26, -17, 12, 9, "#bfdbfe") +
      L.circle(-50, 10, 6, "#0f172a") + L.circle(-14, 10, 6, "#0f172a") + '</g>';
    if(Math.abs(v) > 0.05){
      var vl = 150 * Math.abs(v) / vmax;
      mk += L.arrow(bx, 136, bx + vl, 136, C.vel, 5) + L.text(bx + vl + 8, 141, "v = " + L.num(v, 1) + " m s⁻¹", {size: 15, color: C.vel, anchor: "start", weight: 700});
    } else {
      mk += L.text(bx, 141, "at rest", {size: 15, color: C.vel, weight: 700});
    }
    var al = 30 + 50 * Math.min(1, Math.abs(m.a) / 5), dir = m.a >= 0 ? 1 : -1;
    var ax2 = bx + dir * al;
    mk += L.arrow(bx, 88, ax2, 88, C.acc, 5) + L.text(dir > 0 ? ax2 + 8 : ax2 - 8, 93, "a = " + L.signed(m.a, 2) + " m s⁻²", {size: 15, color: C.acc, anchor: dir > 0 ? "start" : "end", weight: 700});
    mk += L.text(60, 40, "positive direction →", {size: 14, color: C.muted, anchor: "start"});
    L.svg(mk, m.name + ": at t = " + L.num(t, 1) + " s the velocity is " + L.num(v, 1) + " m/s and the acceleration is " + L.num(m.a, 2) + " m/s².", 280);
    L.readoutHTML(cellsHTML(cells(m, t, v)) + chips(m, t));
    return v;
  }

  function drawDrop(m, t){
    var v = m.a * t, s = 0.5 * m.a * t * t;
    var Y = function(x){ return 34 + x * 2.9; };
    var mk = "";
    mk += L.line(230, Y(0), 230, Y(80), C.muted, 2);
    for(var x = 0; x <= 80; x += 10){
      mk += L.line(222, Y(x), 238, Y(x), C.muted, 2) + L.text(214, Y(x) + 5, x + " m", {size: 13, color: C.muted, anchor: "end"});
    }
    mk += L.text(120, 60, "↓ positive", {size: 14, color: C.muted});
    mk += L.arrow(120, 100, 120, 160, C.acc, 5) + L.text(120, 184, "a = +9.8 m s⁻²", {size: 14, color: C.acc, weight: 700});
    for(var k = 0; k <= 4; k++){
      if(t + 1e-6 >= k){
        var yk = Y(0.5 * m.a * k * k);
        mk += L.line(270, yk, 360, yk, C.faint, 1.5, "4 4");
        mk += L.text(370, yk + 5, "t = " + k + " s, v = " + L.num(m.a * k, 1) + " m s⁻¹", {size: 14, color: C.text, anchor: "start"});
      }
    }
    mk += L.circle(300, Y(s), 11, "#fb923c", ' stroke="#fff" stroke-width="2"');
    if(v > 0.2) mk += L.arrow(270, Y(s), 270, Y(s) + 16 + 50 * v / 39.2, C.vel, 5);
    L.svg(mk, "Dropped object after " + L.num(t, 1) + " seconds: fallen " + L.num(s, 1) + " metres, velocity " + L.num(v, 1) + " m/s downward.", 280);
    L.readoutHTML(cellsHTML(cells(m, t, v).concat([["Distance fallen", L.num(s, 1) + " m"]])) + chips(m, t));
    return v;
  }

  function draw(t){
    var m = model();
    if(st.preset === "drop") drawDrop(m, t); else drawRoad(m, t);
    var done = t >= m.T - 1e-6, msg;
    if(t <= 0) msg = "Press <b>Play</b>. Watch how much the velocity changes in each second.";
    else if(st.preset === "busUp") msg = done
      ? "<b>Example 4.3 (i):</b> a = (15 − 10) m s⁻¹ ÷ 10 s = <b>+0.5 m s⁻²</b>. The speed increased, so the acceleration is in the direction of velocity."
      : "The velocity grows by the same 0.5 m s⁻¹ every second, so the acceleration is constant.";
    else if(st.preset === "busBrake") msg = done
      ? "<b>Example 4.3 (ii):</b> a = (0 − 15) m s⁻¹ ÷ 5 s = <b>−3 m s⁻²</b>. The minus sign means the acceleration is opposite to the velocity: the bus is slowing down, not moving backward."
      : "The bus still moves forward (velocity +), but loses 3 m s⁻¹ every second, so its acceleration is negative.";
    else if(st.preset === "drop") msg = done
      ? "<b>Example 4.4:</b> the velocity rises by 9.8 m s⁻¹ in every one-second interval, so the average acceleration is constant: <b>9.8 m s⁻²</b> in the direction of motion (downward). This is <i>g</i>."
      : "Each second the velocity increases by another 9.8 m s⁻¹.";
    else msg = done
      ? "<b>Activity 4.2:</b> a = 27.8 m s⁻¹ ÷ " + L.num(st.t100, 1) + " s = <b>" + L.num(27.78 / st.t100, 2) + " m s⁻²</b>. A shorter 0–100 km h⁻¹ time means a larger acceleration."
      : "Starting from rest, the car gains " + L.num(27.78 / st.t100, 2) + " m s⁻¹ every second.";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["busUp", "Example 4.3 (i): bus speeds up"], ["busBrake", "Example 4.3 (ii): bus brakes"], ["drop", "Example 4.4: dropped object"], ["car100", "Activity 4.2: 0–100 km h⁻¹"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.accel = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 4 — Position–time graphs (Activity 4.3, Activity 4.4, Examples 4.5–4.6, Exercise Q6)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "act43", t1: 2, t2: 4};
  var g = null;

  var CFG = {
    act43: {data: [[0, 0], [1, 20], [2, 40], [3, 60], [4, 80], [5, 100], [6, 120]], s: function(t){ return 20 * t; },
      tmax: 7, tStep: 1, smax: 140, sStep: 20, maxT: 6, step: 1, speed: 1, plot: true},
    act44: {s: function(t){ return 20 * t; }, tmax: 7, tStep: 1, smax: 140, sStep: 20, maxT: 6, step: 1, speed: 1,
      tri: true, triMin: 0, triMax: 6, triStep: 0.5, t1: 2, t2: 4},
    ex45: {data: [[0, 0], [2, 1], [4, 4], [6, 9], [8, 16], [10, 25], [12, 36]], s: function(t){ return t * t / 4; },
      tmax: 12, tStep: 2, smax: 40, sStep: 5, maxT: 12, step: 2, speed: 2, plot: true, tri: true, triMin: 0, triMax: 12, triStep: 1, t1: 4, t2: 6},
    ex46: {s: function(){ return 40; }, tmax: 3, tStep: 1, smax: 60, sStep: 20, maxT: 3, step: 0.5, speed: 1},
    q6: {sA: function(t){ return 10 * t; }, sB: function(t){ return 20 + 6 * t; }, tmax: 7, tStep: 1, smax: 80, sStep: 10, maxT: 6.5, step: 0.5, speed: 1}
  };

  function cfg(){ return CFG[st.preset]; }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    var c = cfg();
    if(c.tri){ st.t1 = c.t1; st.t2 = c.t2; }
    L.timeline({maxT: c.maxT, step: c.step, speed: c.speed});
    if(id === "q6") L.legend([[C.vel, "object A"], ["#f472b6", "object B"]]);
    else L.legend([[C.vel, "position–time graph"], ["#f8fafc", "vehicle on the road (left strip)"]].concat(c.tri ? [[C.path, "triangle ABC for the slope"]] : []));
    var w = {
      act43: "Activity 4.3 with Table 4.3. A point is plotted each second as the vehicle moves; once all points are plotted they are joined.",
      act44: "Activity 4.4 / Fig. 4.14. Drag A or B (or use the sliders). BC is the change in position and CA the change in time; BC ÷ CA is the velocity.",
      ex45: "Example 4.5 with Table 4.4: a vehicle starting from rest and speeding up. The points do not lie on a straight line. Compare the slope between 4–6 s with 10–12 s.",
      ex46: "Example 4.6 / Fig. 4.15. Watch the vehicle strip: nothing moves. What does the graph look like?",
      q6: "Exercise Q6 / Fig. 4.27 (numbers chosen to match the figure's shape). Two objects on parallel tracks. Watch the moment the lines cross."
    };
    L.watch(w[id]);
    renderControls();
    L.restart(true);
  }

  function renderControls(){
    var c = cfg();
    if(!c.tri){ L.controls(""); return; }
    L.controls(
      L.slider("c4-t1", "Point A at time t₁", c.triMin, c.triMax, c.triStep, st.t1, L.num(st.t1, 1) + " s") +
      L.slider("c4-t2", "Point B at time t₂", c.triMin, c.triMax, c.triStep, st.t2, L.num(st.t2, 1) + " s")
    );
    L.onInput("c4-t1", function(v){ setT("t1", v); });
    L.onInput("c4-t2", function(v){ setT("t2", v); });
  }

  function setT(which, v){
    var c = cfg();
    v = Math.max(c.triMin, Math.min(c.triMax, Math.round(v / c.triStep) * c.triStep));
    if(which === "t1") st.t1 = Math.min(v, st.t2 - c.triStep);
    else st.t2 = Math.max(v, st.t1 + c.triStep);
    var e1 = L.$("c4-t1"), e2 = L.$("c4-t2");
    if(e1) e1.value = st.t1;
    if(e2) e2.value = st.t2;
    L.setVal("c4-t1", L.num(st.t1, 1) + " s");
    L.setVal("c4-t2", L.num(st.t2, 1) + " s");
    draw(App.state.t);
  }

  function frame(c){
    g = L.graph({x0: 150, y0: 262, w: 510, h: 214, tmax: c.tmax, vmin: 0, vmax: c.smax, tStep: c.tStep, vStep: c.sStep,
      tLabel: "Time (s)", vLabel: "Position (m)"});
    return g.svg;
  }

  function strip(x, s, color, label){
    var top = g.Y(cfg().smax), bot = g.Y(0);
    return L.rect(x - 7, top, 14, bot - top, "#1e293b", ' rx="7"') + L.rect(x - 11, g.Y(s) - 7, 22, 14, color, ' rx="3"') +
      L.text(x, bot + 20, label, {size: 12, color: C.muted});
  }

  function draw(t){
    var c = cfg(), mk = frame(c), id = st.preset;

    if(id === "q6"){
      var sa = c.sA(t), sb = c.sB(t);
      mk += L.polyline(g, [[0, c.sA(0)], [c.maxT, c.sA(c.maxT)]], C.faint, 2, "5 5") + L.polyline(g, [[0, c.sB(0)], [c.maxT, c.sB(c.maxT)]], C.faint, 2, "5 5");
      mk += L.polyline(g, [[0, c.sA(0)], [t, sa]], C.vel, 4) + L.polyline(g, [[0, c.sB(0)], [t, sb]], "#f472b6", 4);
      mk += L.circle(g.X(t), g.Y(sa), 6, C.vel) + L.circle(g.X(t), g.Y(sb), 6, "#f472b6");
      mk += L.text(g.X(c.maxT) + 6, g.Y(c.sA(c.maxT)) - 4, "A", {size: 16, color: C.vel, weight: 700, anchor: "start"});
      mk += L.text(g.X(c.maxT) + 6, g.Y(c.sB(c.maxT)) + 14, "B", {size: 16, color: "#f472b6", weight: 700, anchor: "start"});
      if(t >= 5) mk += L.line(g.X(5), g.Y(0), g.X(5), g.Y(50), C.text, 1.5, "6 4") + L.text(g.X(5), g.Y(50) - 12, "same position", {size: 13, color: C.text});
      mk += strip(40, sa, C.vel, "A") + strip(80, sb, "#f472b6", "B");
      L.svg(mk, "Position–time graph of A and B at t = " + L.num(t, 1) + " s: A at " + L.num(sa, 0) + " m, B at " + L.num(sb, 0) + " m.", 300);
      L.readout([["Time", L.num(t, 1) + " s"], ["Position of A", L.num(sa, 1) + " m", C.vel], ["Position of B", L.num(sb, 1) + " m", "#f472b6"],
        ["Velocity of A (slope)", "10 m s⁻¹", C.vel], ["Velocity of B (slope)", "6 m s⁻¹", "#f472b6"]]);
      L.verdict(t <= 0 ? "Press <b>Play</b>. B starts 20 m ahead of A."
        : t < 5 ? "A's line is steeper, so A is faster and is catching up with B."
        : t < 5.25 ? "At t = 5 s the lines cross: A and B are at the <b>same position</b> (50 m). Their slopes are still different."
        : "<b>Exercise Q6:</b> both lines are straight, so each velocity is constant, and A's slope (10 m s⁻¹) is always greater than B's (6 m s⁻¹). They <b>never</b> have equal velocity; at t = 5 s they only share a position.");
      return;
    }

    var s = c.s(t), plotted = 0;
    var showTri = c.tri && (id === "act44" || t >= c.maxT - 1e-6 || st.touched);
    if(c.plot){
      var done = t >= c.maxT - 1e-6;
      if(done){
        var curve = [];
        for(var k = 0; k <= 60; k++){ var tt = c.maxT * k / 60; curve.push([tt, c.s(tt)]); }
        mk += L.polyline(g, curve, C.vel, 3);
      }
      c.data.forEach(function(p){
        if(t + 1e-6 >= p[0]){
          plotted++;
          mk += L.circle(g.X(p[0]), g.Y(p[1]), 6, C.vel, ' stroke="#fff" stroke-width="1.5"');
          // Coordinates are hidden once the slope triangle is shown (the readout lists A and B instead).
          if(!showTri) mk += L.text(g.X(p[0]) - 6, g.Y(p[1]) - 10, "(" + p[0] + " s, " + p[1] + " m)", {size: 12, color: C.text, anchor: "end"});
        }
      });
      mk += L.circle(g.X(t), g.Y(s), 4, "#f8fafc");
    } else {
      var full = [], sofar = [];
      for(var j = 0; j <= 60; j++){
        var tj = c.maxT * j / 60;
        full.push([tj, c.s(tj)]);
        if(tj <= t) sofar.push([tj, c.s(tj)]);
      }
      sofar.push([t, s]);
      mk += L.polyline(g, full, C.faint, 2, "5 5") + L.polyline(g, sofar, C.vel, 4) + L.circle(g.X(t), g.Y(s), 6, C.vel);
      if(id === "ex46" && t > 0) mk += L.text(g.X(1.5), g.Y(40) - 14, "position stays 40 m", {size: 14, color: C.text});
    }
    mk += L.line(g.X(0), g.Y(s), g.X(t), g.Y(s), "#f8fafc", 1, "3 5");

    var s1 = c.tri ? c.s(st.t1) : 0, s2 = c.tri ? c.s(st.t2) : 0;
    if(showTri){
      var A = [g.X(st.t1), g.Y(s1)], B = [g.X(st.t2), g.Y(s2)], Cc = [g.X(st.t2), g.Y(s1)];
      mk += '<polygon points="' + A.join(",") + ' ' + Cc.join(",") + ' ' + B.join(",") + '" fill="rgba(245,158,11,0.18)" stroke="' + C.path + '" stroke-width="2"/>';
      mk += L.text((A[0] + Cc[0]) / 2, Cc[1] + 20, "CA = " + L.num(st.t2 - st.t1, 1) + " s", {size: 13, color: C.path, weight: 700});
      mk += L.text(B[0] + 10, (B[1] + Cc[1]) / 2 + 5, "BC = " + L.num(s2 - s1, 1) + " m", {size: 13, color: C.path, weight: 700, anchor: "start"});
      mk += L.text(A[0] - 12, A[1] - 8, "A", {size: 15, weight: 700, color: "#f8fafc"}) + L.text(B[0] - 12, B[1] - 8, "B", {size: 15, weight: 700, color: "#f8fafc"}) +
        L.text(Cc[0] + 12, Cc[1] + 4, "C", {size: 14, color: C.muted, anchor: "start"});
      mk += '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="11" fill="' + C.path + '" stroke="#fff" stroke-width="2" data-handle="t1" style="cursor:grab"/>';
      mk += '<circle cx="' + B[0] + '" cy="' + B[1] + '" r="11" fill="' + C.path + '" stroke="#fff" stroke-width="2" data-handle="t2" style="cursor:grab"/>';
    }
    mk += strip(60, s, "#f8fafc", "vehicle");
    L.svg(mk, "Position–time graph at t = " + L.num(t, 1) + " s, position " + L.num(s, 1) + " m.", 300);

    var cells = [["Time", L.num(t, 1) + " s"], ["Position", L.num(s, 1) + " m", C.vel]];
    if(c.plot) cells.push(["Points plotted", plotted + " of " + c.data.length]);
    if(showTri){
      cells.push(["A (t₁, s₁)", "(" + L.num(st.t1, 1) + " s, " + L.num(s1, 1) + " m)"], ["B (t₂, s₂)", "(" + L.num(st.t2, 1) + " s, " + L.num(s2, 1) + " m)"],
        ["Slope BC ÷ CA", L.num((s2 - s1) / (st.t2 - st.t1), 2) + " m s⁻¹", C.path]);
    }
    if(id === "ex46") cells.push(["Slope", "0 m s⁻¹"], ["Distance travelled", "0 m"]);
    L.readout(cells);

    var end = t >= c.maxT - 1e-6, msg;
    if(t <= 0 && id !== "act44") msg = "Press <b>Play</b>.";
    else if(id === "act43") msg = end ? "<b>Activity 4.3:</b> all points lie on a straight line. In every 1 s interval the position changes by the same 20 m, so the vehicle moves with <b>constant velocity</b>." : "Plotting (time, position) pairs from Table 4.3…";
    else if(id === "act44") msg = "<b>Activity 4.4:</b> v = BC ÷ CA = (" + L.num(s2, 1) + " − " + L.num(s1, 1) + ") m ÷ (" + L.num(st.t2, 1) + " − " + L.num(st.t1, 1) + ") s = <b>" + L.num((s2 - s1) / (st.t2 - st.t1), 1) + " m s⁻¹</b>. Move A and B anywhere on this straight line: the slope stays the same.";
    else if(id === "ex45") msg = end
      ? "<b>Example 4.5:</b> the points lie on a curve, not a straight line, so the velocity is changing. Between " + L.num(st.t1, 0) + " s and " + L.num(st.t2, 0) + " s the average velocity is <b>" + L.num((s2 - s1) / (st.t2 - st.t1), 2) + " m s⁻¹</b>. Try 4–6 s and then 10–12 s: equal time intervals, larger displacement later, so the velocity is increasing."
      : "The vehicle covers more distance in each successive 2 s interval…";
    else msg = end ? "<b>Example 4.6:</b> a line parallel to the time axis means the position is not changing: the vehicle is <b>at rest</b>, 40 m from the origin. Its slope, and so its velocity, is zero." : "The time increases, but the position stays at 40 m.";
    L.verdict(msg);
  }

  function bindDrag(){
    var svgEl = L.$("diagram");
    if(!svgEl || !svgEl.addEventListener) return;
    var dragging = null;
    function move(e){
      if(!dragging || !g) return;
      var p = L.svgPoint(e);
      if(!p) return;
      st.touched = true;
      setT(dragging, g.tFromX(p.x));
      e.preventDefault();
    }
    function up(){ dragging = null; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }
    svgEl.addEventListener("pointerdown", function(e){
      var h = e.target && e.target.getAttribute && e.target.getAttribute("data-handle");
      if(!h || !cfg().tri) return;
      dragging = h;
      App.pause();
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      e.preventDefault();
    });
  }

  function mount(){
    st.touched = false;
    L.presets([["act43", "Activity 4.3: plot Table 4.3"], ["act44", "Activity 4.4: slope from A and B"], ["ex45", "Example 4.5: speeding up"], ["ex46", "Example 4.6: at rest"], ["q6", "Exercise Q6: A and B"]], st.preset, select);
    bindDrag();
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.stgraph = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 5 — Velocity–time graphs: slope and area (Figs. 4.17–4.18, Exercises Q9 and Q12)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "fig418b", t1: 10, t2: 20};

  var CFG = {
    fig418a: {pts: [[0, 20], [6, 20]], tmax: 6, tStep: 1, vmax: 30, vStep: 5, maxT: 6, step: 1, speed: 1, t1: 0, t2: 6, iStep: 1,
      name: "Fig. 4.18(a): constant velocity"},
    fig418b: {pts: [[0, 0], [30, 15]], tmax: 30, tStep: 5, vmax: 15, vStep: 2.5, vDp: 1, maxT: 30, step: 5, speed: 5, t1: 10, t2: 20, iStep: 5,
      name: "Fig. 4.18(b): Table 4.5, speeding up"},
    fig417c: {pts: [[0, 15], [30, 0]], tmax: 30, tStep: 5, vmax: 15, vStep: 2.5, vDp: 1, maxT: 30, step: 5, speed: 5, t1: 10, t2: 20, iStep: 5,
      name: "Fig. 4.17(c): Table 4.6, slowing down"},
    q9: {pts: [[0, 0], [5, 20], [15, 20], [21, 0]], tmax: 22, tStep: 2, vmax: 25, vStep: 5, maxT: 21, step: 1, speed: 2, t1: 0, t2: 21, iStep: 1,
      stages: [[0, 5, "area", "speeding up"], [5, 15, "area2", "constant velocity"], [15, 21, "area3", "braking"]], name: "Exercise Q9"},
    q12: {pts: [[0, 0], [20, 3], [100, 3], [120, 2]], tmax: 120, tStep: 20, vmax: 6, vStep: 1, maxT: 120, step: 10, speed: 10, t1: 0, t2: 120, iStep: 10,
      stages: [[0, 20, "area", "speeding up"], [20, 100, "area2", "(i) constant velocity"], [100, 120, "area3", "(ii) decreasing velocity"]], name: "Exercise Q12 / Fig. 4.30"}
  };
  function cfg(){ return CFG[st.preset]; }

  function select(id){
    st.preset = id;
    L.markPreset(id);
    var c = cfg();
    st.t1 = c.t1; st.t2 = c.t2;
    L.timeline({maxT: c.maxT, step: c.step, speed: c.speed});
    if(c.stages) L.legend([[C.area, c.stages[0][3]], [C.area2, c.stages[1][3]], [C.area3, c.stages[2][3]]]);
    else L.legend([[C.vel, "velocity–time graph"], [C.area, "area between t₁ and t₂ (displacement)"]]);
    var w = {
      fig418a: "Fig. 4.18(a): a car moving at a steady 20 m s⁻¹. The shaded rectangle grows as time passes.",
      fig418b: "Fig. 4.18(b), Table 4.5: velocity increases by 2.5 m s⁻¹ every 5 s. The interval 10 s to 20 s is measured, as in the textbook.",
      fig417c: "Fig. 4.17(c), Table 4.6: velocity decreases by 2.5 m s⁻¹ every 5 s. Note the sign of the slope.",
      q9: "Exercise Q9: speeding up, steady, then braking. Each stage is shaded in its own colour.",
      q12: "Exercise Q12 / Fig. 4.30: the cyclist. Shade (i) the constant-velocity part and (ii) the decreasing-velocity part in different colours."
    };
    L.watch(w[id] + " Change t₁ and t₂ to measure any interval.");
    renderControls();
    L.restart(true);
  }

  function renderControls(){
    var c = cfg();
    L.controls(
      L.slider("c5-t1", "Measure from t₁", 0, c.maxT, c.iStep, st.t1, L.num(st.t1, 0) + " s") +
      L.slider("c5-t2", "…to t₂", 0, c.maxT, c.iStep, st.t2, L.num(st.t2, 0) + " s")
    );
    L.onInput("c5-t1", function(v){ st.t1 = Math.min(v, st.t2 - c.iStep); L.$("c5-t1").value = st.t1; L.setVal("c5-t1", L.num(st.t1, 0) + " s"); draw(App.state.t); });
    L.onInput("c5-t2", function(v){ st.t2 = Math.max(v, st.t1 + c.iStep); L.$("c5-t2").value = st.t2; L.setVal("c5-t2", L.num(st.t2, 0) + " s"); draw(App.state.t); });
  }

  function draw(t){
    var c = cfg(), pts = c.pts;
    var g = L.graph({x0: 90, y0: 262, w: 570, h: 214, tmax: c.tmax, vmin: 0, vmax: c.vmax, tStep: c.tStep, vStep: c.vStep,
      tLabel: "Time (s)", vLabel: "Velocity (m s⁻¹)", vFmt: function(v){ return L.num(v, c.vDp || 0); }});
    var mk = g.svg;
    var hi = Math.min(t, st.t2);
    if(c.stages){
      c.stages.forEach(function(sg){
        var a = Math.max(sg[0], st.t1), b = Math.min(sg[1], hi);
        mk += L.areaPath(g, pts, a, b, C[sg[2]]);
      });
    } else {
      mk += L.areaPath(g, pts, st.t1, hi, C.area);
    }
    mk += L.polyline(g, pts, C.faint, 2, "6 5");
    var sofar = pts.filter(function(p){ return p[0] < t; }).concat([[t, L.interp(pts, t)]]);
    mk += L.polyline(g, sofar, C.vel, 4);
    var v = L.interp(pts, t);
    mk += L.circle(g.X(t), g.Y(v), 6, C.vel, ' stroke="#fff" stroke-width="1.5"');
    [[st.t1, "t₁"], [st.t2, "t₂"]].forEach(function(m){
      mk += L.line(g.X(m[0]), g.Y(0), g.X(m[0]), g.Y(c.vmax), C.path, 1.5, "4 4") +
        L.text(g.X(m[0]) + (m[1] === "t₁" ? 6 : -6), g.Y(c.vmax) + 16, m[1], {size: 14, color: C.path, weight: 700, anchor: m[1] === "t₁" ? "start" : "end"});
    });
    if(c.stages && t >= c.maxT - 1e-6){
      c.stages.forEach(function(sg){
        var ar = L.area(pts, sg[0], sg[1]), mid = (sg[0] + sg[1]) / 2;
        mk += L.text(g.X(mid), g.Y(L.interp(pts, mid) / 2) + 5, L.num(ar, 0) + " m", {size: 15, color: "#f8fafc", weight: 700});
      });
    }
    L.svg(mk, c.name + ": at t = " + L.num(t, 0) + " s velocity " + L.num(v, 2) + " m/s; area so far " + L.num(L.area(pts, st.t1, Math.max(st.t1, hi)), 1) + " m.", 300);

    var v1 = L.interp(pts, st.t1), v2 = L.interp(pts, st.t2);
    var slope = (v2 - v1) / (st.t2 - st.t1);
    var areaSoFar = t > st.t1 ? L.area(pts, st.t1, hi) : 0;
    var full = L.area(pts, st.t1, st.t2);
    L.readout([
      ["Time", L.num(t, 0) + " s"],
      ["Velocity now", L.num(v, 2) + " m s⁻¹", C.vel],
      ["Slope from t₁ to t₂ (average acceleration)", L.signed(slope, 3).replace(/0+$/, "").replace(/\.$/, "") + " m s⁻²", C.acc],
      ["Area from t₁ so far", L.num(areaSoFar, 1) + " m", C.path],
      ["Displacement t₁ → t₂", t >= st.t2 - 1e-6 ? L.num(full, 1) + " m" : "…", C.disp]
    ]);

    var end = t >= c.maxT - 1e-6, msg;
    var id = st.preset;
    var iv = " between " + L.num(st.t1, 0) + " s and " + L.num(st.t2, 0) + " s";
    if(t <= 0) msg = "Press <b>Play</b>.";
    else if(!end) msg = "The shaded area grows only up to the current time. Its size in metres is the displacement so far" + iv + ".";
    else if(id === "fig418a") msg = "<b>Fig. 4.18(a):</b> the line is parallel to the time axis, so the slope (acceleration) is zero. Area of the rectangle = 20 m s⁻¹ × 6 s = <b>120 m</b> displacement" + (st.t1 === 0 && st.t2 === 6 ? "." : "; for your interval it is " + L.num(full, 1) + " m.");
    else if(id === "fig418b") msg = "<b>Fig. 4.18(b):</b> slope = (10 − 5) m s⁻¹ ÷ (20 − 10) s = 0.5 m s⁻². Displacement from 10 s to 20 s = rectangle 50 m + triangle 25 m = <b>75 m</b>." + (st.t1 === 10 && st.t2 === 20 ? "" : " For your interval" + iv + ": slope " + L.num(slope, 2) + " m s⁻², area " + L.num(full, 1) + " m.");
    else if(id === "fig417c") msg = "<b>Fig. 4.17(c):</b> the slope is <b>−0.5 m s⁻²</b>: the acceleration is opposite to the velocity because the car is slowing down. The area" + iv + " is still positive: " + L.num(full, 1) + " m.";
    else if(id === "q9") msg = "<b>Exercise Q9:</b> total distance = 50 m (speeding up) + 200 m (steady) + 60 m (braking) = <b>310 m</b>.";
    else msg = "<b>Exercise Q12:</b> (i) constant velocity, 20–100 s: <b>240 m</b>; (ii) decreasing velocity, 100–120 s: <b>50 m</b>. With 30 m while speeding up, the displacement in 120 s is <b>320 m</b>. Average acceleration = (2 − 0) m s⁻¹ ÷ 120 s ≈ <b>0.017 m s⁻²</b>.";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["fig418a", "Fig. 4.18(a): steady 20 m s⁻¹"], ["fig418b", "Fig. 4.18(b): speeding up"], ["fig417c", "Fig. 4.17(c): slowing down"], ["q9", "Exercise Q9: car trip"], ["q12", "Exercise Q12: cyclist"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.vtgraph = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 6 — Kinematic equations and stopping distance (Exercise Q10, Example 4.8)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var PRESETS = {
    q10: {uKmh: 36, tR: 0.5, a: 2.5, gap: 30},
    ex48a: {uKmh: 54, tR: 0, a: 4, gap: 0},
    ex48b: {uKmh: 108, tR: 0, a: 4, gap: 0}
  };
  var st = {preset: "q10", uKmh: 36, tR: 0.5, a: 2.5, gap: 30};

  function model(){
    var u = st.uKmh / 3.6, s1 = u * st.tR, tb = u / st.a, s2 = u * u / (2 * st.a);
    var m = {u: u, s1: s1, tb: tb, s2: s2, total: s1 + s2, stopT: st.tR + tb, crash: false};
    if(st.gap > 0 && m.total > st.gap + 1e-9){
      m.crash = true;
      if(st.gap <= s1){ m.tImp = st.gap / u; m.vImp = u; }
      else {
        var disc = u * u - 2 * st.a * (st.gap - s1);
        m.tImp = st.tR + (u - Math.sqrt(disc)) / st.a;
        m.vImp = Math.sqrt(disc);
      }
    }
    m.endT = m.crash ? m.tImp : m.stopT;
    return m;
  }

  function stateAt(m, t){
    var tt = Math.min(t, m.endT);
    if(tt <= st.tR) return {pos: m.u * tt, v: m.u};
    var tau = Math.min(tt - st.tR, m.tb);
    return {pos: m.s1 + m.u * tau - 0.5 * st.a * tau * tau, v: Math.max(0, m.u - st.a * tau)};
  }

  function applyTimeline(){
    var m = model();
    var maxT = Math.ceil((m.endT + 0.5) * 2) / 2;
    L.timeline({maxT: maxT, step: 0.5, speed: maxT > 10 ? 2 : 1});
  }

  function select(id){
    var p = PRESETS[id];
    st.preset = id; st.uKmh = p.uKmh; st.tR = p.tR; st.a = p.a; st.gap = p.gap;
    L.markPreset(id);
    L.legend([[C.path, "reaction distance (constant speed)"], [C.vel, "braking distance (slowing down)"], [C.danger, "obstacle"]]);
    if(id === "q10") L.watch("Exercise Q10: 36 km h⁻¹ (10 m s⁻¹), reaction time 0.5 s, braking at 2.5 m s⁻², obstacle 30 m ahead.");
    else if(id === "ex48a") L.watch("Example 4.8 (i): braking at 4 m s⁻² from 54 km h⁻¹ (15 m s⁻¹). The textbook ignores reaction time here.");
    else L.watch("Example 4.8 (ii): the same brakes from 108 km h⁻¹ (30 m s⁻¹), twice the speed. Compare the braking distance with (i).");
    renderControls();
    applyTimeline();
    L.restart(true);
  }

  function renderControls(){
    L.controls(
      L.slider("c6-u", "Initial speed u", 18, 108, 9, st.uKmh, st.uKmh + " km h⁻¹") +
      L.slider("c6-tr", "Reaction time", 0, 1.5, 0.1, st.tR, L.num(st.tR, 1) + " s") +
      L.slider("c6-a", "Braking deceleration", 1, 8, 0.5, st.a, L.num(st.a, 1) + " m s⁻²") +
      L.slider("c6-gap", "Obstacle ahead", 0, 150, 5, st.gap, st.gap > 0 ? st.gap + " m" : "none")
    );
    function custom(){ st.preset = "custom"; L.markPreset("custom"); applyTimeline(); App.resetTimeline(); }
    L.onInput("c6-u", function(v){ st.uKmh = v; L.setVal("c6-u", v + " km h⁻¹"); custom(); });
    L.onInput("c6-tr", function(v){ st.tR = v; L.setVal("c6-tr", L.num(v, 1) + " s"); custom(); });
    L.onInput("c6-a", function(v){ st.a = v; L.setVal("c6-a", L.num(v, 1) + " m s⁻²"); custom(); });
    L.onInput("c6-gap", function(v){ st.gap = v; L.setVal("c6-gap", v > 0 ? v + " m" : "none"); custom(); });
  }

  function niceCeil(x, steps){
    for(var i = 0; i < steps.length; i++) if(x <= steps[i]) return steps[i];
    return Math.ceil(x / 50) * 50;
  }

  function draw(t){
    var m = model(), s = stateAt(m, t), done = t >= m.endT - 1e-6;
    var span = niceCeil(Math.max(m.total, st.gap) * 1.12, [20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400]);
    var tick = span <= 40 ? 5 : span <= 100 ? 10 : span <= 200 ? 20 : 50;
    var X = function(d){ return 70 + d * (590 / span); };
    var mk = "";
    mk += L.rect(40, 50, 640, 62, "#1e293b") + L.line(40, 81, 680, 81, C.faint, 2, "14 12");
    for(var d = 0; d <= span + 1e-6; d += tick){
      mk += L.line(X(d), 114, X(d), 122, C.muted, 2) + L.text(X(d), 138, d + " m", {size: 12, color: C.muted});
    }
    var p1 = Math.min(s.pos, m.s1);
    mk += L.rect(X(0), 54, X(p1) - X(0), 54, "rgba(245,158,11,0.35)");
    if(s.pos > m.s1) mk += L.rect(X(m.s1), 54, X(s.pos) - X(m.s1), 54, "rgba(56,189,248,0.32)");
    if(done){
      if(m.s1 > 0.5) mk += L.text((X(0) + X(m.s1)) / 2, 44, "s₁ = " + L.num(m.s1, 1) + " m", {size: 13, color: C.path, weight: 700});
      var bEnd = m.crash ? st.gap : m.total;
      mk += L.text((X(m.s1) + X(bEnd)) / 2, 44, (m.crash ? "braking " : "s₂ = ") + L.num(bEnd - m.s1, 1) + " m", {size: 13, color: C.vel, weight: 700});
    }
    if(st.gap > 0){
      mk += L.rect(X(st.gap), 46, 12, 70, C.danger, ' rx="2"') + L.text(X(st.gap) + 6, 24, "obstacle " + st.gap + " m", {size: 13, color: C.danger, weight: 700});
    }
    var bx = X(s.pos);
    mk += '<g transform="translate(' + bx + ',81)">' + L.rect(-58, -17, 58, 30, "#2563eb", ' rx="4" stroke="#fff" stroke-width="1.5"') +
      L.rect(-52, -12, 11, 8, "#bfdbfe") + L.rect(-37, -12, 11, 8, "#bfdbfe") + L.rect(-22, -12, 11, 8, "#bfdbfe") +
      L.circle(-46, 13, 5, "#0f172a") + L.circle(-12, 13, 5, "#0f172a") + '</g>';
    if(m.crash && t >= m.tImp - 1e-6) mk += L.text(bx + 18, 100, "✸", {size: 34, color: "#fbbf24", anchor: "start"});

    // Synchronised velocity–time graph
    var tmax = Math.max(2, Math.ceil(m.stopT + 0.5));
    var tStep = tmax <= 8 ? 1 : tmax <= 16 ? 2 : 5;
    tmax = Math.ceil(tmax / tStep) * tStep;
    var vmax = niceCeil(m.u * 1.15, [5, 10, 15, 20, 25, 30, 35, 40]);
    var g = L.graph({x0: 90, y0: 380, w: 560, h: 170, tmax: tmax, vmin: 0, vmax: vmax, tStep: tStep, vStep: vmax <= 10 ? 2 : 5,
      tLabel: "Time (s)", vLabel: "Velocity (m s⁻¹)"});
    mk += g.svg;
    var vt = [[0, m.u], [st.tR, m.u], [st.tR + m.tb, 0]];
    var tNow = Math.min(t, m.endT);
    mk += L.polyline(g, vt, C.faint, 2, "6 5");
    mk += L.areaPath(g, vt, 0, Math.min(tNow, st.tR), "rgba(245,158,11,0.35)");
    if(tNow > st.tR) mk += L.areaPath(g, vt, st.tR, tNow, "rgba(56,189,248,0.32)");
    var solid = vt.filter(function(p){ return p[0] < tNow; }).concat([[tNow, L.interp(vt, tNow)]]);
    mk += L.polyline(g, solid, "#f8fafc", 3) + L.circle(g.X(tNow), g.Y(s.v), 5, "#f8fafc");
    if(done && !m.crash){
      if(st.tR > 0) mk += L.text(g.X(st.tR / 2), g.Y(m.u / 2) + 5, "area = s₁", {size: 13, color: "#f8fafc"});
      mk += L.text(g.X(st.tR + m.tb / 3), g.Y(m.u / 3) + 5, "area = s₂", {size: 13, color: "#f8fafc"});
    }
    L.svg(mk, "Stopping-distance lab at t = " + L.num(t, 1) + " s: travelled " + L.num(s.pos, 1) + " m, velocity " + L.num(s.v, 1) + " m/s.", 410);

    var uTxt = L.num(m.u, 1);
    L.readout([
      ["Time", L.num(t, 1) + " s"],
      ["Velocity now", L.num(s.v, 1) + " m s⁻¹ (" + L.num(s.v * 3.6, 0) + " km h⁻¹)", "#f8fafc"],
      ["Distance so far", L.num(s.pos, 1) + " m"],
      ["Reaction distance s₁ = u × t", uTxt + " × " + L.num(st.tR, 1) + " = " + L.num(m.s1, 1) + " m", C.path],
      ["Braking distance s₂ = u² ÷ (2 × decel.)", uTxt + "² ÷ (2 × " + L.num(st.a, 1) + ") = " + L.num(m.s2, 1) + " m", C.vel],
      ["Total stopping distance", L.num(m.total, 1) + " m"]
    ]);

    var msg;
    if(t <= 0) msg = "Press <b>Play</b>. At t = 0 the driver sees the obstacle.";
    else if(!done && t < st.tR) msg = "Reacting: the brakes are not pressed yet, so the bus keeps moving at " + uTxt + " m s⁻¹ (v = u).";
    else if(!done) msg = "Braking: v = u + at = " + uTxt + " + (−" + L.num(st.a, 1) + ") × " + L.num(t - st.tR, 1) + " = " + L.num(s.v, 1) + " m s⁻¹.";
    else if(m.crash) msg = "<b>Collision.</b> The bus needs " + L.num(m.total, 1) + " m to stop, but the obstacle is only " + st.gap + " m away. It hits it at about " + L.num(m.vImp, 1) + " m s⁻¹ (" + L.num(m.vImp * 3.6, 0) + " km h⁻¹). Try a lower speed or a shorter reaction time.";
    else if(st.preset === "q10") msg = "<b>Exercise Q10:</b> reaction distance 10 × 0.5 = 5 m, braking distance 10² ÷ (2 × 2.5) = 20 m, total <b>25 m</b>. Since 25 m &lt; 30 m, the bus <b>stops 5 m before</b> the obstacle.";
    else if(st.preset === "ex48a") msg = "<b>Example 4.8 (i):</b> from v² = u² + 2as with v = 0 and a = −4 m s⁻²: s = 15² ÷ 8 = <b>28.1 m</b>.";
    else if(st.preset === "ex48b") msg = "<b>Example 4.8 (ii):</b> s = 30² ÷ 8 = <b>112.5 m</b>, which is 4 × 28.1 m. Doubling the speed makes the braking distance four times as long, because it depends on u².";
    else msg = "Stopped after <b>" + L.num(m.total, 1) + " m</b>" + (st.gap > 0 ? ", " + L.num(st.gap - m.total, 1) + " m before the obstacle." : ".") + " Change one slider at a time and see which part of the distance changes.";
    L.verdict(msg);
  }

  function mount(){
    L.presets([["q10", "Exercise Q10: bus and obstacle"], ["ex48a", "Example 4.8 (i): 54 km h⁻¹"], ["ex48b", "Example 4.8 (ii): 108 km h⁻¹"]], st.preset, select);
    select(PRESETS[st.preset] ? st.preset : "q10");
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.kinematics = {mount: mount, draw: draw, select: select, state: st};
})();

// -------------------------------------------------------------------------
// Lab 7 — Uniform circular motion (Fig. 4.23, Activity 4.5, Exercise Q16)
// -------------------------------------------------------------------------
(function(){
  var L = LAB, C = L.C;
  var SIDES = [4, 6, 8, 12, 24, 0];
  var SHAPE_NAMES = ["rectangle (square), 4 sides", "hexagon, 6 sides", "8 sides", "12 sides", "24 sides", "circle"];
  var st = {preset: "polygon", shape: 0, released: false, relT: 0};
  var CX = 330, CY = 160, RP = 115;

  function select(id){
    st.preset = id;
    st.released = false;
    L.markPreset(id);
    if(id === "polygon"){
      L.timeline({maxT: 16, step: 1, speed: 1.5});
      L.legend([[C.path, "path run so far"], [C.vel, "velocity (direction of motion)"]]);
      L.watch("Fig. 4.23: an athlete runs one round at a uniform speed. Count how often the velocity arrow changes direction, then move the slider towards ‘circle’.");
      L.controls(L.slider("c7-shape", "Track shape", 0, 5, 1, st.shape, SHAPE_NAMES[st.shape]));
      L.onInput("c7-shape", function(v){ st.shape = v; L.setVal("c7-shape", SHAPE_NAMES[v]); App.resetTimeline(); App.play(); });
    } else if(id === "marble"){
      L.timeline({maxT: 9, step: 0.25, speed: 0.5});
      L.legend([[C.vel, "velocity (along the tangent)"], [C.path, "tangent at the release point"]]);
      L.watch("Activity 4.5: predict first, then press <b>Lift the ring</b> while the marble is moving. Try releasing it at different points.");
      L.controls('<div class="control-item control-buttons"><button type="button" class="toolbar-btn primary" id="c7-lift">Lift the ring</button>' +
        '<button type="button" class="toolbar-btn" id="c7-ringback">Put the ring back</button></div>');
      var lift = L.$("c7-lift"), back = L.$("c7-ringback");
      if(lift) lift.addEventListener("click", function(){
        if(st.released) return;
        st.released = true;
        st.relT = App.state.t >= App.state.maxT - 0.3 ? 0.8 : App.state.t;
        if(App.state.t >= App.state.maxT - 0.3) App.seekTimeline(st.relT);
        if(!App.state.playing) App.play();
      });
      if(back) back.addEventListener("click", function(){ st.released = false; App.resetTimeline(); App.play(); });
    } else {
      L.timeline({maxT: 90, step: 5, speed: 6, format: function(t){
        var total = Math.round(t), h = 6 + Math.floor(total / 60), mm = total % 60;
        return "<b>" + h + ":" + (mm < 10 ? "0" : "") + mm + " PM</b> (" + total + " min)";
      }});
      L.legend([[C.path, "path of the tip (distance)"], [C.disp, "displacement from the 6:00 position"], [C.vel, "minute hand"]]);
      L.watch("Exercise Q16: Rohan studies from 6:00 PM to 7:30 PM. Follow the tip of the 7 cm minute hand for 1.5 revolutions.");
      L.controls("");
    }
    L.restart(id !== "marble");
    if(id === "marble") App.play();
  }

  function track(n){
    // Vertices of an n-gon inscribed in the circle, starting at the top, going clockwise on screen.
    var v = [];
    for(var k = 0; k <= n; k++){
      var th = -Math.PI / 2 + 2 * Math.PI * k / n + (n === 4 ? Math.PI / 4 : 0);
      v.push([CX + RP * Math.cos(th), CY + RP * Math.sin(th)]);
    }
    return v;
  }

  function drawPolygon(t){
    var n = SIDES[st.shape], f = Math.min(1, t / 16), mk = "", pos, dir, turns;
    var R = 20;
    var perim = n ? n * 2 * R * Math.sin(Math.PI / n) : 2 * Math.PI * R;
    if(n){
      var V = track(n);
      mk += '<polygon points="' + V.slice(0, n).map(function(p){ return p.join(","); }).join(" ") + '" fill="none" stroke="' + C.faint + '" stroke-width="10" stroke-linejoin="round"/>';
      for(var k = 0; k < n; k++){
        var mx = (V[k][0] + V[k + 1][0]) / 2, my = (V[k][1] + V[k + 1][1]) / 2;
        var dx = V[k + 1][0] - V[k][0], dy = V[k + 1][1] - V[k][1], dl = Math.sqrt(dx * dx + dy * dy);
        if(n <= 12) mk += L.arrow(mx - dx / dl * 14, my - dy / dl * 14, mx + dx / dl * 14, my + dy / dl * 14, "rgba(56,189,248,0.35)", 2);
      }
      var sf = f * n, side = Math.min(n - 1, Math.floor(sf)), u = sf - side;
      pos = [V[side][0] + (V[side + 1][0] - V[side][0]) * u, V[side][1] + (V[side + 1][1] - V[side][1]) * u];
      var ddx = V[side + 1][0] - V[side][0], ddy = V[side + 1][1] - V[side][1], dd = Math.sqrt(ddx * ddx + ddy * ddy);
      dir = [ddx / dd, ddy / dd];
      var done = V.slice(0, side + 1).concat([pos]);
      if(t > 0) mk += '<polyline points="' + done.map(function(p){ return p.join(","); }).join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="4" stroke-linejoin="round"/>';
      turns = t >= 16 - 1e-6 ? n : side;
    } else {
      mk += L.circle(CX, CY, RP, "none", ' stroke="' + C.faint + '" stroke-width="10"');
      for(var j = 0; j < 12; j++){
        var a = -Math.PI / 2 + 2 * Math.PI * j / 12, px = CX + RP * Math.cos(a), py = CY + RP * Math.sin(a);
        mk += L.arrow(px + Math.sin(a) * 14, py - Math.cos(a) * 14, px - Math.sin(a) * 14, py + Math.cos(a) * 14, "rgba(56,189,248,0.35)", 2);
      }
      var th = -Math.PI / 2 + 2 * Math.PI * f;
      pos = [CX + RP * Math.cos(th), CY + RP * Math.sin(th)];
      dir = [-Math.sin(th), Math.cos(th)];
      if(t > 0){
        var arc = [];
        for(var q = 0; q <= 90; q++){ var aa = -Math.PI / 2 + 2 * Math.PI * f * q / 90; arc.push((CX + RP * Math.cos(aa)) + "," + (CY + RP * Math.sin(aa))); }
        mk += '<polyline points="' + arc.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="4"/>';
      }
    }
    var start = n ? track(n)[0] : [CX, CY - RP];
    mk += L.circle(start[0], start[1], 5, C.muted) + L.text(start[0], start[1] - 14, "start", {size: 12, color: C.muted});
    mk += L.arrow(pos[0], pos[1], pos[0] + dir[0] * 62, pos[1] + dir[1] * 62, C.vel, 5);
    mk += L.circle(pos[0], pos[1], 9, "#f8fafc");
    mk += L.text(710, 290, SHAPE_NAMES[st.shape], {size: 15, color: C.text, anchor: "end", weight: 700});
    mk += L.text(710, 312, n ? "direction changes " + n + " times per round" : "direction changes continuously", {size: 14, color: C.muted, anchor: "end"});
    L.svg(mk, "Athlete on a " + SHAPE_NAMES[st.shape] + " track, " + L.num(f * 100, 0) + " percent of one round completed.", 320);

    var chord = Math.sqrt(Math.pow(pos[0] - start[0], 2) + Math.pow(pos[1] - start[1], 2)) / RP * R;
    L.readout([
      ["Time", L.num(t, 1) + " s"],
      ["Speed (constant)", L.num(perim / 16, 2) + " m s⁻¹"],
      ["Distance run", L.num(f * perim, 1) + " m", C.path],
      ["Displacement from start", L.num(chord, 1) + " m", C.disp],
      ["Changes of direction so far", n ? String(turns) : (t > 0 ? "continuous" : "0"), C.vel]
    ]);
    L.verdict(t <= 0 ? "Press <b>Play</b>. The track fits inside a circle of radius 20 m; the athlete takes 16 s per round."
      : t >= 16 - 1e-6 ? (n ? "One round: the speed never changed, but the direction of velocity changed <b>" + n + " times</b>. Increase the number of sides." : "<b>Uniform circular motion:</b> the speed stayed constant, but the direction of velocity changed <b>continuously</b>. So the velocity was changing all the time: uniform circular motion is <b>accelerated motion</b>. After one round, distance = 2πR ≈ 125.7 m but displacement = 0.")
      : "Speed is constant. The velocity arrow points along the direction of motion" + (n ? " and only turns at the corners." : ", along the tangent, and turns at every instant."));
  }

  function drawMarble(t){
    var T = 3, w = 2 * Math.PI / T, vpx = w * RP, mk = "";
    var rel = st.released && t >= st.relT;
    var thAt = function(tt){ return -Math.PI / 2 + w * tt; };
    mk += L.circle(CX, CY, RP + 10, "none", ' stroke="' + (rel ? "rgba(148,163,184,0.25)" : "#cbd5e1") + '" stroke-width="12"' + (rel ? ' stroke-dasharray="6 8"' : ''));
    if(rel) mk += L.text(CX, CY + 6, "ring lifted", {size: 15, color: C.muted});
    var th = rel ? thAt(st.relT) : thAt(t);
    var P = [CX + RP * Math.cos(th), CY + RP * Math.sin(th)], D = [-Math.sin(th), Math.cos(th)];
    var M = P;
    if(rel){
      var dd = vpx * (t - st.relT);
      M = [P[0] + D[0] * dd, P[1] + D[1] * dd];
      mk += L.line(P[0] - D[0] * 400, P[1] - D[1] * 400, P[0] + D[0] * 700, P[1] + D[1] * 700, C.path, 2, "8 6");
      mk += L.circle(P[0], P[1], 5, C.path) + L.text(P[0] + 12, P[1] - 10, "released here", {size: 13, color: C.path, anchor: "start"});
      mk += L.line(P[0], P[1], M[0], M[1], "rgba(248,250,252,0.5)", 3);
    }
    mk += L.arrow(M[0], M[1], M[0] + D[0] * 60, M[1] + D[1] * 60, C.vel, 5);
    mk += L.circle(M[0], M[1], 10, "#e2e8f0", ' stroke="#64748b" stroke-width="2"');
    L.svg(mk, rel ? "Marble released: moving in a straight line along the tangent." : "Marble moving round inside the ring.", 320);
    L.readout([
      ["Time", L.num(t, 2) + " s"],
      ["Marble", rel ? "released at t = " + L.num(st.relT, 2) + " s" : "rolling inside the ring"],
      ["Speed", "constant", C.vel],
      ["Direction of velocity", rel ? "fixed (straight line)" : "changing every instant", C.vel]
    ]);
    L.verdict(!st.released ? "The ring keeps turning the marble's direction. What will happen when you lift it? Make your prediction, then press <b>Lift the ring</b>."
      : !rel ? "The ring will be lifted at t = " + L.num(st.relT, 2) + " s."
      : "<b>Activity 4.5:</b> once released, the marble moves in a <b>straight line along the tangent</b> at the release point: it keeps moving in the direction it had at that instant. The velocity in circular motion is always along the tangent.");
  }

  function drawClock(t){
    var th = 2 * Math.PI * t / 60, r = 7, mk = "";
    var tip = function(a, rr){ return [CX + rr * Math.sin(a), CY - rr * Math.cos(a)]; };
    mk += L.circle(CX, CY, RP + 26, "#0f2233", ' stroke="#b5654a" stroke-width="8"');
    for(var h = 1; h <= 12; h++){
      var p = tip(h * Math.PI / 6, RP + 8);
      mk += L.text(p[0], p[1] + 5, String(h), {size: 14, color: C.muted, weight: 700});
    }
    var pts = [], lap1 = Math.min(th, 2 * Math.PI);
    for(var k = 0; k <= 120; k++){ var p1 = tip(lap1 * k / 120, RP - 6); pts.push(p1.join(",")); }
    if(t > 0) mk += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="4"/>';
    if(th > 2 * Math.PI){
      var pts2 = [];
      for(var q = 0; q <= 90; q++){ var p2 = tip((th - 2 * Math.PI) * q / 90, RP - 20); pts2.push(p2.join(",")); }
      mk += '<polyline points="' + pts2.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="4" stroke-dasharray="7 5"/>';
      mk += L.text(CX, CY + 60, "second round", {size: 12, color: C.path});
    }
    var hourA = (6 + t / 60) * Math.PI / 6, hp = tip(hourA, 55);
    mk += L.line(CX, CY, hp[0], hp[1], "#94a3b8", 7);
    var mp = tip(th, RP - 6), sp = tip(0, RP - 6);
    mk += L.line(CX, CY, mp[0], mp[1], C.vel, 4) + L.circle(CX, CY, 6, "#f8fafc");
    var chordPx = Math.sqrt(Math.pow(mp[0] - sp[0], 2) + Math.pow(mp[1] - sp[1], 2));
    if(chordPx > 4) mk += L.arrow(sp[0], sp[1], mp[0], mp[1], C.disp, 4);
    mk += L.circle(mp[0], mp[1], 6, "#f8fafc");
    mk += L.text(710, 70, "minute hand R = 7 cm", {size: 14, color: C.text, anchor: "end"});
    mk += L.text(710, 94, "one round = 2πR = 44 cm", {size: 14, color: C.muted, anchor: "end"});
    L.svg(mk, "Clock at " + Math.round(t) + " minutes past 6 PM.", 320);

    var dist = t / 60 * 44, disp = 2 * r * Math.abs(Math.sin(th / 2)), secs = t * 60;
    L.readout([
      ["Elapsed", Math.round(t) + " min = " + Math.round(secs) + " s"],
      ["Distance of tip", L.num(dist, 1) + " cm", C.path],
      ["Displacement of tip", L.num(disp, 1) + " cm", C.disp],
      ["Average speed so far", t > 0 ? L.num(dist / secs, 4) + " cm s⁻¹" : "—"],
      ["Average velocity so far", t > 0 ? L.num(disp / secs, 4) + " cm s⁻¹" : "—"]
    ]);
    L.verdict(t <= 0 ? "Press <b>Play</b>. At 6:00 PM the minute hand points to 12."
      : t >= 90 - 1e-6 ? "<b>Exercise Q16 (6:00 → 7:30 PM, 1.5 rounds):</b> (i) distance = 1.5 × 44 = <b>66 cm</b>; (ii) displacement = diameter = <b>14 cm</b>, from 12 towards 6; (iii) speed = 66 cm ÷ 5400 s ≈ <b>0.0122 cm s⁻¹</b>; (iv) velocity = 14 cm ÷ 5400 s ≈ <b>0.0026 cm s⁻¹</b>, from 12 towards 6."
      : Math.abs(t - 60) < 2.5 ? "At 7:00 PM the tip is back at 12: distance 44 cm, but displacement 0."
      : "The tip moves at constant speed; its displacement depends only on where it is now compared with 6:00.");
  }

  function draw(t){
    if(st.preset === "polygon") drawPolygon(t);
    else if(st.preset === "marble") drawMarble(t);
    else drawClock(t);
  }

  function mount(){
    L.presets([["polygon", "Fig. 4.23: polygon to circle"], ["marble", "Activity 4.5: marble in a ring"], ["clock", "Exercise Q16: Rohan's clock"]], st.preset, select);
    select(st.preset);
    App.pause();
    App.resetTimeline();
  }

  window.SIMS.circular = {mount: mount, draw: draw, select: select, state: st};
})();
