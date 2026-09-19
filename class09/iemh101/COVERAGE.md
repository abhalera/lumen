# COVERAGE — iemh101 Orienting Yourself: The Use of Coordinates

**Source:** `books/originals/Class09-Maths_iemh101.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 15 PDF pages. Printed page = PDF page.
**Build:** `python3 scripts/build_chapter.py iemh101`.
**Checks:**
- `node output/Class09/iemh101/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh101`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | Grids and coordinates | 1–2 | 1.1 Introduction: Sindhu-Sarasvatī street grids, Baudhāyana, Ujjayinī meridian, Āryabhaṭa, Brahmagupta, Al-Bīrūnī, Omar Khayyām, Fermat and Descartes | `grid`: warehouse to shop, walking route, one number is not enough |
| 2 | Axes and the origin | 2–5 | 1.2 Settling In, Fig. 1.1, 1.3 (axes, origin, signs), Fig. 1.2, points on the axes, Exercise Set 1.1, Think and Reflect | `axes`: Fig. 1.2 points, room door D₁R₁, bathroom door B₁B₂ |
| 3 | Quadrants and ordered pairs | 6–7 | Quadrants, Fig. 1.4 (S, Q), Think and Reflect 1–4 | `quadrants`: S, Q, (4, 4), (0, −3), explore |
| 4 | Planning with coordinates | 7–8 | Exercise Set 1.2, Fig. 1.5 | `room`: study table, door swing (width slider), bathroom and SHWR, dining room |
| 5 | Distance between two points | 8–10 | 1.4, Figs. 1.6–1.8, Think and Reflect, distance formula | `distance`: AD, DM, MA, explore |
| 6 | Reflection keeps distances | 11 | Fig. 1.9, Think and Reflect 1–2 | `reflect`: y-axis, x-axis, a single point |
| 7 | Midpoints, lines and circles | 12–14 | End-of-Chapter tools: midpoint, collinearity, circle centred at O, intersecting circles, square; Chapter Summary | `apply`: midpoint, Q6, Q7, Q12, Q15, Q16 |

**Exercises:** 21 items.
- Exercise Set 1.1 is one item. It shows Fig. 1.3.
- Exercise Set 1.2 Q1–Q4 are four items. They show Fig. 1.5.
- The End-of-Chapter Exercises Q1–Q16 are one item each.

The book has no answer key. Every answer is worked out here and recomputed in `tests/verify.cjs`. Coordinates not printed in the book (S, H, W, the wardrobe and bed corners) were read from zoomed renders of Figs. 1.3 and 1.5.

**Notes:**
- **Two dates in the book look wrong.** The PDF prints "Baudhāyana (c. 800 C.E.)" and "Ptolemy (c. 150 BCE)", but Baudhāyana is usually dated c. 800 BCE and Ptolemy lived in the 2nd century CE. The lesson avoids both dates.
- **Answers that vary by design.** Set 1.2 Q3 (iii), End-of-Chapter Q4 and Q8 have many correct answers. One valid answer is given, with checks, and the solution says that others are possible.
- **End-of-Chapter Q13.** D, E and F are taken as the midpoints of BC, CA and AB. Any other matching gives the same three vertices.
- **Wheelchair clearance.** Set 1.1 (iii) uses the common accessibility figure of about 0.9 m as the minimum clear door width.
- **Videos.** The WOW cards have no videos yet. Real, oEmbed-verified videos are to be added.
