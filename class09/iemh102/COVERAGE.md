# COVERAGE — iemh102 Introduction to Linear Polynomials

**Source:** `books/originals/Class09-Maths_iemh102.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 25 PDF pages. Printed page = PDF page + 15.
**Build:** `python3 scripts/build_chapter.py iemh102`.
**Checks:**
- `node output/Class09/iemh102/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh102`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | Expressions and polynomials | 1–4 | 2.1, Examples 1–3, Figs. 2.1–2.2, Think and Reflect, degree and names of polynomials, Exercise Set 2.1 | `terms`: Raju’s boxes, garden cost, wire rectangle, degrees |
| 2 | Linear polynomials and equations | 4–6 | 2.2, Examples 4–6, linear patterns, Fig. 2.3 input–output machine, Think and Reflect, Exercise Set 2.2 | `linear`: square perimeters, chess club, Example 6, machine 2x + 3, area machine |
| 3 | Linear patterns | 6–9 | 2.3, Fig. 2.4 tiles, Examples 7–8, Think and Reflect, Exercise Set 2.3 | `patterns`: tiles, Bela’s pocket money, auto fare |
| 4 | Linear growth and decay | 9–11 | 2.4, Examples 9–10, Think and Reflect, Exercise Set 2.4 | `growth`: journey cost, water tank, plant, phone |
| 5 | Finding y = ax + b | 11–12 | 2.5, Example 11, Think and Reflect, Exercise Set 2.5 | `relation`: data plan, modules, gym, temperature |
| 6 | Graphs and slope | 12–18 | 2.6, Fig. 2.5, Examples 12–15, Figs. 2.6–2.11 | `slope`: Fig. 2.5, Examples 12–13, Figs. 2.9 and 2.11, explore a |
| 7 | y-intercept and parallel lines | 18–21 | Think and Reflect, Example 16, Figs. 2.12–2.14, conclusions (i)–(iii), Exercise Set 2.6, Chapter summary | `intercept`: 3x + 1 and −3x + 1, Example 16, Fig. 2.14, explore a and b |

**Exercises:** 39 items.
- Exercise Set 2.1 has 5 questions, Set 2.2 has 7, Set 2.3 has 5, Set 2.4 has 4, and Set 2.5 has 3.
- Exercise Set 2.6 is one item with five parts and five graphs.
- The End-of-Chapter Exercises Q1–Q14 are one item each.

The book has no answer key. Every answer is worked out here and recomputed in `tests/verify.cjs`. The graphs in the solutions (Set 2.6, End-of-Chapter Q7, Q9, Q10 and Q13) are drawn to scale by `gen_ex.py`. End-of-Chapter Q12 shows the redrawn hexagon pattern.

**Notes:**
- **Exercise Set 2.6 (v)** is printed as y = −2x − 3, y = −2x, y = 2x + 3. It is solved as printed: the first two lines are parallel, and y = 2x + 3 is the mirror image of y = −2x − 3 in the x-axis.
- **Example 8.** The fare rule 15n − 5 holds only for n ≥ 2 km; the lesson states this.
- **Answers that vary by design.** Set 2.1 Q2 and End-of-Chapter Q1 have many correct answers. One valid answer is given, and the solution says that others are possible.
- **Videos.** Real, oEmbed-verified videos are requested from agy-imported. They go on the WOW cards when they arrive.
