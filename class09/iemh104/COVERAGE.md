# COVERAGE — iemh104 Exploring Algebraic Identities

**Source:** `books/originals/Class09-Maths_iemh104.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 24 PDF pages. Printed page = PDF page + 67.
**Build:** `python3 scripts/build_chapter.py iemh104`.
**Checks:**
- `node output/Class09/iemh104/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh104`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | The square of a sum | 1–5 | 4.1, Example 1, Think and Reflect, 4.2, Figs. 4.1–4.2, Examples 2–4, identity vs equation, Exercise Set 4.1 | `square`: consecutive squares, area model, negative and rational checks, 43² |
| 2 | Factorising perfect squares | 5–8 | 4.3, Examples 5–8, (a − b)², Fig. 4.3, Example 1 explained, Exercise Set 4.2 | `perfect`: Examples 5–7, (2x − 3y)², Fig. 4.3, 29² |
| 3 | (a + b + c)² and a² − b² | 8–11 | 4.4, Fig. 4.4, Example 9, Exercise Set 4.3, Śhrīdharāchārya (Fig. 4.5), Think and Reflect (squares ending in 5, Fig. 4.6) | `abc`: Fig. 4.4 pieces, 119², 55² rearranged, numbers ending in 5 |
| 4 | Algebra tiles | 11–13 | 4.5, Figs. 4.7–4.8, Think and Reflect, (x + a)(x + b), (px + a)(qx + b) | `tiles`: (x + 3)(x + 4), (x + 2)(x + 3), x² + 11x + 30, (2x + 3)(3x + 1) |
| 5 | Splitting the middle term | 13–15 | 4.6, Examples 10–12, Exercise Set 4.4, Think and Reflect (James and Reshma) | `split`: Examples 10–12, a negative constant, 6x² + 7x + 2 |
| 6 | Cubes and new identities | 15–19 | 4.7, Figs. 4.9–4.10, (a ± b)³, Examples 13–15, x³ ± y³, x⁴ − y⁴, x³ + y³ + z³ − 3xyz | `cube`: exploded cube, 11³, cube identities checked, Example 15 |
| 7 | Rational expressions and applications | 19–21 | 4.8, Example 16, Think and Reflect, Exercise Set 4.5, Examples 17–18, Chapter summary | `rational`: Example 16, (x² − 9)/(x² + 5x + 6), Saira’s rectangle, the pool |

**Exercises:** 25 items.
- Exercise Set 4.1 has 2 questions, Set 4.2 has 2, Set 4.3 has 4, and Set 4.4 has 3.
- Exercise Set 4.5 is one item with six parts.
- The End-of-Chapter Exercises Q1–Q13 are one item each.

The book has no answer key. Every expansion, factorisation and simplification is checked in `gen_ex.py` by exact rational evaluation at random points, and checked again in `tests/verify.cjs`. Fraction-heavy questions were transcribed from zoomed renders of the PDF pages.

**Notes:**
- **End-of-Chapter Q3 (x)** is printed as 4x² + 9y² + 36z² + 12xz + 36yz + 24xy (checked in a zoomed render). As printed it is not (2x + 3y + 6z)² and has no rational linear factors. The solution says so and gives the likely intended form, 4x² + 9y² + 36z² + 12xy + 36yz + 24xz = (2x + 3y + 6z)².
- **Exercise Set 4.5 (i)** has no common factor after factorising. The solution shows the factorised form and says so.
- **Exercise Set 4.3 Q4** is not an identity; a counterexample is given.
- **Fig. 4.6.** The book does not state the identity the figure intends. The lesson gives a related relation, (a + b + c)² + (a − b − c)² = (a + b − c)² + (a − b + c)² + 8bc, which verify.cjs checks, and does not claim it is the figure’s intended answer.
- **Videos.** Real, oEmbed-verified videos are requested from agy-imported.
