# iesc104 learner experience review and repair handoff

> **Status 2026-09-10:** this review is historical. Chapter 4 was rebuilt against the PDF.
> The 2026-09-08 "repairs" had left wrong content in place:
> - the Sarang, Example 4.4, cyclist Q12 and clock Q16 presets;
> - the Q6, Q12 and Q13 exercise solutions;
> - Q10 using a = −2;
> - page citations computed by a formula;
> - a placeholder YouTube video (`dQw4w9WgXcQ`) on most Connect cards.
>
> See `COVERAGE.md` for the current mapping, and `tests/verify.cjs` plus `tests/browser.cjs` for the checks.

**Target:** `output/Class09/iesc104/index.html`  
**Chapter:** Class 9 Science, Chapter 4 — Describing Motion Around Us  
**Review date:** 2026-09-08  
**Review focus:** whether a learner can understand the motion demonstrations, whether the equations are readable and meaningful, and whether the seven interactive labs behave as labelled.

## Overall assessment

The chapter has a useful content structure and the numerical smoke tests pass, but the learner experience is not ready for classroom use. The central interaction is presented as **PLAY** and **INTERACTIVE**, while most controls only redraw a final state. A student is asked to infer motion from a static picture, a changed number, and a verdict. That is especially weak for distance versus displacement, acceleration, graph area, and tangent release, where the movement or changing quantity is the concept being taught.

The equations have a separate rendering defect. The stopping-distance equation is split at the multiplication dot, so the visible card ends with `s_stop = u` on one line and `t_react + ...` on the next. The card also shrinks to its content, uses a small 19 px type size, and shows literal caret and underscore notation such as `v^2` and `s_stop`. This is exactly the problem shown in the supplied screenshot.

## Evidence checked

- Read `index.html`, `chapter.json`, `map.json`, `COVERAGE.md`, and `tests/verify.cjs`.
- Ran the existing verifier: **all 133 assertions passed**.
- Opened the chapter in a browser at a wide desktop viewport and exercised the lesson navigation and presets.
- Browser console showed no errors or warnings during the manual pass.
- The automated verifier checks file size, data, arithmetic, navigation, and a mocked DOM. It does not check animation over time, visual hierarchy, responsive layout, or whether a learner can understand the demonstration.

Passing the verifier therefore gives a sound baseline for arithmetic and basic wiring, but it does not clear the chapter for instructional use.

## Release blockers — fix before asking students to use the chapter

### P0-1. The labs are state changers, not animations

**Observed problem:** preset buttons such as `Run to A`, `Motorbike Braking`, `Uniform Accel`, `Lift Ring`, and the graph time scrubbers change the SVG and readout immediately. There is no play/pause control, elapsed-time sequence, moving object, motion trail, or step-by-step transition. The source contains no `requestAnimationFrame`, `setInterval`, or `setTimeout` animation logic; it calls `draw()` directly from the click and input handlers. The only animation-related code is the reduced-motion CSS rule.

**Why it matters:** a learner sees “before” and “after” values but does not see what changed, which direction the object moved, when velocity changed, or why the graph area represents motion. Calling these controls **PLAY** sets the wrong expectation and makes the interaction feel arbitrary.

**Repair:** give every lab a small, consistent timeline control:

1. `Play`, `Pause`, `Step`, and `Reset`.
2. A visible current time, such as `t = 2.5 s`.
3. A moving object or marker, its trail, and the quantity being measured.
4. One sentence above the controls explaining what to watch.
5. A `Reduced motion: show steps` path that replaces continuous movement with discrete states.

The preset scenarios can remain, but they should load initial conditions. They should not be the only way to experience the concept.

### P0-2. “Predict first” is only a sentence

Each lab displays a prediction prompt, but there is no prediction field, answer choice, or checkpoint. The learner can immediately drag a slider or click a preset and read the result. The prompt is therefore decorative rather than a learning step.

**Repair:** add a compact prediction choice or number field with `Check prediction`. Keep the result hidden or partially covered until the learner submits, then show `Your prediction`, `Correct answer`, and `Why`. Provide a visible `Skip prediction` option only if needed for accessibility or teacher demonstration mode.

