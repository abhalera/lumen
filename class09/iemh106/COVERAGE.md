# Chapter 6 Coverage: Measuring Space: Perimeter and Area (iemh106)
**Textbook:** Ganita Manjari, Grade 9 Part I (NCF 2024–26 Reprint)  
**Curriculum Scope:** Pages 118–154 (37 pages)  
**Standard:** Golden Reference 5-Block Pedagogical Architecture  
**Deliverable:** Standalone single-file HTML (`index.html`), 100% offline, strictly < 2.0 MB budget.

---

## 1. Executive Summary & Curriculum Audit

| Metric | Target / Standard | Achieved Status | Verification |
| :--- | :--- | :--- | :--- |
| **Concepts** | 6 Deep Conceptual Units | **6 Concepts** | Verified via `chapter.json` & DOM |
| **Interactive Labs** | 6 Canvas/SVG Manipulatives | **6 Engines** | Full timeline controls (`▶ Play`, `⏸ Pause`, `⏭ Step`, `↺ Reset`) |
| **Formulas** | Complete Derivations | **24 Formulas** | Markdown math equations |
| **Practice Quizzes** | 3 per Concept with Hints | **18 Quizzes** | Complete hints and pedagogical explanations |
| **In-Text Exercises** | Sets 6.1, 6.2, 6.3 | **29 Items** | Verbatim text, worked solutions |
| **End-of-Chapter Exercises** | Questions 1 to 27 | **27 Items** | Verbatim text, step-by-step guidance |
| **Total Exercise Items** | Complete Textbook Coverage | **56 Items** | 100% coverage, zero omissions |
| **Pedagogical Guidance** | Native Expandable `<details>` | **56 / 56** | Includes `"Step-by-Step Pedagogical Guidance"` |
| **Offline File Budget** | Strictly < 2,048 KB | **~210 KB** | Standalone zero-CDN single-file HTML |

---

## 2. Concept Breakdown & Pedagogical Mapping

### Concept 1: Perimeter of Shapes and the C/D Ratio (π) (pp. 118–123)
- **Sections Covered:** 6.1 Perimeter of a Shape, 6.2 Perimeter of a Circle — The C/D Ratio.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Linear boundary walking, dimensional scaling laws (square 4:1, triangle 3:1, circle $\pi:1$). The 3500-year historical quest for $\pi$: Mesopotamia hexagon ($3.125$), Archimedes 96-gon ($3rac{10}{71} < \pi < 3rac{1}{7}$), Ptolemy ($3.14167$), Zu Chongzhi ($22/7$ and $355/113$), Āryabhaṭa (*āsanna* $62832/20000 = 3.1416$), Brahmagupta ($\sqrt{10} pprox 3.1622$), and Mādhava of Saṅgamagrāma's revolutionary infinite analytical series $rac{\pi}{4} = 1 - rac{1}{3} + rac{1}{5} - rac{1}{7} + \dots$
  2. *Predict First:* Effect of doubling circle diameter on $C/D$ ratio.
  3. *Play (Manipulative):* Archimedes Polygon Bounds & Mādhava Series Explorer. Inscribed/circumscribed $N$-gons ($N=6, 12, 24, 48, 96$) and dynamic series term accumulator ($K=1\dots 50$).
  4. *Connect:* Road curvature banking, satellite geostationary orbital velocity.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Scale invariance cards and historical milestone summary.

### Concept 2: Arc Length & Athletics Track Stagger Geometry (pp. 123–128)
- **Sections Covered:** 6.3 $\pi$ Is Irrational, 6.4 Length of an Arc of a Circle, Olympic 400 m Athletics Track.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Lambert's 1761 proof of irrationality, why $\pi 
e 22/7$, Pi Day vs Pi Approx Day. Derivation of arc length $l = 2\pi r 	imes (	heta / 360^\circ)$ via circle rotational symmetry. 400 m Olympic track anatomy: straights $84.39$ m, bend radius $36.8$ m, lane width $1.22$ m. Exact stagger derivation $\Delta s = 2\pi w pprox 7.67$ m. Semicircle path paradox ($a = b+c+d$).
  2. *Predict First:* Stagger required if lane width increases to 2.0 m.
  3. *Play (Manipulative):* Olympic 400 m Running Track & Lane Stagger Lab. Dynamic lane selector (Lanes 1–8), animated runner traversing 400 m lap, real-time uncompensated vs staggered distance meters.
  4. *Connect:* World Athletics competition tolerances, multi-core fiber optic pipeline bending.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Stagger formula $	ext{Stagger}(n) = 2\pi w(n-1)$ and arc length equations.

