// iesc113 labs: Earth as a System. Drawings are schematic; values marked illustrative are not from the textbook.
var App = window.App; var LAB = window.LAB; window.SIMS = {};
function clamp13(x, a, b){ return Math.max(a, Math.min(b, x)); }
function box13(L, x, y, w, h, t1, col, op){ return '<g opacity="' + (op === undefined ? 1 : op).toFixed(2) + '">' + L.rect(x, y, w, h, "#1e293b", ' rx="10" stroke="' + col + '" stroke-width="2"') + L.text(x + w / 2, y + h / 2 + 5, t1, {size: 12, color: col, weight: 700}) + '</g>'; }

// Lab 1 — The five spheres (Activity 13.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "identify"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "identify" ? {maxT: 5, step: 1, speed: 1.2} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend([[C.path, "sphere or link"]]);
    L.watch({identify: "Activity 13.1 (Fig. 13.1): find one example of each sphere in a mountain scene.", snowfall: "Activity 13.1: three winters with less and less snow (values illustrative).", arabian: "Chapter introduction: what a warmer Arabian Sea can set off."}[id]);
    L.controls(""); L.restart(true);
  }
  function scene(m, snow, lake, grass, sheep){
    m += L.rect(0, 0, 720, 300, "#0b1220") + L.circle(640, 50, 22, "#facc15");
    m += '<polygon points="60,230 220,60 380,230" fill="#57534e"/><polygon points="260,230 420,90 580,230" fill="#78716c"/>';
    m += '<polygon points="' + (220 - 40 * snow) + ',' + (60 + 44 * snow) + ' 220,60 ' + (220 + 40 * snow) + ',' + (60 + 44 * snow) + '" fill="#f8fafc"/><polygon points="' + (420 - 34 * snow) + ',' + (90 + 36 * snow) + ' 420,90 ' + (420 + 34 * snow) + ',' + (90 + 36 * snow) + '" fill="#f8fafc"/>';
    m += L.rect(0, 230, 720, 70, "#3f6212") + '<ellipse cx="520" cy="262" rx="' + (40 + 90 * lake).toFixed(1) + '" ry="' + (8 + 18 * lake).toFixed(1) + '" fill="#38bdf8"/>';
    for(var i = 0; i < Math.round(20 * grass); i++) m += L.line(40 + i * 17, 290, 44 + i * 17, 276, "#84cc16", 2);
    for(var j = 0; j < sheep; j++) m += '<ellipse cx="' + (120 + j * 45) + '" cy="262" rx="14" ry="9" fill="#f1f5f9"/>' + L.circle(108 + j * 45, 258, 5, "#e2e8f0");
    return m;
  }
  function draw(t){
    var m = "", msg;
    if(st.preset === "identify"){
      var k = Math.floor(t + 1e-9);
      m = scene(m, 1, 1, 1, 3);
      [["cryosphere: snow", 220, 44], ["geosphere: mountains", 330, 200], ["hydrosphere: lake", 520, 222], ["atmosphere: air", 360, 20], ["biosphere: grass, sheep", 160, 222]].forEach(function(lb, j){ if(j < k || t >= 5) m += L.text(lb[1], lb[2], lb[0], {size: 13, color: C.path, weight: 700}); });
      L.svg(m, "Five spheres in one scene", 300);
      L.readout([["Found", Math.min(5, k) + " of 5 spheres", C.path], ["Linked by", "sunlight, moving air and water, nutrient cycling"]]);
      msg = t < 5 ? "Finding spheres…" : "All <b>five spheres</b> appear in one scene: snow, mountains, lake, air, and grass with sheep, all interacting.";
    } else if(st.preset === "snowfall"){
      var f = clamp13(t / 3, 0, 1), snow = 1 - 0.6 * f, lake = 1 - 0.55 * f, grass = 1 - 0.6 * f, sheepFood = Math.round(100 * grass);
      m = scene(m, snow, lake, grass, 3);
      m += L.text(360, 20, "winter " + (1 + Math.min(2, Math.floor(t))), {size: 14, color: C.text, weight: 700});
      L.svg(m, "Less snowfall over the years", 300);
      L.readout([["Snowfall", Math.round(100 * snow) + "% of normal"], ["Lake in summer", Math.round(100 * lake) + "% of normal", C.vel], ["Grass for sheep", sheepFood + "% of normal", C.danger]]);
      msg = t < 3 ? "Years passing…" : "Less snow → less meltwater → a smaller lake → less grass → <b>less food for the sheep</b> (values illustrative).";
    } else {
      var chain = [["warmer Arabian Sea", 40, 40], ["more evaporation", 260, 40], ["variable southwest monsoon", 480, 40], ["floods in some regions", 380, 130], ["droughts in others", 580, 130], ["warmer air", 40, 200], ["glaciers and polar ice melt", 260, 200], ["sea level rises", 480, 200]];
      chain.forEach(function(c, j){ var op = clamp13(t * 3 - j * 0.35, 0, 1); m += box13(L, c[1], c[2], 190, 50, c[0], j < 5 ? C.vel : C.path, op); });
      [[230, 65, 258, 65], [450, 65, 478, 65], [560, 92, 480, 128], [600, 92, 660, 128], [230, 225, 258, 225], [450, 225, 478, 225]].forEach(function(a, j){ if(t > 0.4 + j * 0.35) m += L.arrow(a[0], a[1], a[2], a[3], C.faint, 2); });
      L.svg(m, "A chain of effects", 280);
      L.readout([["Hydrosphere", "warmer sea, floods, sea-level rise", C.vel], ["Atmosphere", "more moisture, warmer air"], ["Cryosphere", "melting ice", C.path], ["Biosphere", "habitat loss, crops affected", C.danger]]);
      msg = t < 3 ? "Following the chain…" : "A warmer sea spreads through the atmosphere, hydrosphere, cryosphere and biosphere: <b>floods in some regions, drought in others</b>, and rising seas.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["identify", "Activity 13.1: find the spheres"], ["snowfall", "Less snowfall"], ["arabian", "A warmer Arabian Sea"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.spheres = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 2 — Solar radiation (Section 13.1, Fig. 13.2, Example 13.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "spectrum", area: 1, hours: 1};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "spectrum" ? [["#a855f7", "ultraviolet"], ["#facc15", "visible"], ["#ef4444", "infrared"]] : [[C.path, "solar energy"]]);
    L.watch({spectrum: "Fig. 13.2: the electromagnetic spectrum and where the Sun's energy lies.", budget: "Section 13.1: sunlight above the atmosphere and at the ground on a clear day.", ex131: "Example 13.1: choose an area and a time at an insolation of 1 kW m⁻².", thar: "Think as a Scientist: a rough estimate with assumed values (about 1,700 TWh a year, 5 kWh per m² per day, 20% efficient panels)."}[id]);
    if(id === "ex131"){
      L.controls(L.slider("in-a", "Area", 1, 10, 1, st.area, st.area + " m²") + L.slider("in-h", "Time", 1, 10, 1, st.hours, st.hours + " h"));
      L.onInput("in-a", function(v){ st.area = v; L.setVal("in-a", v + " m²"); App.resetTimeline(); App.play(); });
      L.onInput("in-h", function(v){ st.hours = v; L.setVal("in-h", v + " h"); App.resetTimeline(); App.play(); });
    } else L.controls("");
    L.restart(true);
  }
  function draw(t){
    var m = "", msg, f = clamp13(t / 1.5, 0, 1);
    if(st.preset === "spectrum"){
      var bands = [["gamma rays", "#64748b"], ["X-rays", "#64748b"], ["UV", "#a855f7"], ["visible", "#facc15"], ["IR", "#ef4444"], ["microwaves", "#64748b"], ["radio waves", "#64748b"]];
      bands.forEach(function(b, j){ m += L.rect(30 + j * 95, 120, 90, 50, b[1], ' rx="6"') + L.text(75 + j * 95, 150, b[0], {size: 11, color: "#0f172a", weight: 700}); });
      m += L.text(30, 105, "higher frequency, shorter wavelength", {size: 11, color: C.muted, anchor: "start"}) + L.text(690, 105, "lower frequency, longer wavelength", {size: 11, color: C.muted, anchor: "end"});
      if(f > 0.3) m += L.rect(215, 185, 280, 34, "none", ' rx="8" stroke="' + C.path + '" stroke-width="3"') + L.text(355, 208, "about 99% of the Sun's energy", {size: 13, color: C.path, weight: 700});
      if(f > 0.7) m += L.text(125, 250, "filtered high in the atmosphere", {size: 11, color: C.muted}) + L.text(260, 250, "UV: mostly absorbed by ozone", {size: 11, color: "#c084fc"}) + L.text(590, 250, "carry very little energy", {size: 11, color: C.muted});
      L.svg(m, "Electromagnetic spectrum", 280);
      L.readout([["UV", "mostly absorbed by the ozone layer", "#a855f7"], ["Visible", "photosynthesis; warms land and water", "#facc15"], ["IR", "warms the surface; re-radiated heat partly trapped", "#ef4444"]]);
      msg = t < 2 ? "Scanning the spectrum…" : "About <b>99%</b> of the Sun's energy reaching Earth is ultraviolet, visible and infrared light.";
    } else if(st.preset === "budget"){
      m += L.rect(0, 70, 720, 10, "#334155") + L.text(700, 64, "top of the atmosphere", {size: 11, color: C.muted, anchor: "end"}) + L.rect(0, 250, 720, 40, "#3f6212") + L.text(700, 244, "ground", {size: 11, color: C.muted, anchor: "end"});
      var y = 20 + 220 * f, w = 60 - 17 * clamp13((y - 80) / 170, 0, 1);
      m += L.rect(330 - w / 2, 10, w, y - 10, "#facc15", ' opacity="0.8"') + L.text(250, 60, "≈ 1.4 kW m⁻²", {size: 14, color: "#facc15", weight: 700, anchor: "end"});
      if(f >= 1) m += L.text(250, 240, "≈ 1 kW m⁻² (clear sky)", {size: 14, color: "#fde68a", weight: 700, anchor: "end"}) + L.text(430, 160, "some absorbed and scattered by gases, clouds and dust", {size: 12, color: C.muted, anchor: "start"});
      L.svg(m, "Sunlight through the atmosphere", 300);
      L.readout([["Solar constant (top of atmosphere)", "≈ 1.4 kW m⁻² = 1400 J s⁻¹ m⁻²", "#facc15"], ["Maximum insolation at the ground", "≈ 1 kW m⁻²", "#fde68a"]]);
      msg = t < 2 ? "Sunlight travelling down…" : "About <b>1.4 kW m⁻²</b> arrives above the atmosphere; about 1 kW m⁻² reaches the ground on a clear day.";
    } else if(st.preset === "ex131"){
      var E = 1000 * st.area * 3600 * st.hours, Eshow = E * f;
      for(var i = 0; i < st.area; i++) m += L.rect(60 + i * 60, 190, 50, 50, "#1d4ed8", ' stroke="#93c5fd"');
      m += L.rect(60, 100, 600 * Math.min(1, Eshow / 3.6e8), 30, C.path, ' rx="6"') + L.text(60, 90, "energy received: " + (Eshow / 1e6).toFixed(1) + " × 10⁶ J", {size: 14, color: C.path, anchor: "start", weight: 700});
      m += L.text(360, 280, "1 kW m⁻² × " + st.area + " m² × " + st.hours + " h", {size: 13, color: C.muted});
      L.svg(m, "Solar energy on panels", 300);
      L.readout([["Area", st.area + " m²"], ["Time", st.hours + " h = " + 3600 * st.hours + " s"], ["Energy", (E / 1e6).toFixed(1) + " × 10⁶ J = " + (E / 3.6e6) + " kWh", C.path]]);
      msg = "E = 1000 J s⁻¹ m⁻² × " + st.area + " m² × " + 3600 * st.hours + " s = <b>" + (E / 1e6).toFixed(1) + " × 10⁶ J</b>, that is " + (E / 3.6e6) + " unit" + (E === 3.6e6 ? "" : "s") + " of electricity.";
    } else {
      var need = 1.7e12 / (5 * 365 * 0.2) / 1e6;
      m += L.rect(80, 40, 240, 240, "#d6b370") + L.text(200, 30, "Thar desert ≈ 2,00,000 km²", {size: 13, color: C.text});
      var side = 240 * Math.sqrt(need / 200000) * f;
      m += L.rect(80, 40, side, side, "#1d4ed8");
      m += L.text(360, 90, "India's electricity ≈ 1.7 × 10¹² kWh a year", {size: 13, color: C.text, anchor: "start"}) + L.text(360, 130, "each m² gives 5 × 365 × 0.2 = 365 kWh", {size: 13, color: C.text, anchor: "start"}) + L.text(360, 170, "panels needed ≈ " + (f >= 1 ? Math.round(need / 100) * 100 : "…") + " km²", {size: 15, color: C.path, anchor: "start", weight: 700}) + L.text(360, 210, "≈ " + (f >= 1 ? (100 * need / 200000).toFixed(1) : "…") + "% of the Thar", {size: 15, color: C.path, anchor: "start", weight: 700});
      L.svg(m, "Solar panels in the Thar", 300);
      L.readout([["Assumed use", "1,700 TWh a year"], ["Assumed insolation and efficiency", "5 kWh m⁻² per day, 20%"], ["Panel area", "≈ 4,700 km² (about 2% of the Thar)", C.path]]);
      msg = t < 2 ? "Estimating…" : "About <b>4,700 km²</b> of panels, roughly 2% of the Thar (more with spacing), could supply India's electricity, with these assumed numbers.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["spectrum", "Fig. 13.2: EM spectrum"], ["budget", "Solar constant and insolation"], ["ex131", "Example 13.1"], ["thar", "Think as a Scientist: Thar"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.insolation = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 3 — Albedo, heat islands and houses (Section 13.1.1, Table 13.1)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "table"};
  var SURF = [["snow", 0.85, "Table 13.1: 0.80–0.90"], ["ice", 0.6, "Table 13.1: 0.50–0.70"], ["crushed rock", 0.275, "Table 13.1: 0.25–0.30"], ["dry sand / light soil", 0.35, "typical ≈ 0.3–0.4"], ["black soil", 0.1, "typical ≈ 0.05–0.15"], ["ocean water", 0.06, "typical ≈ 0.06"]];
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "heatisland" ? {maxT: 24, step: 0.5, speed: 3, format: function(t){ return "hour <b>" + Math.round(t) + "</b>"; }} : {maxT: 2, step: 0.05, speed: 0.6});
    L.legend(id === "table" ? [["#facc15", "reflected"], [C.danger, "absorbed"]] : id === "heatisland" ? [[C.danger, "city"], [C.ok, "rural area"]] : [[C.danger, "heat re-radiated at night"]]);
    L.watch({table: "Table 13.1: albedo of surfaces (the first three from the textbook; the others typical values from standard references).", heatisland: "Fig. 13.6: air temperature in a city and nearby countryside over a summer day (curves illustrative).", houses: "Section 13.1.1: a concrete house and a thick-walled mud house at night."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i, f = clamp13(t / 1.5, 0, 1);
    if(st.preset === "table"){
      SURF.forEach(function(s, j){ var y = 30 + j * 42, w = 360; m += L.text(170, y + 20, s[0], {size: 12, color: C.text, anchor: "end"}) + L.rect(180, y + 4, w * s[1] * f, 24, "#facc15") + L.rect(180 + w * s[1] * f, y + 4, w * (1 - s[1]) * f, 24, C.danger, ' opacity="0.8"') + L.text(552, y + 21, f >= 1 ? s[1].toFixed(2) + " · " + s[2] : "", {size: 11, color: C.muted, anchor: "start"}); });
      L.svg(m, "Albedo of surfaces", 290);
      L.readout([["Snow reflects", "about 85% of sunlight", "#facc15"], ["Crushed rock absorbs", "about 72%", C.danger], ["Result", "high albedo stays cool; low albedo warms"]]);
      msg = t < 2 ? "Measuring reflection…" : "Snow reflects about 85% of sunlight and crushed rock under 30%: <b>low albedo surfaces absorb more and warm up</b>, while snow and ice keep polar regions cold.";
    } else if(st.preset === "heatisland"){
      var X = function(h){ return 70 + h * 25; }, Y = function(T){ return 260 - (T - 20) * 12; };
      var rural = function(h){ return 27 + 8 * Math.sin((h - 9) * Math.PI / 12); }, city = function(h){ return rural(h) + 1.5 + 2.5 * (0.5 + 0.5 * Math.cos((h - 3) * Math.PI / 12)); };
      m += L.line(70, 260, 670, 260, "#475569", 1.5) + L.line(70, 260, 70, 40, "#475569", 1.5);
      [0, 6, 12, 18, 24].forEach(function(h){ m += L.text(X(h), 278, h + ":00", {size: 11, color: C.muted}); });
      var pc = [], pr = [];
      for(var h = 0; h <= Math.min(24, t) + 1e-9; h += 0.5){ pc.push(X(h).toFixed(1) + "," + Y(city(h)).toFixed(1)); pr.push(X(h).toFixed(1) + "," + Y(rural(h)).toFixed(1)); }
      m += '<polyline points="' + pc.join(" ") + '" fill="none" stroke="' + C.danger + '" stroke-width="3"/><polyline points="' + pr.join(" ") + '" fill="none" stroke="' + C.ok + '" stroke-width="3"/>';
      var hh = clamp13(t, 0, 24);
      L.svg(m, "City and rural temperatures", 290);
      L.readout([["Hour", Math.round(hh) + ":00"], ["City", city(hh).toFixed(1) + " °C", C.danger], ["Rural area", rural(hh).toFixed(1) + " °C", C.ok], ["Difference", (city(hh) - rural(hh)).toFixed(1) + " °C"]]);
      msg = t < 24 ? "Through the day…" : "The city stays warmer than the countryside, <b>especially at night</b>, as concrete and asphalt re-radiate the heat they stored by day (curves illustrative).";
    } else {
      m += L.rect(0, 0, 720, 300, "#020617") + L.circle(640, 50, 18, "#e2e8f0") + L.rect(0, 240, 720, 60, "#1c1917");
      m += L.rect(90, 120, 200, 120, "#9ca3af") + '<polygon points="80,120 190,70 300,120" fill="#6b7280"/>' + L.text(190, 270, "concrete house", {size: 13, color: C.text});
      m += L.rect(430, 120, 200, 120, "#a16207") + '<polygon points="420,120 530,70 640,120" fill="#78350f"/>' + L.text(530, 270, "thick mud walls", {size: 13, color: C.text});
      for(i = 0; i < 6; i++){ var ph = (t * 0.9 + i / 6) % 1; m += '<path d="M' + (110 + i * 32) + ' ' + (180 - ph * 40) + ' q6 -8 0 -16" fill="none" stroke="' + C.danger + '" stroke-width="2.5" opacity="' + (1 - ph).toFixed(2) + '"/>'; }
      for(i = 0; i < 2; i++){ var ph2 = (t * 0.5 + i / 2) % 1; m += '<path d="M' + (500 + i * 60) + ' ' + (180 - ph2 * 30) + ' q6 -8 0 -16" fill="none" stroke="' + C.danger + '" stroke-width="2" opacity="' + (0.5 * (1 - ph2)).toFixed(2) + '"/>'; }
      L.svg(m, "Houses at night", 300);
      L.readout([["Concrete house at night", "re-radiates stored heat: feels hot", C.danger], ["Mud house at night", "re-radiates less: stays cool", C.ok]]);
      msg = t < 2 ? "Night falls…" : "The concrete house re-radiates the day's heat at night, while <b>thick mud walls stay cooler</b>, which is why traditional houses feel comfortable in summer.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["table", "Table 13.1: albedo"], ["heatisland", "Fig. 13.6: urban heat island"], ["houses", "Concrete and mud houses"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.albedo = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 4 — Latitude, atmospheric layers, greenhouse effect, ozone (Sections 13.1.2–13.1.3)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "latitude"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "layers" ? {maxT: 50, step: 1, speed: 12, format: function(t){ return "height <b>" + Math.round(t) + " km</b>"; }} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "greenhouse" ? [["#facc15", "incoming sunlight"], [C.danger, "outgoing infrared"]] : [[C.path, "highlighted"]]);
    L.watch({latitude: "Section 13.1.2: the same beam of sunlight at the equator and at 60° latitude (Sun overhead at the equator).", layers: "Fig. 13.7 and Table 13.2: climb through the atmosphere (temperatures from a simplified model starting at 15 °C).", greenhouse: "Section 13.1.3: no atmosphere, a natural greenhouse effect, then extra CO₂ (schematic).", ozone: "Threads of Curiosity: the ozone hole and the Montreal Protocol (schematic)."}[id]);
    L.controls(""); L.restart(true);
  }
  function tempAt(h){ return h <= 12 ? 15 - 6.5 * h : -63 + (h - 12) * 60 / 38; }
  function draw(t){
    var m = "", msg, i, f = clamp13(t / 1.5, 0, 1);
    if(st.preset === "latitude"){
      m += L.circle(420, 150, 120, "#1e3a8a") + L.line(300, 150, 540, 150, "#94a3b8", 1, "5 4") + L.text(555, 154, "equator", {size: 11, color: C.muted, anchor: "start"});
      var a60 = 60 * Math.PI / 180, px = 420 - 120 * Math.cos(a60), py = 150 - 120 * Math.sin(a60);
      m += L.rect(60, 140, 180 * f, 20, "#facc15", ' opacity="0.8"') + L.line(300, 140, 300, 160, "#fde047", 6);
      m += L.rect(60, py - 10, (px - 60) * f, 20, "#facc15", ' opacity="0.8"');
      if(f >= 1) m += '<line x1="' + (px - 17.3).toFixed(1) + '" y1="' + (py - 10).toFixed(1) + '" x2="' + (px + 17.3 * 0.2).toFixed(1) + '" y2="' + (py + 10 * 1.5).toFixed(1) + '" stroke="#fde047" stroke-width="6"/>' + L.text(px - 30, py - 20, "60° N", {size: 12, color: C.text, anchor: "end"});
      L.svg(m, "Sunlight at two latitudes", 300);
      L.readout([["At the equator", "beam falls on a small area: strong heating"], ["At 60° latitude", "same beam spreads over about 2× the area (1 ÷ cos 60°)", C.path], ["Result", "warm tropics, cold polar regions"]]);
      msg = t < 3 ? "Shining…" : "The same beam covers about <b>twice the area</b> at 60° latitude as at the equator, so each square metre there gets about half the energy.";
    } else if(st.preset === "layers"){
      var hk = clamp13(t, 0, 50), Y = function(h){ return 280 - h * 5; }, X = function(T){ return 470 + T * 3; };
      m += L.rect(0, Y(12), 330, Y(0) - Y(12), "#0c4a6e", ' opacity="0.5"') + L.rect(0, Y(50), 330, Y(12) - Y(50), "#312e81", ' opacity="0.45"') + L.text(20, Y(6), "troposphere (0–12 km): weather", {size: 12, color: C.text, anchor: "start"}) + L.text(20, Y(35), "stratosphere (12–50 km): ozone layer", {size: 12, color: C.text, anchor: "start"});
      m += L.line(470 - 63 * 3, 280, 470 + 20 * 3, 280, "#475569", 1) + L.line(470, 285, 470, 25, "#475569", 1, "4 4") + L.text(470, 296, "0 °C", {size: 10, color: C.muted});
      var pts = []; for(var h = 0; h <= 50; h += 1) pts.push(X(tempAt(h)).toFixed(1) + "," + Y(h).toFixed(1));
      m += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="3"/>' + L.circle(X(tempAt(hk)), Y(hk), 7, "#f8fafc") + L.circle(250, Y(hk), 8, "#f8fafc");
      L.svg(m, "Layers of the atmosphere", 300);
      L.readout([["Height", Math.round(hk) + " km"], ["Layer", hk <= 12 ? "troposphere" : "stratosphere", C.path], ["Temperature (model)", tempAt(hk).toFixed(0) + " °C"]]);
      msg = t < 50 ? "Climbing…" : "Temperature falls about 6.5 °C per km in the troposphere, then <b>rises in the stratosphere</b>, where ozone absorbs UV (simplified model).";
    } else if(st.preset === "greenhouse"){
      var stage = t < 1 ? 0 : t < 2 ? 1 : 2, trap = [0, 0.4, 0.7][stage];
      m += L.circle(360, 330, 150, "#1e3a8a") + (stage > 0 ? '<circle cx="360" cy="330" r="' + (190 + stage * 5) + '" fill="none" stroke="#94a3b8" stroke-width="' + (6 + stage * 8) + '" opacity="0.35"/>' : "");
      for(i = 0; i < 5; i++){ var ph = (t * 0.8 + i / 5) % 1; m += L.arrow(200 + i * 80, 10 + ph * 150, 200 + i * 80, 30 + ph * 150, "#facc15", 3); }
      for(i = 0; i < 6; i++){ var q = (t * 0.7 + i / 6) % 1, bx = 220 + i * 55, trapped = i / 6 < trap, yy = trapped ? 170 - 50 * Math.sin(q * Math.PI) : 180 - q * 170; m += L.circle(bx, yy, 5, C.danger, ' opacity="' + (trapped ? 0.9 : 1 - q).toFixed(2) + '"'); }
      m += L.text(360, 290, ["no atmosphere: heat escapes, too cold", "natural greenhouse effect: suitable for life", "extra CO₂: more heat trapped, warming"][stage], {size: 14, color: stage === 1 ? C.ok : stage === 2 ? C.danger : C.vel, weight: 700});
      L.svg(m, "Greenhouse effect", 300);
      L.readout([["Stage", ["no atmosphere", "natural greenhouse gases", "extra CO₂"][stage]], ["Outgoing infrared trapped", ["none", "some", "more"][stage], C.danger], ["Surface", ["too cold for life", "warm enough for life", "warming"][stage], stage === 1 ? C.ok : C.danger]]);
      msg = t < 3 ? "Adding the atmosphere…" : "Greenhouse gases keep Earth warm enough for life, but <b>extra CO₂ traps more heat</b> and causes global warming.";
    } else {
      var phase = clamp13(t, 0, 3), hole = phase < 1.5 ? phase / 1.5 : 1 - 0.5 * (phase - 1.5) / 1.5;
      m += L.circle(360, 160, 110, "#1e3a8a") + '<circle cx="360" cy="160" r="125" fill="none" stroke="#a78bfa" stroke-width="14" opacity="0.6"/>';
      m += '<ellipse cx="360" cy="270" rx="' + (10 + 70 * hole).toFixed(1) + '" ry="' + (4 + 12 * hole).toFixed(1) + '" fill="#020617" stroke="#ef4444" stroke-width="2"/>' + L.text(360, 298, "Antarctica", {size: 11, color: C.muted});
      [["CFCs from refrigerators and aerosols", 0], ["ozone hole over Antarctica", 1], ["Montreal Protocol cuts CFCs", 1.6], ["ozone layer slowly recovering", 2.4]].forEach(function(e, j){ if(t >= e[1]) m += L.text(20, 40 + j * 30, (j + 1) + ". " + e[0], {size: 12, color: j < 2 ? C.danger : C.ok, anchor: "start"}); });
      L.svg(m, "Ozone hole and recovery", 300);
      L.readout([["Cause", "CFCs destroying ozone", C.danger], ["Effect", "more UV reaching the surface"], ["Response", "Montreal Protocol", C.ok]]);
      msg = t < 3 ? "Decades passing…" : "CFCs thinned the ozone layer over Antarctica; after the <b>Montreal Protocol</b> cut CFCs, the ozone layer began slowly recovering.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["latitude", "Sunlight and latitude"], ["layers", "Fig. 13.7: layers"], ["greenhouse", "Greenhouse effect"], ["ozone", "Ozone hole"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.atmosphere = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 5 — Winds and ocean currents (Section 13.2, Figs. 13.8–13.10)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "valley"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "gyres" ? [[C.danger, "warm water"], [C.vel, "cold water"]] : id === "belts" ? [[C.danger, "rising air (low pressure)"], [C.vel, "sinking air (high pressure)"]] : [[C.path, "air flow"]]);
    L.watch({valley: "Fig. 13.8 (a): a mountain valley on a sunny day.", mountain: "Fig. 13.8 (b): the same valley at night.", belts: "Fig. 13.9: pressure belts and the deflection of winds (schematic).", gyres: "Fig. 13.10 (a): ocean gyres in the two hemispheres (schematic)."}[id]);
    L.controls(""); L.restart(true);
  }
  function valley(m, night){ return m + L.rect(0, 0, 720, 300, night ? "#020617" : "#0c4a6e") + (night ? L.circle(620, 50, 16, "#e2e8f0") : L.circle(620, 50, 26, "#facc15")) + '<polygon points="0,280 180,70 360,260 540,70 720,280" fill="#57534e"/>' + L.rect(0, 260, 720, 40, "#3f6212"); }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "valley" || st.preset === "mountain"){
      var night = st.preset === "mountain";
      m = valley(m, night);
      for(i = 0; i < 6; i++){
        var ph = (t * 0.6 + i / 6) % 1, side = i % 2 ? 1 : -1, s = night ? ph : 1 - ph;
        var x = 360 + side * (20 + 150 * s), y = 250 - 170 * s;
        m += L.circle(x, y, 5, night ? C.vel : C.danger);
      }
      m += night ? L.arrow(230, 150, 300, 230, C.vel, 3) + L.arrow(490, 150, 420, 230, C.vel, 3) : L.arrow(300, 230, 230, 150, C.path, 3) + L.arrow(420, 230, 490, 150, C.path, 3);
      m += L.text(360, 40, night ? "cold, dense air sinks down the slopes" : "warm air rises over sunlit slopes", {size: 14, color: C.text, weight: 700});
      L.svg(m, night ? "Mountain breeze at night" : "Valley breeze by day", 300);
      L.readout(night ? [["Slopes", "cool faster after sunset"], ["Valley floor", "stays relatively warmer"], ["Breeze", "down the slopes: mountain breeze", C.vel]] : [["Slopes", "heat faster in sunlight"], ["Air over slopes", "warm, rising: low pressure"], ["Breeze", "up the slopes: valley breeze", C.path]]);
      msg = t < 3 ? "Air moving…" : night ? "At night the slopes cool faster and cold, dense air slides down into the valley: a <b>mountain breeze</b>." : "By day warm air rises over the sunlit slopes and cooler air moves up from the valley: a <b>valley breeze</b>.";
    } else if(st.preset === "belts"){
      var cx = 300, cy = 150, R = 120;
      m += L.circle(cx, cy, R, "#1e3a8a");
      [[0, "L", C.danger, "equatorial low"], [30, "H", C.vel, "sub-tropical high"], [60, "L", C.danger, "sub-polar low"], [90, "H", C.vel, "polar high"]].forEach(function(b){
        [1, -1].forEach(function(sg){
          if(b[0] === 0 && sg < 0) return;
          var a = sg * b[0] * Math.PI / 180, y = cy - R * Math.sin(a), half = R * Math.cos(a);
          m += L.line(cx - half, y, cx + half, y, "#94a3b8", 1, "4 4") + L.text(cx + half + 12, y + 4, b[1] + " " + (b[0] ? b[0] + "°" + (sg > 0 ? "N" : "S") : "0°"), {size: 12, color: b[2], anchor: "start", weight: 700}) + (sg > 0 || b[0] === 0 ? L.text(cx + half + 60, y + 4, b[3], {size: 11, color: C.muted, anchor: "start"}) : "");
        });
      });
      var ph = (t * 0.5) % 1;
      [[15, 1], [-15, -1]].forEach(function(w){ var y = cy - R * Math.sin(w[0] * Math.PI / 180), x = cx + 60 - 120 * ph; m += '<path d="M' + (x + 30).toFixed(1) + ' ' + (y - w[1] * 12).toFixed(1) + ' Q' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ' + (x - 30).toFixed(1) + ' ' + (y + w[1] * 2).toFixed(1) + '" fill="none" stroke="#fde68a" stroke-width="3"/>'; });
      L.svg(m, "Pressure belts", 300);
      L.readout([["Low pressure", "0° and 60°", C.danger], ["High pressure", "30° and the poles", C.vel], ["Deflection", "right in the Northern Hemisphere, left in the Southern"]]);
      msg = t < 3 ? "Circulating…" : "Low pressure at 0° and 60°, high at 30° and the poles; winds curve <b>right in the Northern Hemisphere</b> and left in the Southern.";
    } else {
      m += L.rect(40, 20, 640, 260, "#0c4a6e", ' rx="12"') + L.line(40, 150, 680, 150, "#94a3b8", 1, "5 4") + L.text(670, 145, "equator", {size: 11, color: C.muted, anchor: "end"});
      [[85, 1, "Northern: clockwise"], [215, -1, "Southern: anticlockwise"]].forEach(function(g){
        m += '<ellipse cx="360" cy="' + g[0] + '" rx="220" ry="45" fill="none" stroke="#475569" stroke-width="1.5"/>' + L.text(360, g[0] + 5, g[2], {size: 12, color: C.text});
        for(i = 0; i < 12; i++){ var a = g[1] * (t * 1.2 + i * Math.PI / 6), x = 360 + 220 * Math.cos(a), y = g[0] + 45 * Math.sin(a), warm = g[1] > 0 ? Math.sin(a) > 0 === false : Math.sin(a) > 0; m += L.circle(x, y, 5, warm ? C.danger : C.vel); }
      });
      L.svg(m, "Ocean gyres", 300);
      L.readout([["Northern Hemisphere gyres", "clockwise"], ["Southern Hemisphere gyres", "anticlockwise"], ["Effect", "carry heat poleward (e.g. North Atlantic Drift)", C.path]]);
      msg = t < 3 ? "Currents flowing…" : "Gyres turn <b>clockwise in the Northern Hemisphere</b> and anticlockwise in the Southern, carrying warm water towards the poles and cold water back.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["valley", "Fig. 13.8 (a): valley breeze"], ["mountain", "Fig. 13.8 (b): mountain breeze"], ["belts", "Fig. 13.9: pressure belts"], ["gyres", "Fig. 13.10: gyres"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.winds = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 6 — Biogeochemical cycles (Section 13.3, Figs. 13.12–13.16)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "water"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline(id === "carbon" ? {maxT: 65, step: 1, speed: 15, format: function(t){ return "year <b>" + (1960 + Math.round(t)) + "</b>"; }} : {maxT: 3, step: 0.05, speed: 0.6});
    L.legend(id === "carbon" ? [[C.path, "CO₂ concentration"]] : [[C.path, "matter moving"]]);
    L.watch({water: "Fig. 13.12: the water cycle.", carbon: "Fig. 13.14: the Keeling curve (end values from the textbook; the curve's shape and seasonal wiggle are drawn schematically).", nitrogen: "Fig. 13.15: the nitrogen cycle and the bacteria at each step.", oxygen: "Fig. 13.16: oxygen produced and used (bars illustrative)."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "water"){
      m += L.rect(0, 0, 720, 300, "#0b1220") + L.rect(0, 220, 320, 80, "#0369a1") + '<polygon points="380,230 520,90 660,230" fill="#57534e"/>' + L.rect(320, 230, 400, 70, "#3f6212") + '<ellipse cx="360" cy="50" rx="90" ry="26" fill="#cbd5e1"/>' + L.rect(360, 250, 300, 12, "#1e3a8a", ' opacity="0.7"');
      var labels = [["evaporation", 160, 150], ["transpiration", 330, 180], ["condensation", 360, 95], ["precipitation", 540, 70], ["run-off", 470, 215], ["groundwater", 510, 280]];
      labels.forEach(function(lb, j){ if(t >= j * 0.45) m += L.text(lb[1], lb[2], lb[0], {size: 12, color: C.path, weight: 700}); });
      for(i = 0; i < 8; i++){ var ph = (t * 0.4 + i / 8) % 1, x, y; if(ph < 0.3){ x = 120 + ph * 300; y = 220 - ph * 500; } else if(ph < 0.55){ x = 210 + (ph - 0.3) * 1200; y = 70; } else if(ph < 0.8){ x = 510; y = 70 + (ph - 0.55) * 600; } else { x = 510 - (ph - 0.8) * 1500; y = 220; } m += L.circle(x, y, 4, "#7dd3fc"); }
      L.svg(m, "Water cycle", 300);
      L.readout([["Into the air", "evaporation, transpiration"], ["Back down", "condensation, precipitation"], ["On land", "run-off, infiltration to groundwater", C.path]]);
      msg = t < 3 ? "Cycling…" : "Evaporation, condensation, precipitation and run-off carry water round <b>the water cycle</b>, linking sea, air, ice, land and life.";
    } else if(st.preset === "carbon"){
      var X = function(y){ return 70 + (y - 1960) * 9; }, Y = function(p){ return 270 - (p - 300) * 1.8; };
      var ppm = function(y){ return 315 + 105 * Math.pow((y - 1960) / 63, 1.45) + 3 * Math.sin((y - 1960) * 2 * Math.PI); };
      m += L.line(70, 270, 670, 270, "#475569", 1.5) + L.line(70, 270, 70, 30, "#475569", 1.5);
      [1960, 1980, 2000, 2020].forEach(function(y){ m += L.text(X(y), 288, String(y), {size: 11, color: C.muted}); });
      [320, 360, 400, 440].forEach(function(p){ m += L.text(64, Y(p) + 4, String(p), {size: 11, color: C.muted, anchor: "end"}); });
      var yr = 1960 + clamp13(t, 0, 65), pts = [];
      for(var y = 1960; y <= yr + 1e-9; y += 0.25) pts.push(X(y).toFixed(1) + "," + Y(ppm(y)).toFixed(1));
      m += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C.path + '" stroke-width="2"/>' + L.text(80, 40, "CO₂ (ppm)", {size: 11, color: C.muted, anchor: "start"});
      var smooth = 315 + 105 * Math.pow((yr - 1960) / 63, 1.45);
      L.svg(m, "Keeling curve", 300);
      L.readout([["Year", String(Math.round(yr))], ["CO₂ (smoothed)", Math.round(smooth) + " ppm", C.path], ["Rise since 1960", "about " + Math.round(100 * (smooth - 315) / 315) + "%"]]);
      msg = t < 65 ? "Year by year…" : "CO₂ rose from about 315 ppm in 1960 to about <b>420 ppm</b>, roughly one-third higher; the seasonal wiggle comes from plant growth in the Northern Hemisphere.";
    } else if(st.preset === "nitrogen"){
      var steps = [["N₂ in air", "fixation: Rhizobium, Azotobacter"], ["ammonia", "nitrification: Nitrosomonas"], ["nitrite", "nitrification: Nitrobacter"], ["nitrate", "assimilation by plants → animals"], ["organisms, wastes", "ammonification: decomposers"], ["nitrate in soil", "denitrification: Pseudomonas"]];
      var k = Math.min(5, Math.floor(t * 2 + 1e-9));
      steps.forEach(function(s, j){ var a = -Math.PI / 2 + j * Math.PI / 3, x = 360 + 190 * Math.cos(a), y = 150 + 110 * Math.sin(a), on = j <= k; m += box13(L, x - 75, y - 20, 150, 40, s[0], on ? C.path : "#475569") + (on ? L.text(x, y + 34, s[1], {size: 10, color: C.muted}) : ""); });
      L.svg(m, "Nitrogen cycle", 300);
      L.readout([["Fixation", "Rhizobium, Azotobacter, lightning"], ["Nitrification", "Nitrosomonas, Nitrobacter"], ["Denitrification", "Pseudomonas", C.path]]);
      msg = t < 3 ? "Following nitrogen…" : "Fixation (Rhizobium, Azotobacter) → nitrification (Nitrosomonas, Nitrobacter) → assimilation → ammonification → <b>denitrification (Pseudomonas)</b> returns N₂ to the air.";
    } else {
      var stage = t < 1.5 ? 0 : 1, prod = stage ? 70 : 100, use = stage ? 110 : 100;
      m += L.text(180, 40, "O₂ produced", {size: 13, color: C.ok, weight: 700}) + L.rect(120, 260 - prod * 2 * clamp13(t, 0, 1), 120, prod * 2 * clamp13(t, 0, 1), C.ok) + L.text(180, 285, "photosynthesis", {size: 11, color: C.muted});
      m += L.text(480, 40, "O₂ used", {size: 13, color: C.danger, weight: 700}) + L.rect(420, 260 - use * 2 * clamp13(t, 0, 1), 120, use * 2 * clamp13(t, 0, 1), C.danger) + L.text(480, 285, "respiration + combustion", {size: 11, color: C.muted});
      if(stage) m += L.text(360, 70, "more combustion, fewer forests (illustrative)", {size: 12, color: C.danger});
      L.svg(m, "Oxygen balance", 300);
      L.readout([["Production", "photosynthesis", C.ok], ["Use", "respiration, combustion", C.danger], ["Balance", stage ? "upset" : "steady"]]);
      msg = t < 3 ? "Comparing…" : "Photosynthesis releases O₂ while respiration and combustion use it: <b>the balance keeps oxygen cycling</b>. Burning more fuel and cutting forests tip that balance.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["water", "Fig. 13.12: water cycle"], ["carbon", "Fig. 13.14: Keeling curve"], ["nitrogen", "Fig. 13.15: nitrogen cycle"], ["oxygen", "Fig. 13.16: oxygen cycle"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.cycles = {mount: mount, draw: draw, select: select, state: st};
})();

// Lab 7 — Human impact and solutions (Section 13.4, Fig. 13.17)
(function(){
  var L = LAB, C = L.C;
  var st = {preset: "eutrophication"};
  function select(id){
    st.preset = id; L.markPreset(id);
    L.timeline({maxT: 3, step: 0.05, speed: 0.6});
    L.legend([[C.ok, "healthy"], [C.danger, "harmed"]]);
    L.watch({eutrophication: "Fig. 13.17: fertiliser run-off reaches a pond (values illustrative).", deforestation: "Section 13.4: a forest is cleared (bars illustrative).", acidification: "Section 13.4: extra CO₂ dissolving in the ocean (schematic).", solutions: "Section 13.4 and Mission LiFE: actions that help restore the balance."}[id]);
    L.controls(""); L.restart(true);
  }
  function draw(t){
    var m = "", msg, i;
    if(st.preset === "eutrophication"){
      var run = clamp13(t, 0, 1), bloom = clamp13(t - 0.8, 0, 1), oxy = 100 - 80 * clamp13(t - 1.5, 0, 1);
      m += L.rect(0, 0, 720, 120, "#3f6212") + '<ellipse cx="360" cy="200" rx="300" ry="80" fill="#0369a1"/>' + '<ellipse cx="360" cy="200" rx="' + (300 * bloom).toFixed(1) + '" ry="' + (80 * bloom).toFixed(1) + '" fill="#65a30d" opacity="0.8"/>';
      for(i = 0; i < 6; i++) m += L.arrow(100 + i * 100, 60, 100 + i * 100 + 20 * run, 60 + 70 * run, "#fde68a", 2);
      for(i = 0; i < 4; i++){ var dead = oxy < 40; m += '<ellipse cx="' + (250 + i * 70) + '" cy="' + (dead ? 150 : 210 + (i % 2) * 20) + '" rx="16" ry="7" fill="' + (dead ? "#94a3b8" : "#fb923c") + '"/>'; }
      m += L.text(360, 30, "fertiliser run-off", {size: 13, color: "#fde68a", weight: 700});
      L.svg(m, "Eutrophication", 300);
      L.readout([["Nitrates in pond", run >= 1 ? "high" : "rising", C.danger], ["Algae", bloom >= 1 ? "bloom covers the surface" : "growing"], ["Dissolved oxygen", Math.round(oxy) + "% (illustrative)", oxy < 40 ? C.danger : C.ok], ["Fish", oxy < 40 ? "dying" : "alive"]]);
      msg = t < 3 ? "Run-off entering…" : "Excess nitrates → algal bloom → oxygen used up → <b>fish die</b>: eutrophication. Using only the fertiliser crops need prevents it.";
    } else if(st.preset === "deforestation"){
      var cut = clamp13(t / 1.5, 0, 1), left = Math.round(12 * (1 - cut));
      m += L.rect(0, 220, 720, 80, "#78350f");
      for(i = 0; i < 12; i++){ var x = 40 + i * 30; if(i < left) m += L.rect(x - 3, 180, 6, 40, "#78350f") + L.circle(x, 170, 16, "#15803d"); else m += L.rect(x - 5, 212, 10, 8, "#a16207"); }
      [["photosynthesis", 1 - 0.8 * cut, C.ok], ["transpiration", 1 - 0.8 * cut, C.ok], ["local rainfall", 1 - 0.35 * cut, C.vel], ["soil erosion", 0.2 + 0.8 * cut, C.danger], ["habitats", 1 - 0.85 * cut, C.ok]].forEach(function(b, j){ var y = 30 + j * 36; m += L.text(520, y + 16, b[0], {size: 12, color: C.text, anchor: "end"}) + L.rect(530, y + 2, 160 * b[1], 20, b[2], ' rx="4"'); });
      L.svg(m, "Deforestation", 300);
      L.readout([["Trees left", left + " of 12"], ["Photosynthesis and transpiration", cut >= 1 ? "much less" : "falling", C.danger], ["Erosion", cut >= 1 ? "much more" : "rising", C.danger]]);
      msg = t < 3 ? "Clearing…" : "Fewer trees: <b>less photosynthesis and transpiration</b>, less local rain, changed albedo, more erosion and loss of habitats.";
    } else if(st.preset === "acidification"){
      var acid = clamp13(t / 2.5, 0, 1);
      m += L.rect(0, 0, 720, 100, "#0b1220") + L.rect(0, 100, 720, 200, "#0369a1");
      for(i = 0; i < 8; i++){ var ph = (t * 0.6 + i / 8) % 1; m += L.text(60 + i * 85, 20 + ph * 110, "CO₂", {size: 12, color: "#cbd5e1"}); }
      for(i = 0; i < 6; i++) m += '<path d="M' + (80 + i * 110) + ' 290 q10 -40 20 0 q10 -30 20 0" fill="' + (acid > 0.6 ? "#e5e7eb" : "#f97316") + '"/>';
      m += L.rect(600, 130, 30, 140, "#1e293b", ' rx="6"') + L.rect(600, 270 - 140 * acid, 30, 140 * acid, C.danger, ' rx="6"') + L.text(615, 125, "acidity", {size: 11, color: C.text});
      L.svg(m, "Ocean acidification", 300);
      L.readout([["CO₂ absorbed by ocean", "increasing"], ["Seawater", acid > 0.6 ? "more acidic" : "becoming more acidic", C.danger], ["Plankton and corals", acid > 0.6 ? "threatened" : "stressed", C.danger]]);
      msg = t < 3 ? "CO₂ dissolving…" : "Extra CO₂ dissolving in the ocean makes seawater <b>more acidic</b>, threatening plankton and coral reefs; warmer water also absorbs CO₂ less well.";
    } else {
      var acts = ["Montreal Protocol: ozone layer recovering", "switch to solar and wind energy", "plant and protect trees", "save water and energy", "sustainable farming", "reduce, reuse, recycle (Mission LiFE)"];
      acts.forEach(function(a, j){ var on = t >= j * 0.45; m += L.circle(40, 40 + j * 42, 10, on ? C.ok : "#334155") + L.text(60, 45 + j * 42, a, {size: 13, color: on ? C.text : C.muted, anchor: "start"}); });
      var bal = clamp13(t / 3, 0, 1);
      m += L.rect(500, 60, 40, 200, "#1e293b", ' rx="8"') + L.rect(500, 260 - 200 * (0.3 + 0.6 * bal), 40, 200 * (0.3 + 0.6 * bal), C.ok, ' rx="8"') + L.text(520, 285, "balance", {size: 12, color: C.text});
      L.svg(m, "Actions that help", 300);
      L.readout([["Global cooperation", "Montreal Protocol worked; Kyoto and Paris less successful"], ["Individuals", "save resources, reduce waste, recycle", C.ok]]);
      msg = t < 3 ? "Taking action…" : "Global cooperation and everyday actions <b>help restore the balance</b>: the ozone layer is already recovering.";
    }
    L.verdict(msg);
  }
  function mount(){ L.presets([["eutrophication", "Fig. 13.17: eutrophication"], ["deforestation", "Deforestation"], ["acidification", "Ocean acidification"], ["solutions", "Restoring the balance"]], st.preset, select); select(st.preset); App.pause(); App.resetTimeline(); }
  window.SIMS.impact = {mount: mount, draw: draw, select: select, state: st};
})();
