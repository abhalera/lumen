(function(){
  var C = window.CHAPTER;
  if (!C) {
    console.error("No CHAPTER data object found on window.");
    return;
  }

  var state = {
    conceptIndex: 0,
    level: 0,
    answers: {},
    correct: {},
    t: 0,
    maxT: 6,
    playing: false,
    rafId: null,
    stepMode: false,
    speed: 1.0,
    simState: {}
  };

  var STORAGE_KEY = (C.code || "chapter") + "_learner_progress_v2";

  function initStorage(){
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if(saved){
        var d = JSON.parse(saved);
        if(d && d.answers) state.answers = d.answers;
        if(d && d.correct) state.correct = d.correct;
      }
    } catch(e){}
  }

  function saveStorage(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers: state.answers,
        correct: state.correct
      }));
    } catch(e){}
  }

  function updateProgress(){
    var count = Object.keys(state.correct).length;
    var totalLessons = (C.lessons && C.lessons.length) ? C.lessons.length : (C.concepts ? C.concepts.length : 6);
    var total = totalLessons * 3;
    var bar = document.getElementById("progress-bar");
    var txt = document.getElementById("progress-text");
    if(bar) bar.value = count;
    if(txt) txt.textContent = count + " / " + total;
    saveStorage();
  }

  function qKey(cIdx, lvl){
    return cIdx + "_" + lvl;
  }

  // --- Legacy Animation Loop for window.SIMS ---
  var lastTs = 0;
  function animLoop(ts){
    if(!lastTs) lastTs = ts;
    var dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if(dt > 0.1) dt = 0.1;

    if(state.playing){
      state.t += dt * state.speed;
      if(state.t >= state.maxT){
        state.t = state.maxT;
        state.playing = false;
        updatePlayBtn();
      }
      syncTimelineUI();
      renderActiveFrame(state.t);
    }
    if(state.playing){
      state.rafId = requestAnimationFrame(animLoop);
    }
  }

  function play(){
    if(state.t >= state.maxT) state.t = 0;
    state.playing = true;
    lastTs = 0;
    updatePlayBtn();
    state.rafId = requestAnimationFrame(animLoop);
  }

  function pause(){
    state.playing = false;
    if(state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = null;
    updatePlayBtn();
  }

  function step(delta){
    pause();
    state.t = Math.max(0, Math.min(state.maxT, state.t + delta));
    syncTimelineUI();
    renderActiveFrame(state.t);
  }

  function resetTimeline(){
    pause();
    state.t = 0;
    syncTimelineUI();
    renderActiveFrame(state.t);
  }

  function seekTimeline(val){
    pause();
    state.t = Number(val);
    syncTimelineUI();
    renderActiveFrame(state.t);
  }

  function updatePlayBtn(){
    var btn = document.getElementById("btn-play-pause");
    if(btn){
      btn.innerHTML = state.playing ? "⏸ Pause" : "▶ Play";
      btn.setAttribute("aria-label", state.playing ? "Pause animation" : "Play animation");
    }
  }

  function syncTimelineUI(){
    var scrubber = document.getElementById("time-scrubber");
    var disp = document.getElementById("time-display");
    if(scrubber) scrubber.value = state.t;
    if(disp) disp.innerHTML = "t = <b>" + state.t.toFixed(1) + " s</b>";
  }

  function renderActiveFrame(t){
    if(!C.lessons) return;
    var l = C.lessons[state.conceptIndex];
    if(l && window.SIMS && l.sim && window.SIMS[l.sim] && typeof window.SIMS[l.sim].draw === 'function'){
      window.SIMS[l.sim].draw(t);
    }
  }

  // --- Render Concept View ---
  function renderConcept(idx){
    pause();
    state.conceptIndex = idx;
    state.t = 0;
    state.level = 0;

    var lessons = C.lessons || C.concepts || [];
    var l = lessons[idx];
    if(!l) return;

    var navTitle = l.nav || l.navTitle || l.title || ("Concept " + (idx + 1));

    // Update sidebar navigation active state
    var navBtns = document.querySelectorAll(".concept-nav");
    navBtns.forEach(function(b, i){
      if(b.id === "nav-revision") b.classList.remove("active");
      else b.classList.toggle("active", i === idx);
    });

    // Update top crumb
    var chNum = C.chapterNumber || (C.code ? C.code.replace(/\D/g, '') : "01");
    var crumb = document.getElementById("chapter-crumb");
    if(crumb) crumb.textContent = "CH " + chNum + " · " + navTitle.toUpperCase();

    // Show concept view, hide revision
    var cView = document.getElementById("concept-view");
    var rView = document.getElementById("revision-view");
    if(cView) cView.style.display = "block";
    if(rView) rView.style.display = "none";

    var html = "";

    // Concept Header
    var minutes = l.minutes || 10;
    var printPage = l.print || (l.pages ? l.pages.join("–") : (C.page_start ? "pp. " + C.page_start + "–" + C.page_end : ""));
    html += '<div class="concept-header">' +
      '<div class="concept-badge"><span>Concept ' + ("0" + (idx + 1)).slice(-2) + ' / ' + ("0" + lessons.length).slice(-2) + '</span>' +
      (printPage ? '<span class="time-pill">≈ ' + minutes + ' min · ' + printPage + '</span>' : '<span class="time-pill">≈ ' + minutes + ' min</span>') +
      '</div>' +
      '<h1 class="concept-title">' + (l.title || navTitle) + '</h1>' +
      '<p class="concept-deck">' + (l.deck || l.summary || "") + '</p>' +
      '</div>';

    // 01 LEARN BLOCK
    html += '<section class="learn-section" aria-label="Learn Concept">' +
      '<span class="block-tag">01 · LEARN · CORE ESSENTIALS</span>';

    var quickItems = [];
    if(Array.isArray(l.quick)) {
      quickItems = l.quick;
    } else if(Array.isArray(l.summary)) {
      quickItems = l.summary;
    } else if(l.reading_content) {
      quickItems = [l.reading_content];
    } else if(l.summary || l.deck) {
      quickItems = [l.summary || l.deck];
    }

    html += '<div class="quick-summary">' + quickItems.map(function(p){
      if(p.includes('<p>') || p.includes('<div>') || p.includes('<h3>')) return p;
      var formatted = p.replace(/###\s+(.*?)\n/g, '<h3 style="margin-top:16px;color:var(--ink);">$1</h3>')
                       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                       .replace(/\*(.*?)\*/g, '<em>$1</em>')
                       .replace(/\n\n/g, '</p><p>');
      return '<p>' + formatted + '</p>';
    }).join("") + '</div>';

    // Semantic Equations Card
    var formulas = l.formulas || [];
    if(formulas.length){
      html += '<div class="key-equations-card">' +
        '<div class="equations-heading">Key Relations for this Concept</div>' +
        '<div class="eq-grid">' +
        formulas.map(function(eq){
          var label = eq.label || eq.name || "Relation";
          var cond = eq.cond || "";
          var math = eq.html || eq.formula || "";
          return '<div class="eq-row">' +
            '<div class="eq-meta"><span class="eq-label">' + label + '</span>' + (cond ? '<span class="eq-cond">' + cond + '</span>' : '') + '</div>' +
            '<div class="eq-math">' + math + '</div>' +
            '</div>';
        }).join("") +
        '</div></div>';
    }

    // Deeper dive / core takeaways
    if(l.deeper){
      html += '<details class="deep-dive"><summary>Go deeper into the conceptual foundation</summary><p>' + l.deeper + '</p></details>';
    } else if(l.takeaways && l.takeaways.length){
      html += '<details class="deep-dive"><summary>Key Conceptual Takeaways</summary><ul>' +
        l.takeaways.map(function(t){ return '<li>' + t + '</li>'; }).join("") +
        '</ul></details>';
    }

    // Worked Example
    var worked = l.worked || l.worked_example;
    if(worked){
      var workedHtml = typeof worked === 'object' && worked !== null
        ? '<strong>' + (worked.title || 'Worked Example') + '</strong><br>' + (worked.problem || '') +
          (worked.given ? '<br><br><strong>Given:</strong> ' + worked.given : '') +
          (worked.steps ? '<br><strong>Steps:</strong><br>' + worked.steps.map(function(s){ return '&bull; ' + s; }).join('<br>') : '') +
          (worked.solution ? '<br><br><strong>Solution:</strong> ' + worked.solution : '') +
          (worked.answer ? '<br><br><strong>Answer:</strong> ' + worked.answer : '')
        : String(worked);
      html += '<details class="deep-dive"><summary>Worked textbook example step by step</summary><p>' + workedHtml + '</p></details>';
    }

    html += '</section>';

    // 02 PREDICT FIRST BLOCK
    var pred = l.prediction || l.predict || l.predict_first;
    if(pred && typeof pred === 'object' && (pred.prompt || pred.scenario) && pred.options && pred.options.length){
      var promptText = pred.prompt || pred.scenario || "";
      html += '<section class="predict-card" aria-label="Predict First">' +
        '<div class="predict-badge">02 · PREDICT FIRST · TEST YOUR INTUITION</div>' +
        '<div class="predict-prompt">' + promptText.replace(/\n/g, '<br>') + '</div>' +
        '<div class="predict-options" id="predict-options">' +
        pred.options.map(function(opt, oi){
          return '<label class="predict-option"><input type="radio" name="predict_ans" value="' + oi + '"><span>' + opt + '</span></label>';
        }).join("") +
        '</div>' +
        '<div class="predict-actions">' +
        '<button class="btn-primary" id="btn-check-prediction">Check Prediction</button>' +
        '<button class="btn-secondary" id="btn-skip-prediction">Skip to Lab</button>' +
        '</div>' +
        '<div id="predict-feedback-box" class="predict-feedback" style="display:none;"></div>' +
        '</section>';
    }

    // 03 PLAY / LAB BLOCK
    var simTitle = (l.simTitle || navTitle || "Interactive Simulation").toUpperCase();
    var whatWatch = (pred && pred.prompt) ? pred.prompt : (typeof l.predict === 'string' ? l.predict : "Explore the interactive simulation controls, parameters, and readouts below.");
    html += '<section class="lab-card" aria-label="Interactive Laboratory">' +
      '<div class="lab-header"><span class="lab-title">03 · PLAY · ' + simTitle + '</span><span class="live-tag">INTERACTIVE SIMULATION</span></div>' +
      '<div class="what-to-watch" id="what-to-watch"><strong>What to watch:</strong> ' + whatWatch + '</div>' +
      '<div id="sim-mount-point" class="sim-mount-container" style="width:100%;min-height:220px;margin-top:12px;">' +
        '<div class="diagram-wrap"><svg id="diagram" class="diagram" viewBox="0 0 720 300" role="img" aria-label="' + simTitle + '"></svg></div>' +
        '<div class="lab-legend" id="lab-legend"></div>' +
        '<div class="lab-toolbar" id="legacy-lab-toolbar">' +
          '<button class="toolbar-btn primary" id="btn-play-pause" aria-label="Play animation">▶ Play</button>' +
          '<button class="toolbar-btn" id="btn-step-fwd" aria-label="Step forward">⏭ Step (+0.5s)</button>' +
          '<button class="toolbar-btn" id="btn-reset-time" aria-label="Reset timeline">↺ Reset</button>' +
          '<span class="time-display" id="time-display">t = <b>0.0 s</b></span>' +
          '<div class="scrubber-wrap">' +
            '<input type="range" id="time-scrubber" class="timeline-scrubber" min="0" max="6" step="0.1" value="0" aria-label="Timeline time scrubber">' +
          '</div>' +
        '</div>' +
        '<div class="preset-bar" id="preset-bar"></div>' +
        '<div class="lab-controls-grid" id="lab-controls"></div>' +
        '<div class="lab-readout" id="lab-readout" role="status" aria-live="polite"></div>' +
        '<div class="lab-verdict" id="lab-verdict" role="status" aria-live="polite"></div>' +
      '</div>' +
      '</section>';

    // 04 CONNECT BLOCK
    var connectItems = l.connect || [];
    if(connectItems.length){
      html += '<section class="connect-section" aria-label="Real World Connections">' +
        '<span class="block-tag">04 · CONNECT · REAL WORLD APPLICATIONS</span>' +
        '<div class="connect-grid">' +
        connectItems.map(function(item){
          var title = Array.isArray(item) ? item[0] : (item.title || "Real World Context");
          var desc = Array.isArray(item) ? item[1] : (item.text || item.desc || "");
          var links = Array.isArray(item) ? (item[2] || []) : (item.links || (item.link ? [{t: "Read Deeply", u: item.link}] : []));
          var v = Array.isArray(item) ? (item[3] || null) : (item.video || null);
          var wow = /^Wow/i.test(title);

          var cHtml = '<div class="connect-card' + (wow ? ' wow' : '') + '">';
          if(wow) cHtml += '<span class="wow-badge">WOW · REAL WORLD</span>';
          cHtml += '<h3>' + title + '</h3><p>' + desc + '</p>';
          if(v && v.id){
            cHtml += '<button class="video-facade" data-yt="' + v.id + '" aria-label="Play video: ' + v.title + '">' +
              '<img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" loading="lazy">' +
              '<span class="play-btn">▶</span>' +
              '<span class="video-title">' + v.title + ' · ' + v.channel + '</span>' +
              '</button>';
          }
          if(links && links.length){
            cHtml += '<p style="margin-top:10px;font-size:12px;color:var(--muted)">References: ' +
              links.map(function(a){ return '<a href="' + (a.u || a.link || "#") + '" target="_blank" rel="noopener">' + (a.t || a.label || "Read Deeply") + ' ↗</a>'; }).join(", ") +
              '</p>';
          }
          cHtml += '</div>';
          return cHtml;
        }).join("") +
        '</div></section>';
    }

    // 05 PRACTICE BLOCK
    var quizzes = l.quizzes || l.practice_quizzes || [];
    if(quizzes.length){
      html += '<section class="practice-section" aria-label="Practice and Mastery">' +
        '<span class="block-tag">05 · PRACTICE · MULTI-TIER CHALLENGE</span>' +
        '<div class="practice-nav">';
      for(var qi = 0; qi < quizzes.length; qi++){
        var tierName = qi === 0 ? "Tier 1: Easy" : (qi === 1 ? "Tier 2: Medium" : (qi === 2 ? "Tier 3: Hard" : "Question " + (qi + 1)));
        html += '<button class="level-tab' + (qi === 0 ? ' active' : '') + '" data-lvl="' + qi + '">' + tierName + '</button>';
      }
      html += '</div>' +
        '<div id="quiz-container"></div>' +
        '</section>';
    }

    // 06 REVISE CALLOUT
    var recall = l.recall || (l.takeaways && l.takeaways.length ? l.takeaways[0] : (l.core_takeaways && l.core_takeaways.length ? l.core_takeaways[0] : "Reflect on how this concept connects to physical reality."));
    html += '<div class="revise-callout"><strong>06 · REVISE · SAY IT IN YOUR OWN WORDS:</strong> ' + recall + '</div>';

    // Footer Navigation
    var nextNav = idx < lessons.length - 1 ? (lessons[idx + 1].nav || lessons[idx + 1].navTitle || lessons[idx + 1].title || ("Concept " + (idx + 2))) : "";
    html += '<div class="concept-footer-nav">' +
      (idx > 0 ? '<button class="btn-secondary" id="btn-prev-concept">← Concept ' + ("0" + idx).slice(-2) + '</button>' : '<span></span>') +
      (idx < lessons.length - 1 ? '<button class="btn-primary" id="btn-next-concept">Concept ' + ("0" + (idx + 2)).slice(-2) + ': ' + nextNav + ' →</button>' : '<button class="btn-primary" id="btn-goto-revision">Chapter Revision & Exercises →</button>') +
      '</div>';

    cView.innerHTML = html;

    // Attach Prediction Listeners
    var btnCheckPred = document.getElementById("btn-check-prediction");
    var btnSkipPred = document.getElementById("btn-skip-prediction");
    if(btnCheckPred && pred){
      btnCheckPred.addEventListener("click", function(){
        var sel = document.querySelector('input[name="predict_ans"]:checked');
        var fb = document.getElementById("predict-feedback-box");
        if(!sel){
          fb.style.display = "block";
          fb.className = "predict-feedback revealed";
          fb.textContent = "Please select one of the predictions first.";
          return;
        }
        var chosen = Number(sel.value);
        var expectedAns = pred.answer !== undefined ? pred.answer : (pred.correct !== undefined ? pred.correct : 0);
        var isRight = chosen === expectedAns;
        fb.style.display = "block";
        fb.className = "predict-feedback " + (isRight ? "correct" : "revealed");
        fb.innerHTML = (isRight ? "<b>Spot on!</b> " : "<b>Good thought! Here is the physical principle:</b> ") + (pred.explanation || "");
      });
    }
    if(btnSkipPred && pred){
      btnSkipPred.addEventListener("click", function(){
        var fb = document.getElementById("predict-feedback-box");
        fb.style.display = "block";
        fb.className = "predict-feedback revealed";
        fb.innerHTML = "<b>Key Principle:</b> " + (pred.explanation || "");
      });
    }

    // Attach Timeline Controls for legacy SIMS
    var btnPP = document.getElementById("btn-play-pause");
    if(btnPP) btnPP.addEventListener("click", function(){ if(state.playing) pause(); else play(); });
    var btnStep = document.getElementById("btn-step-fwd");
    if(btnStep) btnStep.addEventListener("click", function(){ step(0.5); });
    var btnResTime = document.getElementById("btn-reset-time");
    if(btnResTime) btnResTime.addEventListener("click", function(){ resetTimeline(); });
    var scrub = document.getElementById("time-scrubber");
    if(scrub) scrub.addEventListener("input", function(e){ seekTimeline(e.target.value); });

    // Footer Next/Prev listeners
    var btnPrev = document.getElementById("btn-prev-concept");
    var btnNext = document.getElementById("btn-next-concept");
    var btnRev = document.getElementById("btn-goto-revision");
    if(btnPrev) btnPrev.addEventListener("click", function(){ renderConcept(idx - 1); window.scrollTo(0,0); });
    if(btnNext) btnNext.addEventListener("click", function(){ renderConcept(idx + 1); window.scrollTo(0,0); });
    if(btnRev) btnRev.addEventListener("click", function(){ renderRevision(); window.scrollTo(0,0); });

    // Mount Active Simulation Engine
    var simMount = document.getElementById("sim-mount-point");
    if(simMount){
      var cKey = "c" + (idx + 1);
      var conceptId = l.id || ("concept-" + (idx + 1));
      var simId = l.sim || conceptId;

      // 1. window.mountSimulation (iemh101, iemh102)
      if(typeof window.mountSimulation === 'function'){
        simMount.innerHTML = "";
        window.mountSimulation(cKey, simMount);
      }
      // 2. window.SIM_ENGINES (iemh101-iemh105)
      else if(window.SIM_ENGINES && window.SIM_ENGINES[cKey] && typeof window.SIM_ENGINES[cKey].init === 'function'){
        simMount.innerHTML = "";
        window.SIM_ENGINES[cKey].init(simMount);
      }
      // 3. window.SimEngine (iemh106-iemh108)
      else if(window.SimEngine && typeof window.SimEngine.init === 'function'){
        var targetKey = null;
        var candidateKeys = [conceptId, "sim-" + conceptId, "sim-concept-" + (idx + 1), "concept-" + (idx + 1), simId, cKey];
        for(var k = 0; k < candidateKeys.length; k++){
          if(candidateKeys[k] && window.SimEngine.getEngine(candidateKeys[k])){
            targetKey = candidateKeys[k];
            break;
          }
        }
        if(targetKey){
          simMount.innerHTML = "";
          window.SimEngine.init(targetKey, simMount);
        }
      }
      // 4. window.SIMS (iesc101-iesc113)
      else if(window.SIMS && (window.SIMS[simId] || window.SIMS[l.sim] || window.SIMS[conceptId] || window.SIMS[cKey])){
        var simObj = window.SIMS[simId] || window.SIMS[l.sim] || window.SIMS[conceptId] || window.SIMS[cKey];
        if(typeof simObj.mount === 'function'){
          if(simObj.mount.length >= 1 && !simObj.draw){
            simMount.innerHTML = "";
            simObj.mount(simMount);
          } else {
            simObj.mount(l);
          }
        }
      }
    }

    // Render Quiz for current level
    renderQuiz();

    // Attach Practice Level Tabs
    var lvlTabs = document.querySelectorAll(".level-tab");
    lvlTabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        lvlTabs.forEach(function(t){ t.classList.remove("active"); });
        tab.classList.add("active");
        state.level = Number(tab.getAttribute("data-lvl"));
        renderQuiz();
      });
    });

    // Update URL hash
    window.location.hash = "#concept-" + (idx + 1);
  }

  // --- Render Quiz ---
  function renderQuiz(){
    var lessons = C.lessons || C.concepts || [];
    var l = lessons[state.conceptIndex];
    if(!l) return;
    var quizzes = l.quizzes || l.practice_quizzes || [];
    if(!quizzes.length) return;
    var q = quizzes[state.level] || quizzes[0];
    if(!q) return;

    var qk = qKey(state.conceptIndex, state.level);
    var old = state.answers[qk] || {};

    var box = document.getElementById("quiz-container");
    if(!box) return;

    var promptText = q.prompt || q.question || "";
    var isMcq = q.type === "mcq" || (q.options && q.options.length > 0);
    var correctAns = q.answer !== undefined ? q.answer : (q.correct !== undefined ? q.correct : 0);
    var solutionText = q.solution || q.explanation || "";
    var hintText = q.hint || "Review the key relationships in the concept overview above.";

    var html = '<div class="question-prompt">' + promptText + '</div>';
    if(isMcq && q.options){
      html += '<div class="quiz-options">' +
        q.options.map(function(opt, oi){
          var checked = old.value === String(oi) ? " checked" : "";
          return '<label class="quiz-option"><input type="radio" name="quiz_ans" value="' + oi + '"' + checked + '><span>' + opt + '</span></label>';
        }).join("") +
        '</div>';
    } else {
      html += '<div style="margin-bottom:16px;display:flex;align-items:center;gap:10px;">' +
        '<input type="number" step="any" id="quiz_num_ans" placeholder="Your answer" value="' + (old.value || "") + '" style="padding:8px 12px;border:1px solid var(--line);border-radius:6px;font-size:16px;width:160px;">' +
        '<span style="font-weight:600;color:var(--muted);">' + (q.unit || "") + '</span>' +
        '</div>';
    }

    html += '<div class="quiz-actions">' +
      '<button class="btn-primary" id="btn-submit-quiz">Submit Answer</button>' +
      '<button class="btn-secondary" id="btn-toggle-hint">Show Hint</button>' +
      '</div>' +
      '<div id="quiz-hint-box" class="quiz-hint" style="display:none;">' + hintText + '</div>' +
      '<div id="quiz-feedback-box" class="quiz-feedback" style="display:none;"></div>';

    box.innerHTML = html;

    // Hint toggle
    var hintBtn = document.getElementById("btn-toggle-hint");
    if(hintBtn){
      hintBtn.addEventListener("click", function(){
        var hb = document.getElementById("quiz-hint-box");
        if(hb) hb.style.display = hb.style.display === "none" ? "block" : "none";
      });
    }

    // Submit listener
    var submitBtn = document.getElementById("btn-submit-quiz");
    if(submitBtn){
      submitBtn.addEventListener("click", function(){
        var fb = document.getElementById("quiz-feedback-box");
        if(!fb) return;
        var isRight = false;
        var userVal = "";

        if(isMcq){
          var sel = document.querySelector('input[name="quiz_ans"]:checked');
          if(!sel){
            fb.style.display = "block";
            fb.className = "quiz-feedback retry";
            fb.textContent = "Please select an answer choice first.";
            return;
          }
          userVal = sel.value;
          isRight = Number(userVal) === Number(correctAns);
        } else {
          var inp = document.getElementById("quiz_num_ans");
          if(!inp || inp.value.trim() === ""){
            fb.style.display = "block";
            fb.className = "quiz-feedback retry";
            fb.textContent = "Please enter a numerical answer.";
            return;
          }
          userVal = inp.value.trim();
          var num = parseFloat(userVal);
          isRight = Math.abs(num - parseFloat(correctAns)) <= (q.tolerance || 0.05);
        }

        state.answers[qk] = { value: userVal, checked: true };
        if(isRight){
          state.correct[qk] = true;
          fb.style.display = "block";
          fb.className = "quiz-feedback success";
          fb.innerHTML = "<b>That’s right!</b> " + solutionText;
        } else {
          fb.style.display = "block";
          fb.className = "quiz-feedback retry";
          var wrongMsg = (isMcq && q.wrong && q.wrong[Number(userVal)]) ? q.wrong[Number(userVal)] : hintText;
          fb.innerHTML = "<b>Not quite.</b> " + wrongMsg + "<br><small style=\"margin-top:6px;display:block;\"><b>Full explanation:</b> " + solutionText + "</small>";
        }
        updateProgress();
      });
    }

    if(old.checked && submitBtn){
      submitBtn.click();
    }
  }

  // --- Render Revision View ---
  var currentExFilter = -1;

  function renderRevision(){
    pause();
    document.querySelectorAll(".concept-nav").forEach(function(b){ b.classList.remove("active"); });
    var rBtn = document.getElementById("nav-revision");
    if(rBtn) rBtn.classList.add("active");

    var chNum = C.chapterNumber || (C.code ? C.code.replace(/\D/g, '') : "01");
    var crumb = document.getElementById("chapter-crumb");
    if(crumb) crumb.textContent = "CH " + chNum + " · NCERT EXERCISES & REVISION";

    var cView = document.getElementById("concept-view");
    var revView = document.getElementById("revision-view");
    if(cView) cView.style.display = "none";
    if(revView) revView.style.display = "block";

    var exList = C.exercises || [];
    if(!exList.length && C.exerciseMap){
      exList = C.exerciseMap.map(function(m){
        return {
          q: m[0],
          number: String(m[0]),
          title: m[1],
          conceptIdx: m[2],
          page: m[3],
          printPage: 47 + m[3],
          question: m[4] || m[1],
          steps: [m[5] || "Refer to concept explanation."],
          answer: m[5] || ""
        };
      });
    }

    var totalEx = exList.length;
    var html = '<div class="concept-header">' +
      '<span class="concept-badge">NCERT EXERCISE COMPENDIUM</span>' +
      '<h1 class="concept-title">Revise, Reflect, Refine</h1>' +
      '<p class="concept-deck">All ' + totalEx + ' exercises from NCERT Class 12 Mathematics with comprehensive step-by-step pedagogical solutions.</p>' +
      '</div>';

    // Filter Bar & Expand/Collapse All
    var lessons = C.lessons || C.concepts || [];
    html += '<div class="exercise-compendium-header">' +
      '<div class="exercise-filter-bar">' +
      '<button class="filter-chip ' + (currentExFilter === -1 ? 'active' : '') + '" data-cfilter="-1">All Exercises (' + totalEx + ')</button>' +
      lessons.map(function(l, li){
        var nav = l.nav || l.navTitle || l.title || ("C0" + (li+1));
        return '<button class="filter-chip ' + (currentExFilter === li ? 'active' : '') + '" data-cfilter="' + li + '">C0' + (li+1) + ': ' + nav + '</button>';
      }).join("") +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button class="btn-secondary" id="btn-expand-all" style="padding:6px 12px;font-size:13px;">Expand All Guidance</button>' +
      '<button class="btn-secondary" id="btn-collapse-all" style="padding:6px 12px;font-size:13px;">Collapse All</button>' +
      '</div>' +
      '</div>';

    // Exercise Cards List
    html += '<div id="exercise-cards-container">';
    var filtered = currentExFilter === -1 ? exList : exList.filter(function(e){
      return e.conceptIdx === currentExFilter || (e.section && e.section.includes(String(currentExFilter + 1)));
    });

    html += filtered.map(function(ex, eIdx){
      var qNum = ex.number || ex.q || (eIdx + 1);
      var sectionLabel = ex.section ? ('<span class="q-badge" style="background:#e0f2fe;color:#0369a1;margin-right:6px;">' + ex.section + '</span>') : '';
      var l = (ex.conceptIdx !== undefined && lessons[ex.conceptIdx]) ? lessons[ex.conceptIdx] : null;
      var conceptLink = l ? ('<a href="#concept-' + (ex.conceptIdx + 1) + '" class="q-concept-link" data-idx="' + ex.conceptIdx + '">Explore in Concept ' + ("0" + (ex.conceptIdx + 1)).slice(-2) + ' (' + (l.nav || l.navTitle || l.title) + ') ↗</a>') : '';

      var guidanceHtml = "";
      if(ex.guidance){
        if(typeof ex.guidance === 'string'){
          guidanceHtml = ex.guidance;
        } else if(Array.isArray(ex.guidance)){
          guidanceHtml = '<div class="guidance-content"><h4>Step-by-Step Pedagogical Guidance:</h4>' +
            (ex.answer ? '<p><strong>Answer:</strong> ' + ex.answer + '</p>' : '') +
            '<ol>' + ex.guidance.map(function(g){ return '<li>' + g + '</li>'; }).join('') + '</ol></div>';
        }
      } else if(ex.steps && ex.steps.length){
        guidanceHtml = '<div class="guidance-content"><h4>Step-by-Step Pedagogical Guidance:</h4>' +
          (ex.given ? '<div class="given-data"><b>Given:</b> ' + ex.given + '</div>' : '') +
          '<ol class="solution-steps">' + ex.steps.map(function(st){ return '<li>' + st + '</li>'; }).join('') + '</ol>' +
          (ex.answer ? '<div class="answer-box"><b>Final Answer:</b> ' + ex.answer + '</div>' : '') +
          '</div>';
      }

      return '<article class="exercise-card" id="exercise-q' + qNum + '">' +
        '<div class="exercise-card-meta">' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
        sectionLabel +
        '<span class="q-badge">QUESTION ' + qNum + '</span>' +
        '</div>' +
        conceptLink +
        '</div>' +
        
        '<div class="exercise-question-text" style="font-size:15px;line-height:1.6;margin:12px 0;white-space:pre-wrap;">' + (ex.question || ex.title || "") + '</div>' +
        
        '<details class="exercise-drawer">' +
        '<summary class="exercise-drawer-btn">📖 View Step-by-Step Guidance & Full Solution</summary>' +
        '<div class="exercise-solution-body" style="padding:14px;background:#f8fafc;border-radius:8px;margin-top:8px;">' +
        guidanceHtml +
        '</div>' +
        '</details>' +
        '</article>';
    }).join("");

    html += '</div>';

    revView.innerHTML = html;

    // Attach Filter Listeners
    revView.querySelectorAll(".filter-chip").forEach(function(chip){
      chip.addEventListener("click", function(){
        currentExFilter = Number(chip.getAttribute("data-cfilter"));
        renderRevision();
      });
    });

    // Attach Expand/Collapse All Listeners
    var btnExp = document.getElementById("btn-expand-all");
    var btnCol = document.getElementById("btn-collapse-all");
    if(btnExp){
      btnExp.addEventListener("click", function(){
        revView.querySelectorAll("details.exercise-drawer").forEach(function(d){ d.open = true; });
      });
    }
    if(btnCol){
      btnCol.addEventListener("click", function(){
        revView.querySelectorAll("details.exercise-drawer").forEach(function(d){ d.open = false; });
      });
    }

    // Concept Navigation Links
    revView.querySelectorAll(".q-concept-link").forEach(function(a){
      a.addEventListener("click", function(e){
        e.preventDefault();
        var cIdx = Number(a.getAttribute("data-idx"));
        renderConcept(cIdx);
        window.scrollTo(0, 0);
      });
    });

    window.location.hash = "#revision";
  }

  // --- Build Sidebar Nav ---
  function buildSidebar(){
    var navContainer = document.getElementById("sidebar-nav");
    if(!navContainer) return;
    var lessons = C.lessons || C.concepts || [];
    navContainer.innerHTML = lessons.map(function(l, i){
      var nav = l.nav || l.navTitle || l.title || ("Concept " + (i + 1));
      return '<button class="concept-nav" data-cidx="' + i + '">' +
        '<span class="num">' + ("0" + (i + 1)).slice(-2) + '</span>' +
        '<span>' + nav + '</span>' +
        '</button>';
    }).join("");

    navContainer.querySelectorAll(".concept-nav").forEach(function(b){
      b.addEventListener("click", function(){
        var idx = Number(b.getAttribute("data-cidx"));
        renderConcept(idx);
      });
    });

    var rBtn = document.getElementById("nav-revision");
    if(rBtn) rBtn.addEventListener("click", renderRevision);
  }

  // --- Reset Progress Button ---
  var resetProgBtn = document.getElementById("btn-reset-progress");
  if(resetProgBtn){
    resetProgBtn.addEventListener("click", function(){
      if(confirm("Reset all quiz answers and mastery progress for this chapter?")){
        state.answers = {};
        state.correct = {};
        saveStorage();
        updateProgress();
        renderQuiz();
      }
    });
  }

  // --- Handle Video Facades (No preloaded iframes) ---
  document.addEventListener("click", function(e){
    var btn = e.target.closest(".video-facade");
    if(btn){
      var vid = btn.getAttribute("data-yt");
      var parent = btn.parentElement;
      if(parent && vid){
        parent.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0" title="Video Lesson" style="width:100%;aspect-ratio:16/9;border:none;border-radius:8px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }
    }
  });

  // --- URL Routing ---
  function routeFromHash(){
    var hash = window.location.hash;
    var lessons = C.lessons || C.concepts || [];
    if(hash === "#revision"){
      renderRevision();
    } else if(/^#concept-\d+$/.test(hash)){
      var cNum = parseInt(hash.replace("#concept-", ""), 10);
      if(cNum >= 1 && cNum <= lessons.length){
        renderConcept(cNum - 1);
        return;
      }
      renderConcept(0);
    } else {
      renderConcept(0);
    }
  }
  window.addEventListener("hashchange", routeFromHash);

  window.App = {
    state: state,
    play: play,
    pause: pause,
    step: step,
    resetTimeline: resetTimeline,
    seekTimeline: seekTimeline,
    renderConcept: renderConcept,
    renderRevision: renderRevision,
    routeFromHash: routeFromHash
  };
  if (typeof globalThis !== "undefined") {
    globalThis.App = window.App;
  }

  // Initialize
  initStorage();
  buildSidebar();
  updateProgress();
  routeFromHash();
})();