### Concept 3: Area of Parallelograms, Triangles & The Median Theorem (pp. 130–134)
- **Sections Covered:** 6.6 Area of a Rectangle, 6.7 Area of a Parallelogram, 6.8 Area of a Triangle.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Area units ($1 	imes 1$ square), rectangle $ab$, parallelogram $bh$ via rectangular shearing; thin parallelogram shear decomposition. Triangle area $rac{1}{2}bh$ via congruent doubling into parallelogram. The Fundamental Median Theorem: any median divides a triangle into two regions of strictly equal area ($A_1 = A_2 = rac{1}{2}ah$). Bolyai–Gerwien polygon dissection theorem and isoperimetric maximum for rectangles.
  2. *Predict First:* Ratio of areas when a cevian divides the base in ratio 1:2.
  3. *Play (Manipulative):* Shear Invariance & Triangle Median Area Lab. Interactive apex dragging along parallel lines proving invariant sub-areas, and horizontal parallelogram shearing preserving $bh$.
  4. *Connect:* Architectural King-post roof truss load distribution, centroid & dynamic robot center of gravity.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Parallelogram and median theorem summary cards.

### Concept 4: Heron's Formula & Incircle/Circumcircle Formulas (pp. 134–137)
- **Sections Covered:** 6.8.1 Heron's formula, Incircle and Circumcircle connections.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Semi-perimeter $s = (a+b+c)/2$, Heron's formula $	ext{Area} = \sqrt{s(s-a)(s-b)(s-c)}$. Rigorous verification on equilateral triangle ($(\sqrt{3}/4)a^2$), isosceles triangle ($b\sqrt{a^2-b^2}$), and 3-4-5 right triangle. Alexandrian dual circles: Incircle radius $r = 	ext{Area}/s$ and Circumcircle radius $R = abc/(4	ext{Area})$.
  2. *Predict First:* Area of 13-14-15 integer Heron triangle.
  3. *Play (Manipulative):* Heron's Triangle & Dual Circles Explorer. Dynamic side sliders $a, b, c$ enforcing triangle inequality, live calculation of $s$, differences, area, and simultaneous SVG rendering of incircle and circumcircle.
  4. *Connect:* Satellite GPS trilateration, delta-wing aerodynamic lift distribution.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Heron factor tables and inradius/circumradius quick references.

### Concept 5: Brahmagupta's Formula & Squaring a Rectangle (pp. 137–142)
- **Sections Covered:** Brahmagupta's Formula for Cyclic 4-gons, Special Cases & Generalisation, 6.9 Squaring a Rectangle (Baudhāyana Śulbasūtra).
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Quadrilateral area indeterminacy from 4 sides alone (rhombus flexing between 9 and 0). Brahmagupta's theorem for cyclic quadrilaterals: $	ext{Area} = \sqrt{(s-a)(s-b)(s-c)(s-d)}$. Grand generalisation: letting $d 	o 0$ collapses vertex $D$ into $A$, smoothly yielding Heron's formula! Verification on rectangles and isosceles trapezia. Baudhāyana's 800 BCE Śulbasūtra construction for squaring a rectangle: $((a+b)/2)^2 - ((a-b)/2)^2 = ab$.
  2. *Predict First:* Reduction of Brahmagupta formula when $d=0$.
  3. *Play (Manipulative):* Brahmagupta Cyclic 4-gon & Baudhāyana Squaring Lab. Continuous slider shrinking side $d 	o 0$, showing dynamic quadrilateral morphing into a triangle with exact area match, and Baudhāyana compass-and-straightedge square constructor.
  4. *Connect:* 3D computer graphics polygon planarity verification, Vedic ritual fire altar conversions.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Cyclic quadrilateral area formula and Baudhāyana identity summary.

