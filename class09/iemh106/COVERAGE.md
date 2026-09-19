# COVERAGE — iemh106 Measuring Space: Perimeter and Area

**Source:** `books/originals/Class09-Maths_iemh106.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 37 PDF pages. Printed page = PDF page + 117.
**Build:** `python3 scripts/build_chapter.py iemh106`.
**Checks:**
- `node output/Class09/iemh106/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh106`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | Perimeter and π | 1–7 | Fig. 6.1 relay stagger, Think and Reflect (200 m track), 6.1 perimeter (Figs. 6.2–6.4), 6.2 C/D ratio, Home measurement, history of π (Figs. 6.6–6.7, Mesopotamia to Mādhava), 6.3 π is irrational, Fun Fact, Pi Day | `pi`: roll a wheel, Archimedes’ polygons, Mādhava’s series, historical values |
| 2 | Arcs and running tracks | 8–13 | 6.4 arc length (Figs. 6.8–6.10), 400 m track (Fig. 6.11), Think and Reflect (stagger), 6.5 Examples 1–2 (Figs. 6.12–6.13), Exercise Set 6.1 | `arc`: arc length, 400 m lap, lane staggers, semicircle paradox |
| 3 | Rectangles, parallelograms, triangles | 13–17 | 6.6 (Fig. 6.16), 6.7 (Figs. 6.17–6.19), Think and Reflect (sides and area), 6.8 (Figs. 6.20–6.21), median theorem (Fig. 6.22), Think and Reflect (dissections; rectangles with perimeter 40) | `shear`: cut and move, shear, same sides, median |
| 4 | Heron’s formula | 17–20 | 6.8.1 Heron, Examples 3–5 (Figs. 6.23–6.25), circumcircle and incircle formulas (Fig. 6.26) | `heron`: equilateral, 3–4–5, 5–5–6, any sides |
| 5 | Brahmagupta’s formula | 20–23 | Fig. 6.27 (rhombus areas 9, 8.01, 5.41), Brahmagupta (Fig. 6.28), Examples 6–7 (Fig. 6.29), Special cases and generalisation, Heron as the d = 0 case | `brahma`: flexing rhombus, cyclic 4-gon, isosceles trapezium, d → 0 |
| 6 | Squaring a rectangle | 23–26 | 6.9 Baudhāyana’s construction and proof (Fig. 6.30), Think and Reflect (squaring a triangle); area-model and dissection exercises | `square`: Fig. 6.30 steps, any rectangle, the identity, squaring a triangle |
| 7 | Area of a circle | 26–31 | 6.10, Think and Reflect, P² : A ratios, Babylonian and Egyptian rules, Archimedes (Fig. 6.36), Nīlakaṇṭha (Fig. 6.37), 6.10.1 sectors (Figs. 6.38–6.40) and segments, Exercise Set 6.3, Chapter summary | `disc`: slices, polygons, sector, segment |

**Exercises:** 56 items.
- Exercise Set 6.1 has 8 questions.
- Exercise Set 6.2 has 11 questions.
- Exercise Set 6.3 has 10 questions.
- The End-of-Chapter Exercises Q1–Q27 are one item each.

**Figures shown with their exercises:**
- 6.14 (i)–(ix) and 6.15A/B;
- 6.31–6.34, 6.41 and 6.42;
- 6.43 with 6.44, and 6.45 with 6.46;
- 6.47–6.55.

Figs. 6.43, 6.44 and 6.54 follow point positions read from the PDF’s vector drawing. The EoC Q1 solution draws the two requested area models.

**Notes:**
- **Book typo, Set 6.3 Q7.** The book prints the segment area as πr²(1/6 − √3/4), which is negative. The correct value is r²(π/6 − √3/4) = πr²(1/6 − √3/(4π)). The solution explains this.
- **Fig. 6.14 readings.**
  - (iv) is three semicircles on the sides of an equilateral triangle.
  - (v) is a 3 × 3 grid of 14 cm squares with four semicircles and four corner quarter circles (176 cm).
  - (vi) has four 7 cm semicircles along the base, alternately below and above (88 cm).
  - (ix) is a 20 cm semicircle with two 10 cm semicircles (20π).
- **EoC Q19.** 4 flat rectangles above 5 upright ones gives 4L = 5W and LW = 8. The perimeter is therefore 18√10/5 ≈ 11.38 cm, which is not a whole number.
- **Rounding.** Answers keep exact fractions or surds and give decimals to 2 places. EoC Q9 and Set 6.1 Q6 state that the number of turns is not a whole number.
- **Lesson 2 stagger.** 2π × 1.22 ≈ 7.67 m follows the book’s simplified model. The WOW card notes the World Athletics 0.30 m / 0.20 m measuring lines.