### P0-3. Activity 4.1 is not actually a ball toss

The coverage document describes a ball thrown to 140 cm and caught back at the hand. The button only jumps to the top position. There is no upward/downward motion and no catch state. The vertical readout shows `Ball Height 140 cm`, `Distance Travelled 140 cm`, and `Displacement +140 cm up`, while the verdict says the ball returns and has 280 cm distance and zero displacement.

There is also a direct control bug: the slider is declared with `max="100"`, but the button handler sets its value to `140`. The browser clamps the slider to 100 while the internal state and output show 140. This was visible in the browser accessibility state: the output read `+140 m` while the slider value was `100`.

**Repair:** make this a real sequence: `Throw`, `At peak`, `Catch`, or a timeline from 0 cm to 140 cm to 0 cm. Use a dedicated height slider with `min="0" max="140"` if manual control is needed. At each state show height, distance so far, and displacement from the hand. Only show the final 280 cm/0 cm conclusion after the catch state.

### P0-4. The graph coverage claims do not match the implementation

`COVERAGE.md` claims a data-point plotting animation for Activity 4.3 and a draggable slope triangle for Activity 4.4. The source has a time slider and a checkbox that shows or hides a triangle calculated from the selected time. There are no pointer, mouse, or touch drag handlers and no progressive plot animation.

**Repair:** either implement those interactions or correct the coverage language. For Activity 4.4, provide two draggable points or a draggable triangle with keyboard alternatives and live `Δs`, `Δt`, and slope. For Activity 4.3, reveal the table points one at a time and let the learner plot the next point before revealing the line.

### P0-5. Several presets produce incorrect or contradictory results

These are functional defects that can teach the wrong answer:

- **Cyclist preset:** `Cyclist Run (NCERT Ex Q12)` sets `state.scenario = "trip9"`, so it renders the same three-stage car journey as NCERT Ex Q9. The active button changes, but the graph, readout, caption, and verdict remain the Q9 scenario.
- **Sarang pool preset:** the state uses `3.6 km/h`, but the range input is set to `20`; the output says `3.6 km/h` while the slider represents 20. The verdict hardcodes `Average Speed = 80 km/h`, contradicting the readout's `3.6 km/h`.
- **Rohan clock preset:** the visual/readout uses `r = 7 cm` while `v` remains `6 m/s`. The code then calculates centripetal acceleration and lap time from mixed centimetre/metre units. It reports `5.1 m/s²` and `7.3 s` for a minute hand that should complete a revolution in 3600 seconds. The radius slider also remains at its previous value while the output changes to 7 cm.
- **Kinematics sliders:** after changing speed, reaction time, or braking deceleration, the selected preset remains `NCERT Ex Q10` and the verdict still says `NCERT Ex Q10 verdict`, even though the values no longer represent that question.
- **Circular lab state:** after `Lift Ring`, selecting the clock preset does not reset `released`; the clock view can retain a stale release verdict.

**Repair:** create a typed scenario object for each preset containing all inputs, units, range values, labels, caption, and expected result. Load the whole object atomically. Add one browser test per preset that checks the scenario label, graph signature, units, and verdict. Never hardcode a verdict value that is calculated elsewhere.

## High-impact teaching and interaction problems

### P1-1. The first viewport is dominated by an empty stage

At a wide desktop viewport, the two-column Learn/Play layout puts a large dark SVG panel beside the text. The controls and readouts sit below the diagram, so the first viewport shows a large stage and only the beginning of the controls. The initial 1D track has a tiny figure near the origin and a mostly empty dark area. The acceleration lab keeps the car in a fixed position and changes only arrows and numbers.

**Repair:** put the first actionable control and the key result in the opening viewport. Reduce unused stage height, enlarge the object and labels, and use a three-part arrangement: `What to predict` → `Do one action` → `What changed`. On desktop, let the equation and lab use the available width instead of preserving a large empty stage.

### P1-2. The visual does not preserve the path or the history

The distance/displacement lab calculates waypoint history internally but draws only the current figure and a net displacement arrow. After `Run to A` and `Turn to B`, the learner cannot see the 100 m outward leg and 60 m return leg; only the final position and numeric distance remain. The speed/velocity round-trip preset similarly shows one car and one arrow, not the north leg, south leg, time, or return to the starting point.

