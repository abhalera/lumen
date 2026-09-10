(function () {
  "use strict";

  var App = window.App;
  window.SIMS = window.SIMS || {};

  function node(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function text(x, y, value, color, size, anchor) {
    return '<text x="' + x + '" y="' + y + '" fill="' + (color || "#f8fafc") +
      '" font-size="' + (size || 15) + '" text-anchor="' + (anchor || "middle") +
      '">' + esc(value) + "</text>";
  }

  function cell(label, value, color) {
    return '<div class="telemetry-cell"><div class="telemetry-label">' + label +
      '</div><div class="telemetry-val"' + (color ? ' style="color:' + color + '"' : "") +
      ">" + value + "</div></div>";
  }

  function shell(body) {
    return '<rect width="720" height="300" fill="#09131d"></rect>' + body;
  }

  function range(key, label, min, max, step, value, unit) {
    return '<label class="control"><span>' + label + ' <output data-math-output="' + key +
      '">' + value + " " + (unit || "") + '</output></span><input type="range" data-math-key="' +
      key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"></label>';
  }

  function select(key, label, options, value) {
    return '<label class="control"><span>' + label + '</span><select data-math-key="' + key + '">' +
      options.map(function (item) {
        return '<option value="' + item[0] + '"' + (String(item[0]) === String(value) ? " selected" : "") +
          ">" + item[1] + "</option>";
      }).join("") + "</select></label>";
  }

  function mountControls(state, controls, draw) {
    var box = node("lab-controls");
    if (!box) return;
    box.innerHTML = controls;
    box.querySelectorAll("[data-math-key]").forEach(function (input) {
      input.addEventListener("input", function () {
        state[input.getAttribute("data-math-key")] =
          input.tagName.toLowerCase() === "select" ? input.value : Number(input.value);
        var output = box.querySelector('[data-math-output="' + input.getAttribute("data-math-key") + '"]');
        if (output) output.textContent = input.value;
        draw(0);
      });
      input.addEventListener("change", function () {
        state[input.getAttribute("data-math-key")] =
          input.tagName.toLowerCase() === "select" ? input.value : Number(input.value);
        draw(0);
      });
    });
  }

  function mountBase(state, title, controls, draw, legend) {
    if (App && App.state) {
      App.state.maxT = 6;
      var scrubber = node("time-scrubber");
      if (scrubber) scrubber.max = 6;
    }
    var legendBox = node("lab-legend");
    if (legendBox) legendBox.innerHTML = '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8"></span><span>' + title + "</span></div>";
    if (legendBox && legend) legendBox.innerHTML += legend;
    mountControls(state, controls, draw);
    draw(0);
  }

  function install(id, title, initial, controls, renderer, legend) {
    var state = Object.assign({}, initial);
    function draw(t) {
      var result = renderer(state, t || 0);
      var diagram = node("diagram");
      if (diagram) {
        diagram.innerHTML = result.svg;
        diagram.setAttribute("aria-label", title);
      }
      var read = node("lab-readout");
      if (read) read.innerHTML = result.readout;
      var verdict = node("lab-verdict");
      if (verdict) verdict.innerHTML = result.verdict;
    }
    function mount() {
      mountBase(state, title, controls(state), draw, legend);
    }
    window.SIMS[id] = { mount: mount, draw: draw };
  }

  install("relations", "Relation mapper", { mode: "equivalence" }, function (s) {
    return select("mode", "Choose a relation", [
      ["equivalence", "Congruence mod 3"],
      ["order", "Less than or equal"],
      ["identity", "Identity relation"]
    ], s.mode);
  }, function (s) {
    var labels = s.mode === "equivalence" ? ["0~0", "0~3", "1~1", "2~2", "2~5"] :
      s.mode === "order" ? ["1≤1", "1≤2", "2≤2", "2≤3", "3≤3"] :
      ["1→1", "2→2", "3→3", "4→4", "5→5"];
    var rows = labels.map(function (label, i) {
      return '<rect x="' + (55 + i * 126) + '" y="110" width="105" height="60" rx="9" fill="#15263a" stroke="#38bdf8"></rect>' +
        text(107 + i * 126, 146, label, "#f8fafc", 16);
    }).join("");
    var property = s.mode === "equivalence" ? "reflexive, symmetric and transitive" :
      s.mode === "order" ? "reflexive, antisymmetric and transitive" : "reflexive, symmetric and transitive";
    return {
      svg: shell(text(360, 45, "A relation is a subset of A × A", "#f8fafc", 18) + rows +
        text(360, 230, property, "#34d399", 16)),
      readout: cell("Selected", s.mode) + cell("Pattern", property, "#34d399"),
      verdict: "<b>Notice:</b> a relation is any chosen set of ordered pairs. A function adds the rule that each input has exactly one output."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>ordered pair</span></div>');

  install("inverse", "Inverse-function mirror", { fn: "square", x: 1.5 }, function (s) {
    return select("fn", "Choose a function", [["square", "y = x²"], ["linear", "y = 2x + 1"], ["cube", "y = x³"]], s.fn) +
      range("x", "Input x", -2, 2, 0.1, s.x, "");
  }, function (s) {
    var fn = s.fn === "square" ? function (x) { return x * x; } :
      s.fn === "linear" ? function (x) { return 2 * x + 1; } :
      function (x) { return x * x * x; };
    var pts = "", inv = "", y = fn(s.x);
    for (var x = -2; x <= 2.01; x += 0.1) {
      var yy = fn(x);
      pts += (x === -2 ? "M" : "L") + (260 + x * 55) + " " + (160 - yy * 25) + " ";
      inv += (x === -2 ? "M" : "L") + (260 + yy * 25) + " " + (160 - x * 55) + " ";
    }
    return {
      svg: shell('<line x1="100" y1="160" x2="620" y2="160" stroke="#475569"></line><line x1="260" y1="35" x2="260" y2="270" stroke="#475569"></line>' +
        '<line x1="110" y1="280" x2="600" y2="40" stroke="#94a3b8" stroke-dasharray="7 6"></line>' +
        '<path d="' + pts + '" fill="none" stroke="#38bdf8" stroke-width="3"></path><path d="' + inv +
        '" fill="none" stroke="#f59e0b" stroke-width="3"></path><circle cx="' + (260 + s.x * 55) +
        '" cy="' + (160 - y * 25) + '" r="6" fill="#34d399"></circle>' +
        text(500, 70, "f(x)", "#38bdf8", 16) + text(500, 100, "f⁻¹(x)", "#f59e0b", 16) +
        text(500, 130, "y = x mirror", "#94a3b8", 14)),
      readout: cell("x", s.x.toFixed(1)) + cell("f(x)", y.toFixed(2), "#38bdf8") + cell("swap", "(" + y.toFixed(2) + ", " + s.x.toFixed(1) + ")", "#f59e0b"),
      verdict: "<b>Inverse:</b> exchanging x and y reflects the graph in y = x. A true inverse requires the original function to be one-to-one on its chosen domain."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span><span>inverse graph</span></div>');

  install("matrices", "Matrix multiplication table", { a: 2, b: 1, c: 1, d: 3 }, function (s) {
    return range("a", "a", -4, 4, 1, s.a, "") + range("b", "b", -4, 4, 1, s.b, "") +
      range("c", "c", -4, 4, 1, s.c, "") + range("d", "d", -4, 4, 1, s.d, "");
  }, function (s) {
    var det = s.a * s.d - s.b * s.c;
    return {
      svg: shell(text(190, 70, "A", "#38bdf8", 22) + text(510, 70, "B", "#f59e0b", 22) +
        text(190, 120, "[" + s.a + "  " + s.b + "]", "#f8fafc", 24) + text(190, 160, "[" + s.c + "  " + s.d + "]", "#f8fafc", 24) +
        text(510, 120, "[" + s.d + "  " + s.b + "]", "#f8fafc", 24) + text(510, 160, "[" + s.c + "  " + s.a + "]", "#f8fafc", 24) +
        '<path d="M285 130 C335 105 370 105 430 130" fill="none" stroke="#34d399" stroke-width="3" marker-end="url(#arrow-m)"></path>' +
        text(360, 235, "A × B is defined by row · column products", "#94a3b8", 15) +
        '<defs><marker id="arrow-m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#34d399"></path></marker></defs>'),
      readout: cell("a₁₁b₁₁ + a₁₂b₂₁", (s.a * s.d + s.b * s.c).toFixed(0), "#34d399") + cell("det A", det.toFixed(0), "#f59e0b"),
      verdict: "<b>Order matters:</b> matrix multiplication pairs each row of the first matrix with each column of the second. It is not entry-by-entry multiplication."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>row · column</span></div>');

  install("determinant", "Determinant area", { a: 2, b: 1, c: 1, d: 3 }, function (s) {
    return range("a", "a", -4, 4, 1, s.a, "") + range("b", "b", -4, 4, 1, s.b, "") +
      range("c", "c", -4, 4, 1, s.c, "") + range("d", "d", -4, 4, 1, s.d, "");
  }, function (s) {
    var det = s.a * s.d - s.b * s.c;
    var x2 = 360 + s.a * 35, y2 = 160 - s.c * 25, x3 = 360 + s.b * 35, y3 = 160 - s.d * 25;
    return {
      svg: shell('<polygon points="360,160 ' + x2 + ',' + y2 + ' ' + (x2 + x3 - 360) + ',' + (y2 + y3 - 160) + ' ' + x3 + ',' + y3 + '" fill="#38bdf822" stroke="#38bdf8" stroke-width="3"></polygon>' +
        '<line x1="360" y1="160" x2="' + x2 + '" y2="' + y2 + '" stroke="#f59e0b" stroke-width="3"></line><line x1="360" y1="160" x2="' + x3 + '" y2="' + y3 + '" stroke="#34d399" stroke-width="3"></line>' +
        text(360, 55, "det [[a,b],[c,d]] = ad − bc", "#f8fafc", 18) + text(360, 250, "signed area scale", "#94a3b8", 15)),
      readout: cell("det A", det.toFixed(2), det >= 0 ? "#34d399" : "#f87171") + cell("triangle area", Math.abs(det / 2).toFixed(2), "#f59e0b"),
      verdict: "<b>Geometry:</b> the determinant is the signed area scale of the parallelogram formed by the column vectors. Zero means the vectors are dependent."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span><span>area scale</span></div>');

  install("continuity", "Continuity microscope", { x: 0.5 }, function (s) {
    return range("x", "Probe x", -1, 2.5, 0.05, s.x, "");
  }, function (s) {
    var x = s.x, y = Math.abs(x - 1) < 0.02 ? 3.2 : (x * x - 1) / (x - 1);
    var pts = "";
    for (var u = -1; u <= 2.01; u += 0.05) {
      var v = u === 1 ? 2 : u + 1;
      pts += (u === -1 ? "M" : "L") + (90 + (u + 1) * 150) + " " + (250 - v * 48) + " ";
    }
    return {
      svg: shell('<line x1="90" y1="250" x2="570" y2="250" stroke="#475569"></line><line x1="90" y1="70" x2="90" y2="270" stroke="#475569"></line><path d="' + pts + '" fill="none" stroke="#38bdf8" stroke-width="3"></path>' +
        '<circle cx="390" cy="154" r="8" fill="#09131d" stroke="#f59e0b" stroke-width="3"></circle><circle cx="' + (90 + (x + 1) * 150) + '" cy="' + (250 - y * 48) + '" r="7" fill="#34d399"></circle>' +
        text(470, 70, "f(x) = (x²−1)/(x−1)", "#f8fafc", 16) + text(470, 100, "x ≠ 1; removable hole at x=1", "#f59e0b", 14)),
      readout: cell("probe x", x.toFixed(2)) + cell("nearby value", y.toFixed(2), "#34d399") + cell("limit at 1", "2", "#f59e0b"),
      verdict: "<b>Limit versus value:</b> the nearby trend can approach 2 even though the displayed function has a hole at x = 1. Continuity requires the value and the limit to agree."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span><span>removable hole</span></div>');

  install("derivative", "Derivative as slope", { x: 1 }, function (s) {
    return range("x", "Point x", -2.5, 2.5, 0.1, s.x, "");
  }, function (s) {
    var x = s.x, y = x * x, m = 2 * x;
    var x1 = -2.5, x2 = 2.5, y1 = y + m * (x1 - x), y2 = y + m * (x2 - x);
    var curve = "";
    for (var u = -2.5; u <= 2.51; u += 0.08) curve += (u === -2.5 ? "M" : "L") + (360 + u * 65) + " " + (160 - u * u * 24) + " ";
    return {
      svg: shell('<line x1="80" y1="160" x2="650" y2="160" stroke="#475569"></line><line x1="360" y1="45" x2="360" y2="270" stroke="#475569"></line><path d="' + curve + '" fill="none" stroke="#38bdf8" stroke-width="3"></path>' +
        '<line x1="' + (360 + x1 * 65) + '" y1="' + (160 - y1 * 24) + '" x2="' + (360 + x2 * 65) + '" y2="' + (160 - y2 * 24) + '" stroke="#f59e0b" stroke-width="3"></line><circle cx="' + (360 + x * 65) + '" cy="' + (160 - y * 24) + '" r="7" fill="#34d399"></circle>' +
        text(500, 70, "y = x²", "#38bdf8", 18) + text(500, 105, "slope f′(x) = 2x", "#f59e0b", 16)),
      readout: cell("x", x.toFixed(1)) + cell("f(x)", y.toFixed(2), "#38bdf8") + cell("f′(x)", m.toFixed(2), "#f59e0b"),
      verdict: "<b>Derivative:</b> it is the slope of the tangent. At x = 0 the parabola is flat; on the right the slope is positive and on the left it is negative."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span><span>tangent slope</span></div>');

  install("integration", "Integral as accumulated area", { upper: 3 }, function (s) {
    return range("upper", "Upper limit b", 0.5, 4, 0.1, s.upper, "");
  }, function (s) {
    var b = s.upper, area = b * b * b / 3, bars = "", n = 12, w = b / n;
    for (var i = 0; i < n; i += 1) {
      var u = i * w, h = u * u;
      bars += '<rect x="' + (100 + u * 110) + '" y="' + (245 - h * 12) + '" width="' + (w * 110 - 2) + '" height="' + (h * 12) + '" fill="#38bdf844"></rect>';
    }
    var curve = "";
    for (var x = 0; x <= 4.01; x += 0.08) curve += (x === 0 ? "M" : "L") + (100 + x * 110) + " " + (245 - x * x * 12) + " ";
    return {
      svg: shell('<line x1="95" y1="245" x2="555" y2="245" stroke="#475569"></line><path d="' + curve + '" fill="none" stroke="#f59e0b" stroke-width="3"></path>' + bars +
        '<line x1="' + (100 + b * 110) + '" y1="65" x2="' + (100 + b * 110) + '" y2="245" stroke="#34d399" stroke-dasharray="6 5" stroke-width="2"></line>' +
        text(510, 70, "∫₀ᵇ x² dx = b³/3", "#f8fafc", 18) + text(510, 105, "rectangles approximate the area", "#94a3b8", 14)),
      readout: cell("b", b.toFixed(1)) + cell("area", area.toFixed(3), "#34d399") + cell("meaning", "accumulation", "#f59e0b"),
      verdict: "<b>Integral:</b> an antiderivative gives a compact way to accumulate infinitely many thin contributions. The rectangles improve as their width shrinks."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#38bdf8"></span><span>area strips</span></div>');

  install("area", "Area between curves", { upper: 1 }, function (s) {
    return range("upper", "Boundary b", 0.2, 2, 0.05, s.upper, "");
  }, function (s) {
    var b = s.upper, area = b * b / 2 - b * b * b / 3, path = "", region = "";
    for (var x = 0; x <= b + 0.01; x += 0.03) {
      path += (x === 0 ? "M" : "L") + (120 + x * 190) + " " + (235 - x * 70) + " ";
      region += (x === 0 ? "M" : "L") + (120 + x * 190) + " " + (235 - x * 70) + " ";
    }
    for (var y = b; y >= -0.01; y -= 0.03) region += "L" + (120 + y * 190) + " " + (235 - y * y * 70) + " ";
    return {
      svg: shell('<line x1="110" y1="235" x2="520" y2="235" stroke="#475569"></line><path d="' + path + '" fill="none" stroke="#38bdf8" stroke-width="3"></path><path d="' + region + 'Z" fill="#34d39955" stroke="#34d399"></path>' +
        text(500, 70, "between y=x and y=x²", "#f8fafc", 17) + text(500, 105, "∫(x−x²) dx", "#f59e0b", 16)),
      readout: cell("b", b.toFixed(2)) + cell("area", area.toFixed(4), "#34d399") + cell("bounds", "0 to b", "#f59e0b"),
      verdict: "<b>Set up before integrating:</b> area is upper curve minus lower curve on the chosen interval. A sketch prevents a reversed sign."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>bounded region</span></div>');

  install("differential", "Differential-equation flow", { family: "separable", t: 1 }, function (s) {
    return select("family", "Choose a model", [["separable", "dy/dx = y"], ["linear", "dy/dx + y = 1"], ["decay", "dy/dx = −y"]], s.family) +
      range("t", "time t", 0, 4, 0.1, s.t, "");
  }, function (s) {
    var sign = s.family === "decay" ? -1 : 1;
    var y = s.family === "linear" ? 1 - Math.exp(-s.t) : Math.exp(sign * s.t);
    var curve = "";
    for (var x = 0; x <= 4.01; x += 0.08) {
      var value = s.family === "linear" ? 1 - Math.exp(-x) : Math.exp(sign * x);
      curve += (x === 0 ? "M" : "L") + (100 + x * 100) + " " + (235 - Math.min(2.7, value) * 55) + " ";
    }
    return {
      svg: shell('<line x1="95" y1="235" x2="530" y2="235" stroke="#475569"></line><path d="' + curve + '" fill="none" stroke="#38bdf8" stroke-width="3"></path><circle cx="' + (100 + s.t * 100) + '" cy="' + (235 - Math.min(2.7, y) * 55) + '" r="7" fill="#34d399"></circle>' +
        text(500, 70, "solve → apply initial condition", "#f8fafc", 16) + text(500, 105, "one family, many possible constants", "#94a3b8", 14)),
      readout: cell("model", s.family) + cell("y(t)", y.toFixed(3), "#34d399") + cell("t", s.t.toFixed(1), "#f59e0b"),
      verdict: "<b>Solution family:</b> integrating produces a constant. An initial condition selects one member of the family."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>solution curve</span></div>');

  install("vectors", "Vector components", { ax: 3, ay: 2, bx: -1, by: 2 }, function (s) {
    return range("ax", "Aₓ", -4, 4, 1, s.ax, "") + range("ay", "Aᵧ", -4, 4, 1, s.ay, "") +
      range("bx", "Bₓ", -4, 4, 1, s.bx, "") + range("by", "Bᵧ", -4, 4, 1, s.by, "");
  }, function (s) {
    var rx = s.ax + s.bx, ry = s.ay + s.by, mag = Math.sqrt(rx * rx + ry * ry);
    function arrow(x, y, dx, dy, color) {
      return '<line x1="' + x + '" y1="' + y + '" x2="' + (x + dx * 35) + '" y2="' + (y - dy * 35) + '" stroke="' + color + '" stroke-width="4" marker-end="url(#arrow-v)"></line>';
    }
    return {
      svg: shell('<line x1="90" y1="180" x2="630" y2="180" stroke="#475569"></line><line x1="360" y1="45" x2="360" y2="270" stroke="#475569"></line>' +
        arrow(360, 180, s.ax, s.ay, "#38bdf8") + arrow(360, 180, s.bx, s.by, "#f59e0b") + arrow(360, 180, rx, ry, "#34d399") +
        '<defs><marker id="arrow-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#34d399"></path></marker></defs>' +
        text(500, 65, "R = A + B", "#34d399", 18) + text(500, 105, "components add separately", "#94a3b8", 14)),
      readout: cell("Rₓ", rx.toFixed(0), "#34d399") + cell("Rᵧ", ry.toFixed(0), "#34d399") + cell("|R|", mag.toFixed(2), "#f59e0b"),
      verdict: "<b>Vector addition:</b> add horizontal components together and vertical components together. The resultant arrow is the diagonal of the component parallelogram."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span><span>input vectors</span></div><div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>resultant</span></div>');

  install("lines3d", "Angle between lines", { angle: 45 }, function (s) {
    return range("angle", "Projected angle", 0, 90, 1, s.angle, "°");
  }, function (s) {
    var c = Math.cos(s.angle * Math.PI / 180);
    return {
      svg: shell('<line x1="165" y1="220" x2="530" y2="90" stroke="#38bdf8" stroke-width="5"></line><line x1="165" y1="220" x2="530" y2="220" stroke="#f59e0b" stroke-width="5"></line><path d="M235 195 A75 75 0 0 1 275 174" fill="none" stroke="#34d399" stroke-width="3"></path>' +
        text(500, 70, "cos θ = (a₁a₂+b₁b₂+c₁c₂)/(|a₁||a₂|)", "#f8fafc", 14) + text(500, 115, "direction ratios → angle", "#94a3b8", 15)),
      readout: cell("θ", s.angle.toFixed(0) + "°", "#34d399") + cell("cos θ", c.toFixed(3), "#f59e0b"),
      verdict: "<b>3D line angle:</b> direction ratios are enough. The dot product compares how much the two directions point the same way."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span><span>reference direction</span></div>');

  install("lp", "Linear-programming feasible region", { slope: 1 }, function (s) {
    return range("slope", "Objective slope", -2, 3, 0.1, s.slope, "");
  }, function (s) {
    var y1 = 4 - s.slope * 1, y2 = 4 - s.slope * 3;
    return {
      svg: shell('<line x1="95" y1="245" x2="600" y2="245" stroke="#475569"></line><line x1="95" y1="55" x2="95" y2="245" stroke="#475569"></line><polygon points="95,245 95,105 300,105 470,245" fill="#34d39955" stroke="#34d399" stroke-width="3"></polygon>' +
        '<line x1="100" y1="' + (245 - y1 * 35) + '" x2="560" y2="' + (245 - y2 * 35) + '" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 5"></line>' +
        '<circle cx="95" cy="105" r="7" fill="#38bdf8"></circle><circle cx="300" cy="105" r="7" fill="#38bdf8"></circle><circle cx="470" cy="245" r="7" fill="#38bdf8"></circle>' +
        text(500, 65, "objective line slides", "#f8fafc", 17) + text(500, 100, "test the vertices", "#94a3b8", 15)),
      readout: cell("slope", s.slope.toFixed(1)) + cell("candidate points", "vertices", "#34d399") + cell("method", "corner test", "#f59e0b"),
      verdict: "<b>Graphical method:</b> the optimum occurs at a corner of the feasible region unless the objective is constant along an edge."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>feasible region</span></div>');

  install("probability", "Probability tree", { pA: 0.6, pB: 0.3 }, function (s) {
    return range("pA", "P(A)", 0.1, 0.9, 0.05, s.pA, "") + range("pB", "P(B|A)", 0.1, 0.9, 0.05, s.pB, "");
  }, function (s) {
    var joint = s.pA * s.pB, other = (1 - s.pA) * 0.2, total = joint + other;
    return {
      svg: shell('<line x1="110" y1="150" x2="260" y2="90" stroke="#38bdf8" stroke-width="3"></line><line x1="110" y1="150" x2="260" y2="220" stroke="#94a3b8" stroke-width="3"></line><line x1="260" y1="90" x2="470" y2="60" stroke="#34d399" stroke-width="3"></line><line x1="260" y1="90" x2="470" y2="125" stroke="#94a3b8" stroke-width="3"></line><line x1="260" y1="220" x2="470" y2="190" stroke="#f59e0b" stroke-width="3"></line><line x1="260" y1="220" x2="470" y2="250" stroke="#94a3b8" stroke-width="3"></line>' +
        text(100, 140, "start", "#f8fafc", 14) + text(260, 78, "A", "#38bdf8", 17) + text(260, 210, "Aᶜ", "#94a3b8", 17) + text(505, 60, "B", "#34d399", 17) + text(505, 125, "Bᶜ", "#94a3b8", 17) +
        text(505, 190, "B", "#f59e0b", 17) + text(505, 250, "Bᶜ", "#94a3b8", 17)),
      readout: cell("P(A∩B)", joint.toFixed(3), "#34d399") + cell("P(B)", total.toFixed(3), "#f59e0b") + cell("P(A|B)", (joint / Math.max(total, 0.001)).toFixed(3), "#38bdf8"),
      verdict: "<b>Bayes:</b> multiply along a branch, add disjoint branches for P(B), then reverse the condition with P(A|B) = P(A∩B)/P(B)."
    };
  }, '<div class="legend-item"><span class="legend-dot" style="background:#34d399"></span><span>target branch</span></div>');
})();
