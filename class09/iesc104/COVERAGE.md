# COVERAGE — iesc104 Describing Motion Around Us

**Source:** `books/originals/Class09-Science_iesc104.pdf`. NCERT *Exploration*, Grade 9, Chapter 4 (reprint 2026–27), 24 PDF pages, printed pp. 48–71 (printed page = PDF page + 47).
**SHA-256:** `9a9299f272e2e760b7b58e4ecbf697fd65e51ab0fe181d55c0aff8ce4d19e8a4`

**Build:** `python3 scripts/build_chapter.py iesc104`. It combines `chapter.json`, `figures.js` and `sims.js` with the shared `scripts/templates/app.js` and `styles.css`.
**Checks:**
- `node output/Class09/iesc104/tests/verify.cjs`: data, typography and recomputed NCERT answers.
- `tests/browser.cjs`: every lab scenario in Chrome, end-state values, console errors and screenshots.

Every number below was checked against the PDF text or, for graphs, the vector coordinates in the PDF. Items marked *illustrative* are not from the textbook and are labelled that way on the page.

## Concepts

| # | Concept | NCERT section | PDF pp. | Printed pp. | Lab (`sims.js`) |
|---|---|---|---|---|---|
| 1 | Position, distance & displacement | 4.1, 4.1.1, 4.1.2 | 2–4 | 49–51 | `track1d` |
| 2 | Average speed & average velocity | 4.1.3 | 5–7 | 52–54 | `speedvel` |
| 3 | Average acceleration | 4.1.4 | 7–9 | 54–56 | `accel` |
| 4 | Position–time graphs | 4.2, 4.2.1, 4.2.2 | 9–13 | 56–60 | `stgraph` |
| 5 | Velocity–time graphs | 4.2.3 | 14–16 | 61–63 | `vtgraph` |
| 6 | Kinematic equations | 4.3 | 16–18 | 63–65 | `kinematics` |
| 7 | Uniform circular motion | 4.4, 4.4.1 | 19–21 | 66–68 | `circular` |

## Activities, examples and figures