**Repair:** draw the travelled path in a separate color, retain waypoint markers, label each leg, and show an odometer that accumulates as the animation runs. For the round trip, show two consecutive segments and a start/end marker. The final displacement arrow should be visually distinct from the path.

### P1-3. The kinematics lab does not connect the emergency-stop picture to the three equations

The kinematics lesson introduces three equations and says they come from the geometry of a velocity-time graph. The lab itself shows a static road, thinking zone, braking zone, bus, and obstacle. Sliders change stopping-distance rectangles, but the bus does not travel through the reaction and braking phases, and no velocity-time graph is linked to the calculation.

**Repair:** use a synchronized two-panel view:

- top: bus moving through reaction and braking phases;
- bottom: velocity-time graph with the current time marker;
- side/readout: `s₁ = u × t_react`, `s₂ = u²/(2|a|)`, and total distance.

Highlight the relevant graph area as the bus moves. Let the learner change one variable at a time and ask which distance changes and why.

### P1-4. The velocity-time scrubber shows future areas as if they have already happened

In the three-stage journey, the source draws all three shaded regions, including the braking triangle from 15–21 s, regardless of the current scrubber time. The readout reports only the cumulative area up to the current time. At an early time the student can therefore see a future area while the number says it has not yet accumulated.

**Repair:** clip or progressively draw the curve and shaded area up to the current time. Use a lighter outline for the future path if it must remain visible, and label it `future`. The cumulative area should match exactly what is visually shaded.

### P1-5. The generic legend is inaccurate for several labs

The same legend is inserted for every simulation: `Displacement vector`, `Speed / acceleration`, and `Velocity vector`. The 1D track does not show all three. In the circular lab the centripetal acceleration is red, while the legend maps speed/acceleration to gold. A generic legend adds noise and can teach the wrong color mapping.

**Repair:** make the legend data-driven per lab. Hide unused items, match the actual stroke color, and add a static text alternative for every vector shown.

### P1-6. Important formulas use inconsistent, non-semantic notation

The visible equation data contains literal strings such as `v^2`, `u^2`, `s_stop`, `t_react`, `s_final`, and `s_initial`. The quick-read copy uses HTML superscripts and subscripts, but the key-equation renderer does not. Average speed uses `s / t` while `s` later denotes displacement in the kinematics equations. This forces a Class 9 learner to decode typography and changing symbols before doing physics.

**Repair:** use one notation system everywhere:

- average speed: `d / Δt`;
- average velocity: `Δs / Δt`;
- `s<sub>stop</sub>`, `t<sub>react</sub>`, `s<sub>final</sub>`, `s<sub>initial</sub>`;
- `<sup>2</sup>` for powers;
- a real fraction layout or MathML for `u²/(2|a|)`.

Give each equation a short label and an accessible spoken form. Keep the symbol definitions and the condition of use beside the equation.

### P1-7. The stopping-distance card is structurally broken and visually weak

The immediate cause of the supplied screenshot is in the renderer:

```js
var lines = l.formula.split(/\s*·\s*/);
```

The same middle dot is used both as the separator between equations and as multiplication inside `u·t_react`. The renderer therefore turns one equation into two lines. The card is styled as `display:inline-block` with `font:19px/1.75 Georgia`, so it does not use the available Learn column and the equations do not receive enough visual hierarchy.

**Repair:** change `formula` from a delimiter string to an array of equation records. For example:

```json
[
  {"label":"velocity–time", "html":"v = u + at"},
  {"label":"position–time", "html":"s = ut + ½at²"},
  {"label":"position–velocity", "html":"v² = u² + 2as"},
  {"label":"stopping distance", "html":"s_stop = u·t_react + u²/(2|a|)"}
]
```

Render it as a full-width block with one equation per row, approximately 26–32 px on desktop and 22–26 px on mobile. Use stronger contrast, more vertical spacing, a heading such as `Equations for constant acceleration`, and a visible condition line: `Use these only for one-dimensional motion with uniform acceleration.`

Do the same in the chapter revision grid. Do not put several equations separated by middle dots in one paragraph.