### Concept 6: Area of Circles, Sectors, Segments & Nīlakaṇṭha's Dissection (pp. 143–148)
- **Sections Covered:** 6.10 Area of a Circle, 6.10.1 Sector and Segment of a Circle.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Babylonian $C^2/12$ and Egyptian $(8/9 d)^2 = (256/81)r^2$. Archimedes polygon limit $	ext{Area} = rac{1}{2}Cr = \pi r^2$. Nīlakaṇṭha Somayājī's (c. 1500 CE) visual circle-slice unrolling into an alternating parallelogram of base $\pi r$ and height $r$. Sector area $\pi r^2(	heta/360^\circ)$ and segment area $	ext{Sector} - 	ext{Triangle}$.
  2. *Predict First:* Shape of 64 interlocked circular wedges.
  3. *Play (Manipulative):* Nīlakaṇṭha Circle-Slice Unrolling & Sector/Segment Explorer. Wedge slider ($N=8, 16, 32$) and unroll animation slider transforming circle into parallelogram, plus interactive sector/segment angle scrubber.
  4. *Connect:* Agricultural center-pivot irrigation, automotive wiper sweep optimization.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Sector, segment, and circular ring formula reference.

---

## 3. Verbatim Exercise Sets Audit (56 Items)

| Section | Question IDs | Count | Topic / Key Result | Guidance |
| :--- | :--- | :--- | :--- | :--- |
| **Exercise Set 6.1** | `ex-6-1-1` to `ex-6-1-8` | 8 | Circumference, radius, arc lengths, sector perimeters, composite boundaries, tyre revolutions, flower petal perimeters | 100% Worked |
| **Exercise Set 6.2** | `ex-6-2-1` to `ex-6-2-11` | 11 | Triangle/trapezium areas, Heron applications, rhombus diagonals, parallelogram shears, median subtractions, square quadrant ratios, parallel line shears | 100% Worked |
| **Exercise Set 6.3** | `ex-6-3-1` to `ex-6-3-10` | 10 | Sector areas, quadrant areas, clock sweeps, minor/major sectors and segments, car wiper areas, algebraic segment proofs, inscribed triangle/square/hexagon ratios | 100% Worked |
| **End-of-Chapter** | `eoc-6-1` to `eoc-6-27` | 27 | Algebraic area identities, isosceles/right triangles, bicycle/car turns, rectangle congruence proof, trapezium proofs (shear, diagonal, double copy), kite area, scaling laws ($k^2$), midpoint fractions, circle grid packing conjecture ($\pi/4$), 9-rectangle puzzle, trisection areas, quarter-circle/semicircle equality, 4-petal flower, concentric annulus chord, Pythagorean semicircles, overlapping circles, 3-triangle rectangle formula, and circular-wedge equality | 100% Worked |
| **TOTAL** | **56 Items** | **56** | **All 56 Textbook Questions Complete** | **100% Passed** |

---

## 4. Verification Suite & Architectural Quality Gate

The chapter was verified against the automated Node.js suite `tests/verify.cjs`:
1. **Mathematical Algorithm Verification:**
   - Archimedes 96-gon polygon bounds correctly sandwich $\pi$: $3.1408 < 3.1410 < \pi < 3.1427 < 3.1429$.
   - Athletics track stagger formula verified: $\Delta s = 2\pi w pprox 7.67$ m per lane.
   - Triangle median division theorem verified: both halves have strictly identical areas.
   - Heron's formula verified on 13-14-15 triangle ($s=21, A=84, r=4, R=8.125$).
   - Brahmagupta cyclic quadrilateral formula verified ($A=30$), and $d 	o 0$ reduction to Heron verified ($A=6$).
   - Baudhāyana squaring identity $((a+b)/2)^2 - ((a-b)/2)^2 \equiv ab$ verified for $16 	imes 9 = 144$ (square side 12).
   - Concentric annulus tangent chord theorem verified ($A = rac{1}{4}\pi l^2$).
2. **Curriculum Schema:**
   - All 6 concepts, 18 quizzes with hints, and 56 exercises validated.
3. **Budget & Offline Safety:**
   - HTML size is ~200 KB (strictly under 2,048 KB).
   - Zero external CDNs, zero remote tracking, zero preloaded iframes.
   - All inline scripts parse without syntax errors.
4. **DOM Simulation Sandbox:**
   - All 6 simulation engines initialize, update, and render cleanly in a headless DOM environment.
