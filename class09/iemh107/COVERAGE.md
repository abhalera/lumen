# COVERAGE — iemh107 The Mathematics of Maybe: Introduction to Probability

**Source:** `books/originals/Class09-Maths_iemh107.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 19 PDF pages. Printed page = PDF page + 154.
**Build:** `python3 scripts/build_chapter.py iemh107`.
**Checks:**
- `node output/Class09/iemh107/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh107`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | Chance and the probability scale | 1–5 | 7.1 subjective probability, 7.1.1 randomness, Think and Reflect ×2 (cricket toss, ₹1 coin), 7.1.2 scale (Fig. 7.1 and the table of events), Exercise Set 7.1 | `scale`: Fig. 7.1 deck, events on the scale, choose the deck, 0.75 as 75% |
| 2 | Experimental probability | 5–7 | 7.2 two objective methods, 7.2.1 experiments, outcomes, sample space (Example 1, Figs. 7.2–7.3), relative frequency (Example 2), Did you know? (Jñān-Chaupaḍ, Fig. 7.4) | `experiment`: 200 coin tosses, 300 die rolls, paper cup (Fig. 7.5), Example 2 |
| 3 | Theoretical probability | 7–8 | 7.2.2, Examples 3–4 | `theory`: die, PROBABILITY, spinner (Fig. 7.7), probability from area (Fig. 7.8) |
| 4 | Data, samples and the long run | 8–12 | 7.2.3 Example 5 and sampling, Learn more about sampling, Law of Large Numbers, Think and Reflect, Gambler’s Fallacy (Example 6), Fair and unbiased, Exercise Set 7.2 | `lln`: 2000 tosses, 3000 rolls, sample sizes, streaks |
| 5 | Sample spaces and events | 12–14 | 7.3.1 sample space and n(S), examples 1–5, Think and Reflect (level of detail), 7.3.2 events, Exercise Set 7.3 | `space`: two coins, die and coin, two dice, snacks and drinks |
| 6 | Tree diagrams | 14–15 | 7.4, Example 7 (Fig. 7.6), Think and Reflect (one head and one tail), Exercise Set 7.4, Chapter summary | `tree`: two tosses, fruit baskets, pens with replacement, balls without replacement |

**Exercises:** 28 items.
- Exercise Sets 7.1, 7.2, 7.3 and 7.4 have 1, 6, 3 and 2 questions.
- The End-of-Chapter Exercises Q1–Q16 are one item each.

**Figures shown with their exercises:** 7.5, 7.7 and 7.8.

**Tree diagrams:** drawn by `gen_ex.py` in the solutions to Set 7.4 Q1–Q2 and End-of-Chapter Q10 and Q13.

**Every probability is recomputed by enumeration**, both in `gen_ex.py` (Python `itertools`) and independently in `tests/verify.cjs`.

**Notes:**
- **Experiments to perform (Set 7.2 Q3–Q4).** The answers give the method and an example tally, clearly marked as an example, because results depend on the student’s own data.
- **Interpretations.**
  - Set 7.3 Q2(ii): the solution states that ‘between −5 and +5’ is taken as inclusive (11 outcomes), and gives the exclusive reading too (9).
  - EoC Q3(v): the solution explains that boy and girl are treated as equally likely by convention, although real births are about 105 : 100.
  - EoC Q11: the solution notes that it is an event, not a single outcome, that has probability 1.
- **EoC Q7.** The book’s classes skip exactly 4000 km; the solution uses the classes as printed.
- **EoC Q16.** ‘Dye’ is correct: Fig. 7.8 shows a drop from a dropper. The probability is the area ratio π/24.
- **Labs.** They use a seeded random generator, so the ‘random’ results are the same on every run and the QA expectations are stable.
