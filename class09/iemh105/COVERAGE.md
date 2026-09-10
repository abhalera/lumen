# Curriculum & Pedagogical Coverage: Class 9 Mathematics Chapter 5
## Round and Round (Circles) (`iemh105`)
**Textbook**: NCERT *Ganita Manjari*, Grade 9 Part I (2024–26 NCF Reprint)  
**Syllabus Range**: pp. 92–117  
**Architectural Standard**: Golden Reference (5-Block Pedagogical Pipeline)

---

### 1. Concept-to-Curriculum Mapping

| Concept ID | NCERT Section & Topic | Page Range | Interactive Manipulative Engine | Quizzes |
| :--- | :--- | :--- | :--- | :--- |
| **c1** | 5.1, 5.2, 5.3 Definitions, Symmetries & Number of Circles Through Points (Centre, radius, chord, diameter, arc, sector, segment, infinite reflectional/rotational symmetries, circles through 1, 2, and 3 points, circumcircle) | pp. 92–98 | `sim-circle-symmetries`: Circumcircle explorer, acute vs right vs obtuse circumcentre position detector | 3 MCQs |
| **c2** | 5.4 Chords and the Angles They Subtend (Isosceles chord triangles $\Delta OAB$, Theorem 1: equal chords subtend equal central angles, Theorem 2: converse, $60^\circ$ equilateral chord case) | pp. 98–100 | `sim-chord-angles`: Chords and central angle comparator, SSS/SAS congruence verifier | 3 MCQs |
| **c3** | 5.5 Midpoints and Perpendicular Bisectors of Chords (Theorem 4: centre-to-midpoint is perpendicular, Theorem 5: converse, RHS congruence, fundamental right triangle $r^2 = d^2 + (L/2)^2$) | pp. 100–102 | `sim-chord-bisector`: Interactive perpendicular bisector, dynamic chord length $L = 2\sqrt{r^2 - d^2}$ calculator | 3 MCQs |
| **c4** | 5.6 & 5.6.1 Distance of Chords from Centre & Relative Chord Lengths (Theorem 6: equidistant chords, Theorem 7: converse, monotonicity: longer chords are closer to centre, parallel chords on same/opposite sides) | pp. 102–106 | `sim-chord-distance`: Parallel chords solver (10 cm & 24 cm, 6 cm & 8 cm), distance vs length hierarchy | 3 MCQs |
| **c5** | 5.7 & 5.7.1 Angles Subtended by an Arc (Theorem 8: Central Angle Theorem $\angle AOB = 2\angle APB$, Theorem 9: angles in same segment equal, Thales' Theorem: angle in semicircle is $90^\circ$) | pp. 106–111 | `sim-inscribed-angle`: Draggable inscribed point $P$ verifying $\angle AOB = 2\angle APB$ and semicircle right angle | 3 MCQs |
| **c6** | 5.8 Concyclicity of Points & Cyclic Quadrilaterals (Theorem 10: 4 concyclic points, Theorem 11: opposite angles sum to $180^\circ$, Theorem 12: converse, exterior angle property $\angle ADE = \angle ABC$, inscribed rectangle) | pp. 111–117 | `sim-cyclic-quad`: Interactive cyclic quadrilateral with draggable vertices, opposite angle sum telemetry | 3 MCQs |

---

### 2. Comprehensive Exercises & Question Bank Coverage
- **Exercise Set 5.1 (pp. 97–98):** 4 Questions completely solved with step-by-step guidance (circumcircle of acute $\Delta$, circumcircle of obtuse $\Delta$, circumcentre distances, least radius through two points).
- **Exercise Set 5.2 (p. 100):** 2 Questions completely solved with step-by-step guidance (isosceles chord triangle, SSS congruence of chord triangles).
- **Exercise Set 5.3 (pp. 101–102):** 3 Questions completely solved with step-by-step guidance (converse of Theorem 4 via RHS, isosceles altitude passes through centre, parallel chords 6 cm and 8 cm on opposite sides).
- **Exercise Set 5.4 (p. 103):** 3 Questions completely solved with step-by-step guidance (Pythagoras proof of equidistant chords, proof of $AB = GF$, Pythagoras solution).
- **Exercise Set 5.5 (pp. 105–106):** 3 Questions completely solved with step-by-step guidance (chord length $r=7, d=6$, formula $2\sqrt{r^2-d^2}$, non-linearity of distance and length).
- **Exercise Set 5.6 (pp. 110–111):** 3 Questions completely solved with step-by-step guidance (chord length for $60^\circ$ central angle, angles in same segment, central angle $130^\circ$ to inscribed $x$).
- **End-of-Chapter Exercises (pp. 114–116):** 26 Verbatim Questions completely solved with step-by-step guidance (chord length calculations, central to inscribed angles, perpendicular bisector passes through centre, semicircle angle, cyclic quad opposite angles, algebraic angle solving, radius calculation, Brahmagupta area of cyclic quad 5,5,12,12, circumcentre location test, intersecting equal chords segments, circle construction, inscribed rectangle proof, diagonal intersection at centre, midpoints concentric circle locus, angle bisector of equal chords, parallel chords radius 13 cm, regular hexagon side and apothem, diameter angle properties, exterior angle theorem, chord no longer than diameter proof, shortest chord through point $A$, semicircle angle figure justification, midpoints line perpendicular to diameter, cyclic quad $p+q=360^\circ$ justification).
- **Total Exercises:** 44 comprehensive verbatim curriculum exercises with full step-by-step pedagogical guidance.

---

### 3. Golden Standard Compliance
- **File size**: Standalone single-file HTML strictly < 2 MB, offline zero CDN dependencies, zero unencrypted `http://` links.
- **Pedagogical Loop**: Complete 5-block cycle (Learn $\to$ Predict First $\to$ Play $\to$ Connect $\to$ Practice $\to$ Revise).
- **Automated Verification**: `tests/verify.cjs` asserts JSON schema, exercise guidance presence, mathematical algorithm truth, DOM sandbox execution, and asset budgets.