### P1-8. The physics wording overgeneralizes sign conventions

The acceleration lesson says that slowing down means `a < 0` and that a negative sign means braking. That is only true after choosing a positive direction and considering an object moving in the positive direction. The more general rule is that acceleration and velocity have opposite directions when the object slows down. The quick-read text states the general rule once, then narrows it incorrectly.

**Repair:** introduce the sign convention explicitly: `Choose the forward direction as positive. For a vehicle moving forward, braking gives a negative acceleration. In general, slowing down means a and v point in opposite directions.` Test the simulator with both positive and negative initial velocities if direction is part of the lesson.

### P1-9. The velocity-time area explanation conflates displacement and distance

The chapter says that area under a velocity-time graph gives the “magnitude of displacement (distance travelled)” and the practice answer accepts `Displacement (distance travelled)`. Signed area under a velocity-time graph gives displacement. Distance requires the area under speed, or the sum of absolute areas when velocity changes sign. The current wording is only safe for motion whose velocity stays non-negative.

**Repair:** teach the distinction directly and either keep all examples on the positive side of the axis or add a negative-velocity example showing signed cancellation. Update the quick read, deeper text, caption, quiz option, and solution together.

### P1-10. The derivation promise is deferred and disconnected

The kinematics “Go a little deeper” text says the equations come from the slope and area of a velocity-time graph, but the learner must expand a details element after seeing the simulator. The simulator does not show the derivation or link a graph region to each equation.

**Repair:** put a short visual derivation directly under the equation card: slope gives `v = u + at`; rectangle plus triangle gives `s = ut + ½at²`; substitution gives `v² = u² + 2as`. Let each line highlight the corresponding portion of a small graph.

### P1-11. The first exposure contains too much enrichment vocabulary

The core flow introduces or relies on terms such as `kinematic`, `instantaneous`, `infinitesimal`, `centripetal`, `EMAS`, and `Ganitakaumudi`, alongside aviation, satellites, seismology, black boxes, and traffic telemetry. These can be useful connections, but they compete with the one idea the learner is meant to retain. The headings also use phrases such as “master equations” and “area reveals distance” before the learner has a concrete mental model.

**Repair:** use plain language at first exposure, define one new term at a time, and move enrichment into clearly marked optional cards. Replace `master equations` with `three equations for constant acceleration` and put `kinematic` in the definition, not the navigation label alone. Keep one real-life example per lesson in the primary path.

### P1-12. Practice is too narrow for a concept chapter

Each lesson exposes three questions: Easy, Medium, and Hard. The set is useful for smoke testing, but it is too small to establish mastery of a chapter with seven concepts, especially when the simulations do not enforce prediction or provide a guided sequence.

**Repair:** provide a short progression per concept: one prediction, one representation question, one calculation, one misconception check, and one NCERT transfer question. Keep Hard as an optional extension after the learner has demonstrated the core idea. Add feedback that names the exact misconception, such as “same position is not the same as same velocity.”

## Accessibility and product issues

### P1-13. The SVG accessible name is wrong and does not update

The renderer hardcodes `aria-label="Kinematic motion visualization"` for all seven labs, including the speedometer, position-time graph, velocity-time graph, and circular-motion arena. The verdict is updated dynamically but has no `aria-live` region. The readout is live, which is a good start, but it is not a complete textual equivalent of the graph or vector directions.

**Repair:** provide a per-lab accessible name and update a concise live description such as `At t = 3 s, position is 60 m; velocity is 20 m/s; slope triangle gives 20 m/s`. Give the verdict `role="status"` or `aria-live="polite"`. Ensure the same information is available without relying on SVG child text.

### P1-14. The media cards compete with the core lesson and are not fully offline

The core reading and simulations are self-contained, but each lesson adds a remote YouTube thumbnail and an online video facade, plus a Wikipedia link. The page does explain that external media needs internet, but a broken thumbnail or an online-only enrichment card still consumes attention and space in the learning path.

**Repair:** keep media below practice or behind an `Optional extension` disclosure. Use a local placeholder with the video title, duration, and transcript/caption link. Do not make the visual quality of the core lesson depend on `i.ytimg.com`.

