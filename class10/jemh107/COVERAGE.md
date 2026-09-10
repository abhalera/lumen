# jemh107 Coordinate Geometry pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh107.pdf`, 14 pdf pages, printed pp. 99–112, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + PNG zooms). Every equation line authored here was checked against a 170-dpi PNG zoom in `/tmp/opencode/jemh107_work/` (23 clips: town/Fig7.1, PQ=2√2, √170, origin+Remarks, Ex1–Ex10 solutions, tower, section+midpoint boxes, trisection, Fig 7.8/7.12 grids, summary box).

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 7.1 play: address system, abscissa/ordinate, (x,0)/(0,y), plot-to-picture | 1 | axes-plane Connect/deeper | implemented |
| 7.2 town 36 km E + 15 km N → 39 km (Fig. 7.1); axis pairs AB = 2, CD = 5 | 2 | axes-plane, first-steps, general-distance | implemented, PNG zoom cited |
| Fig. 7.3 P(4,6)–Q(6,8): PT = RS = 2, QT = 2, PQ² = 8, PQ = 2√2 | 3 | first-steps | implemented, PNG zoom cited |
| P(6,4)–Q(−5,−3): PT = 11, QT = 7 (Why?), PQ = √170 (Fig. 7.4) | 3 | first-steps | implemented, PNG zoom cited |
| General derivation Fig. 7.5: RS = x₂−x₁ = PT, QT = y₂−y₁, PQ² = PT²+QT² | 4 | general-distance | implemented, PNG zoom cited |
| Remarks: OP = √(x²+y²); twin √((x₁−x₂)²+(y₁−y₂)²) (Why?); positive root | 4 | general-distance | implemented, PNG zoom cited |
| Example 1: √50, √52, √2 → triangle + converse ⟹ ∠P = 90° | 4 | shapes-proof | implemented, PNG zoom cited |
| Example 2: sides √34 ×4, diagonals √68 ×2 ⟹ square; alt AD²+DC² = AC² | 5 | shapes-proof | implemented, PNG zoom cited |
| Example 3 (desks): AB = 3√2, BC = 2√2, AC = 5√2, AB+BC = AC ⟹ collinear | 6 | collinear-seats | implemented, PNG zoom cited |
| Example 4: AP = BP ⟹ x−y = 2; Remark: perpendicular bisector (Fig. 7.7) | 6 | equidistant-locus | implemented, PNG zoom cited |
| Example 5: y-axis point (0,9); check AP = BP = √52; Note on bisector ∩ axis | 6–7 | equidistant-locus | implemented, PNG zoom cited |
| Ex 7.1 Q1–Q10 (pairs; 39 km; Q3 collinear; isosceles; square; rhombus-area hint) | 7–8 | all (map rows 1–10) | located in exerciseMap; Q-patterns in quizzes/worked |
| 7.3 tower: OD/PC = PD/BC = OP/PB = 1/2 → x = 12, y = 5; AA ΔPOD ~ ΔBPC | 8 | tower-ratio | implemented, PNG zoom cited |
| General §7.3: PAQ ~ BPC, m₁/m₂ = (x−x₁)/(x₂−x), section formula (2) | 9 | section-general | implemented, PNG zoom cited |
| k:1 form; midpoint 1:1 box | 9 | section-general | implemented, PNG zoom cited |
| Example 6: 3:1 → (7,3) | 10 | section-general | implemented, PNG zoom cited |
| Example 7: (−4,6) on (−6,10)–(3,−8) → 2:7 (x-line + y-check); k:1 alt | 10–11 | section-general | implemented, PNG zoom cited |
| Example 8: trisection (−1,0) at 1:2, (−4,2) at 2:1; midpoint-of-PB note | 11 | section-general | implemented, PNG zoom cited |
| Example 9: y-axis cut 5:1, (0,−13/3) | 12 | section-general | implemented, PNG zoom cited |
| Example 10: parallelogram midpoints equal ⟹ p = 7 | 12 | section-general | implemented, PNG zoom cited |
| Ex 7.2 Q1–Q10 (2:3; trisection; flags; cuts; parallelogram; diameter; 3/7; quarters; rhombus area) | 13 | section-general + shapes-proof (Q10) | located in exerciseMap; Q-numbers recomputed in worked/deeper |
| 7.4 Summary (4 points) + Note to Reader (internal vs external division) | 14 | revision strip + section deeper | implemented, PNG zoom cited |

Videos (all YouTube-oEmbed-verified 2026-09-08, search-length cross-checked, never invented):
`pAlq9fFwtus` 6:47 Introduction to the coordinate plane (Khan Academy);
`AA6RfgP-AHU` 10:46 The Pythagorean theorem intro (Khan Academy);
`nyZuite17Pc` 9:39 Distance formula (Khan Academy);
`vsgrWDLEzcQ` 5:08 Classifying a quadrilateral on the coordinate plane (Khan Academy);
`gj1eFQLaJCE` 4:40 Finding a point part way between two points (Khan Academy);
`SC0o2ERL7nY` 6:53 Points Equidistant from 2 Given Points (Khan Academy India - English);
`Cx-_PxD4DJM` 3:57 Dividing line segments according to ratio (Khan Academy);
`XOLry3IRNyE` 11:07 Section Formula | Coordinate Geometry | TG Grade 10 (Khan Academy India - English).
Reading links: 1 Wikipedia article per Wow (Cartesian system, Pythagorean theorem, Euclidean distance, Quadrilateral, Collinearity, Perpendicular bisector, Section formula, Midpoint).

Syllabus honesty: this rationalised PDF (14 pp, ends at Summary + Note to Reader) contains NO triangle-area / shoelace formula — area appears ONLY as a labelled sim helper (`helper area`), never as an NCERT claim; collinearity is taught via the distance-sum test (Ex3). The user brief asked for `area of triangle` coverage; there is nothing in-source to cover, so no such concept was invented. Likewise Ex 7.2 Q10's rhombus-area hint (½ × d₁ × d₂) is mapped, not taught as a derived formula.

Gaps (honest): full written solutions of all 20 exercise rows are mapped, not solved in-page (patterns + Q-numbers covered in quizzes/worked); flag-problem distances (Ex 7.2 Q13) need the Fig. 7.12 grid overlay — mapped, pending; browser matrix/teacher/learner review pending.