| NCERT item | Where it appears | Lab scenario |
|---|---|---|
| Think It Over (safe distance behind a truck) | C6 deck, Connect | Exercise Q10 |
| Fig. 4.3 / 4.4 athlete O → B → A → B (0, 4, 10, 16 s) | C1 worked example | `Fig. 4.4: O → A → B` (160 m, +40 m) |
| Activity 4.1 ball to B = 140 cm, Table 4.1 (O, A 40 cm, B 140 cm, C 80 cm, O) | C1 Hard quiz | `Activity 4.1: ball thrown up` (live Table 4.1, answer (iii)) |
| Pause & Ponder Q1 (when is displacement zero) | C1 prediction | `Pause & Ponder Q1: back to O` (200 m, 0 m) |
| Pause & Ponder Q2 (fuel: distance or displacement) | C1 Easy quiz | — |
| Pause & Ponder Q3 (ball on inclined track) | C1 Learn text (one direction, so distance = displacement) | — |
| Example 4.1 two postmen, Ganitakaumudi (15 days) | C2 Connect | `Example 4.1: two postmen` |
| Example 4.2 Sarang, 25 m pool, 50 s (1 m s⁻¹, 0 m s⁻¹) | C2 worked example | `Example 4.2: Sarang's swim` |
| Pause & Ponder Q4 road trip (80 km h⁻¹, 0) | C2 prediction, Medium quiz | `Pause & Ponder Q4: road trip` |
| Pause & Ponder Q5 (when average velocity equals or is zero) | C2 Hard quiz, Go deeper | road trip (equal during leg 1) |
| Threads of Curiosity (speedometer) / instantaneous velocity | C2 Go deeper | — |
| Activity 4.2 (0–100 km h⁻¹ times) | C3 Connect | `Activity 4.2: 0–100 km h⁻¹` (slider) |
| Example 4.3 bus (+0.5 m s⁻², −3 m s⁻²) | C3 worked example | `Example 4.3 (i)`, `Example 4.3 (ii)` |
| Example 4.4 / Fig. 4.10 dropped object (g = 9.8 m s⁻², down positive) | C3 Go deeper, Hard quiz | `Example 4.4: dropped object` |
| Activity 4.3, Table 4.3, Fig. 4.11 plotting | C4 Learn | `Activity 4.3: plot Table 4.3` |
| Example 4.5, Table 4.4, Fig. 4.12/4.13 curved graph | C4 Easy quiz | `Example 4.5: speeding up` (slope 4–6 s vs 10–12 s) |
| Activity 4.4, Fig. 4.14 (A 2 s, 40 m; B 4 s, 80 m; 20 m s⁻¹) | C4 worked example | `Activity 4.4: slope from A and B` (draggable A/B) |
| Example 4.6, Fig. 4.15 (at rest at 40 m) | C4 prediction | `Example 4.6: at rest` |
| Example 4.7, Fig. 4.16 (steeper line is faster) | C4 Go deeper | Exercise Q6 scenario |
| Fig. 4.17(a–e), Tables 4.5–4.6 (slope ±0.5 m s⁻²) | C5 Learn, Medium quiz | `Fig. 4.17(c): slowing down` |
| Fig. 4.18(a) 20 m s⁻¹ × 6 s = 120 m | C5 prediction | `Fig. 4.18(a): steady 20 m s⁻¹` |
| Fig. 4.18(b) area 10–20 s = 75 m | C5 worked example | `Fig. 4.18(b): speeding up` |
| Fig. 4.19 derivation of Eq. 4.4a–c | C6 Learn, Go deeper | v–t panel in the stopping lab |
| Example 4.8 braking at −4 m s⁻² (28.1 m, 112.5 m) | C6 worked example, prediction | `Example 4.8 (i)`, `Example 4.8 (ii)` |
| Bridging Science and Society (safe distance, V2V) | C6 Connect | — |
| Fig. 4.21–4.22 motion in a plane, merry-go-round | C7 Learn; worked example with *illustrative* numbers (R = 3 m, T = 12 s) | — |
| Fig. 4.23 rectangle → hexagon → circle | C7 Go deeper | `Fig. 4.23: polygon to circle` |
| Activity 4.5 marble in a ring, Fig. 4.24–4.25 tangent | C7 prediction | `Activity 4.5: marble in a ring` (Lift the ring) |
| Eq. 4.5 average speed 2πR/T | C7 formulas, satellite Connect card | — |
| The Journey Beyond (spinning disc, Phyphox, two extra equations, graph scales, mechanic) | C7, C3, C6, C4 Connect / Go deeper | — |

## End-of-chapter exercises (Revise, Reflect, Refine)

All 16 are on the revision page with the verbatim question text, the figure where one is cited (redrawn in `figures.js`), a step-by-step solution, the final answer and a takeaway.

| Q | Concept | Figure | Answer |
|---|---|---|---|
| 1 | C1 | — | 1000 m; 0 m |
| 2 | C1 | — | 18 m; 6 m upward |
| 3 | C7 | — | Yes, when turning (direction changes) |
| 4 | C3 | — | 4 m s⁻²; 72 m |
| 5 | C3 | — | −4 m s⁻²; 7 s |
| 6 | C4 | Fig. 4.27 | No: constant, different slopes; they only share a position at 5 s |
| 7 | C4 | Fig. 4.28 | (i) and (ii) |
| 8 | C6 | Fig. 4.29 | 450 m |
| 9 | C5 | — | 310 m (lab scenario) |
| 10 | C6 | — | 25 m, stops 5 m before (lab scenario) |
| 11 | C1 | — | Depends on the reference point |
| 12 | C5 | Fig. 4.30 | 240 m, 50 m; 320 m; ≈ 0.017 m s⁻² (lab scenario) |
| 13 | C5 | Fig. 4.31 | ≈ 47 km (estimate from graph readings) |
| 14 | C5 | — | 774 m |
| 15 | C5 | — | 12.5 m; 15 m |
| 16 | C7 | Fig. 4.32 | 66 cm; 14 cm; 0.0122 cm s⁻¹; 0.0026 cm s⁻¹ (lab scenario) |

Figs. 4.27 and 4.28 have no numbers on the position axis in the textbook. The lab and figures use values that reproduce their shapes: A = 10t and B = 20 + 6t, crossing at 5 s. These are marked as illustrative on the page.

## Connect videos

All seven videos are Khan Academy videos. Their IDs were checked against YouTube's oEmbed titles on 2026-09-10, and they load only when clicked (online). There are no placeholder videos.