### P1-15. The wide layout wastes space where the learner needs clarity

The lab is capped at 780 px while the equation card is an inline shrink-to-content element. On the wide desktop capture, the lab stage is large but the equation card is narrow. The page has enough horizontal room for a full-width equation panel and a more legible linked graph.

**Repair:** use a deliberate max-width for reading text, then allow the equation/visual pair to occupy the available content width. Make the lab stage height adapt to its actual diagram. Test at 360, 390, 768, 1280, and 1440 px widths.

## Lower-priority but worthwhile repairs

### P2-1. Progress is lost on refresh

The practice state is held in an in-memory object. There is no `localStorage`, session persistence, or “clear progress” control. A student who closes the tab loses the progress shown as `Your practice 0 / 21`.

**Repair:** save answers/correct state under a chapter-and-edition key, show a reset option, and keep privacy-sensitive data local to the browser.

### P2-2. Lesson navigation has no deep link or browser history state

Concepts are rendered by JavaScript without updating the URL or history. Refreshing returns to the first lesson and browser Back does not move through lessons.

**Repair:** use a hash or query parameter for the lesson ID, update it on navigation, restore it on load, and retain the revision anchor separately.

### P2-3. The builder is currently a stub

There is a file named `scripts/build_chapter4.py`, but it only creates the output directory and prints `Builder script ready.` It does not read `chapter.json`, `map.json`, or write `index.html`. The self-contained HTML therefore has embedded data that can drift from the JSON files.

**Repair:** make one real build command the source of truth, add a generated-file marker, and have CI rebuild then compare the generated output. Add a test that fails if the embedded chapter data differs from `chapter.json` or `map.json`.

### P2-4. The current verifier does not protect the learner experience

The 133 assertions are valuable for data and arithmetic, but the DOM harness supplies mocked elements and even defines `requestAnimationFrame` without proving that the application uses it. It cannot catch the broken cyclist preset, mixed clock units, slider/output mismatches, equation line wrapping, future graph shading, or poor first-viewport layout.

**Repair:** add browser-level checks that click every preset and assert a scenario-specific marker, units, and verdict. Add screenshot checks at the five target widths, keyboard checks for every control, and a short teacher/learner usability pass. The acceptance test should ask a new learner to explain what changed after each interaction, not merely whether the number changed.

## Recommended repair order

1. Fix the incorrect preset states and the Activity 4.1 slider contradiction.
2. Replace the delimiter-based equation model and rebuild the equation cards with semantic superscripts/subscripts, full width, labels, and conditions.
3. Implement the prediction checkpoint and a consistent Play/Pause/Step/Reset timeline.
4. Rebuild the distance/displacement, acceleration, velocity-time, kinematics, and tangent demonstrations around visible history and synchronized readouts.
5. Correct the displacement/distance and sign-convention wording.
6. Correct accessibility names, live verdicts, legend colors, media placement, and responsive layout.
7. Replace the builder stub and expand browser-level verification.
8. Only then ask a teacher and several Class 9 learners to use the chapter without coaching. Record where they hesitate, what they click first, and whether they can explain the result in their own words.

## Acceptance criteria for the next revision

- A learner can press Play and see a meaningful change over time in every lab; Step works without animation.
- Every prediction prompt can be answered and checked before the result is revealed.
- Activity 4.1 visibly includes up, peak, and return; Activity 4.3 progressively plots; Activity 4.4 supports dragging or the coverage text is corrected.
- Every preset renders its own graph, inputs, units, caption, and verdict. No stale scenario names remain after slider changes.
- The kinematics card shows four complete equations, one per row, at a readable size. `s_stop`, `t_react`, and powers are typeset semantically, and the stopping formula never wraps into two unrelated lines.
- The velocity-time lesson distinguishes signed displacement from distance.
- The clock example uses one consistent unit system and a 3600-second period.
- The SVG description, live readout, and verdict communicate the same state to sighted and screen-reader users.
- Browser tests cover all 7 lessons × all presets at desktop and mobile widths, plus keyboard operation.
- A teacher and a small group of Class 9 learners can describe the idea demonstrated by each lab without being told which button to press.
