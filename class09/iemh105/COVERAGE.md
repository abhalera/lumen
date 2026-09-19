# COVERAGE — iemh105 I’m Up and Down, and Round and Round

**Source:** `books/originals/Class09-Maths_iemh105.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 26 PDF pages. Printed page = PDF page + 91.
**Build:** `python3 scripts/build_chapter.py iemh105`.
**Checks:**
- `node output/Class09/iemh105/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh105`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | What is a circle? | 1–3 | Figs. 5.1–5.3, Think and Reflect (Jamuna’s centre), 5.1 definitions, 5.2 symmetries, Think and Reflect 1–3 | `circle`: locus, rotation, folds, finding the centre |
| 2 | Circles through points | 3–7 | 5.3, Fig. 5.4, Think and Reflect 1–5, Theorem 1, Figs. 5.5–5.7, Exercise Set 5.1, Think, Draw and Infer | `circum`: two points, acute, obtuse, right, collinear |
| 3 | Chords and central angles | 7–9 | 5.4, Fig. 5.8, Theorems 2–3, Figs. 5.9–5.11, Exercise Set 5.2 | `chordangle`: rotating chord, Theorem 2, 60° chord, explore |
| 4 | Perpendiculars and chords | 9–11 | 5.5, Theorems 4–5, Fig. 5.12, Exercise Set 5.3 | `perp`: Theorem 4, Theorem 5, finding the centre, worked example |
| 5 | Chords and their distance | 11–15 | 5.6, Activity (Fig. 5.13), Theorems 6–8, Figs. 5.14–5.16, Table 1, Exercise Sets 5.4–5.5 | `distance`: Table 1, slide, equal chords, unequal chords |
| 6 | Angles subtended by arcs | 15–19 | 5.7, Figs. 5.17–5.25, arc exercise (Fig. 5.19), Activity, Theorem 9 (two cases), corollary, Exercise Set 5.6 | `inscribed`: moving D, semicircle, major arc, on/inside/outside |
| 7 | Concyclic points | 19–23 | 5.8, Theorems 10–12, Figs. 5.26–5.29, cyclic quadrilateral exercise, closing remarks, Chapter summary | `cyclic`: Theorem 11, off the circle, Fig. 5.26, 80°, 110°, 100°, 70° |

**Exercises:** 48 items.
- Exercise Set 5.1 has 4 questions, plus 2 Think, Draw and Infer questions.
- Exercise Sets 5.2, 5.3, 5.4 and 5.5 have 2, 3, 3 and 3 questions.
- There is 1 in-text arc exercise (Fig. 5.19).
- Exercise Set 5.6 has 3 questions.
- There is 1 in-text cyclic quadrilateral exercise.
- The End-of-Chapter Exercises Q1–Q26 are one item each.

**Figures shown with their exercises:** 5.15, 5.19, 5.26, 5.30 and 5.31. Figs. 5.15 and 5.19 are redrawn from point positions read from the PDF’s vector drawing. The constructions in Exercise Set 5.1 and End-of-Chapter Q13 are drawn to scale by `gen_ex.py`.

**Notes:**
- **Fig. 5.19.** The arc angles were computed from the extracted point positions: arc AKB ≈ 100° (minor) and arc CLD ≈ 203° (major). The solution says “about”, as a protractor measurement would.
- **Exercise Set 5.4 Q2** prints “CH is perpendicular to GH”. The solution reads this as the chord GF, as the figure shows.
- **Exercise Set 5.5 Q3.** CD = 2AB is not true in general; it holds only for d = r/√5. A counterexample is given.
- **End-of-Chapter Q10.** Both side orders are treated. The rectangle and the right kite each have area 60, which Brahmagupta’s formula confirms.
- **End-of-Chapter Q11** has no single printed method. The solution gives the inscribed-angle test (acute, right or obtuse).
- **End-of-Chapter Q26** assumes the centre is inside the quadrilateral, as drawn.
- **Videos.** Real, oEmbed-verified videos are requested from agy-imported.
