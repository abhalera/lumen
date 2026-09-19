# COVERAGE — iemh103 The World of Numbers

**Source:** `books/originals/Class09-Maths_iemh103.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 27 PDF pages. Printed page = PDF page + 40.
**Build:** `python3 scripts/build_chapter.py iemh103`.
**Checks:**
- `node output/Class09/iemh103/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh103`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | Counting and natural numbers | 1–3 | 3.1, 3.1.1 (Lebombo and Ishango bones, Fig. 3.1), 3.1.2 (Indus trade, Vedic powers of 10), Exercise Set 3.1 | `counting`: pebbles, Ishango tallies, finger joints, Lothal trade |
| 2 | Zero and integers | 3–6 | 3.2 (Śhūnyatā, Bakhśhālī, Brahmagupta’s rules for zero), 3.3 (dhana and ṛiṇa, Fig. 3.2, rules 1–5), Think and Reflect, Exercise Set 3.2 | `integers`: debts, Ladakh temperature, spice trader, (−3) × (−4), 10 − (−5) |
| 3 | Rational numbers | 6–9 | 3.4 (definition, q ≠ 0, equivalent forms, Brahmagupta’s laws, closure), Think and Reflect, Exercise Set 3.3 | `fractions`: equality, sum, product area, kurtas, distributive law |
| 4 | Rationals on the number line | 10–13 | 3.4.1 (Figs. 3.3–3.8, absolute value, Example 1), 3.4.2 (density, Fig. 3.9), Exercise Set 3.4 | `numberline`: 3/4, 9/4, −7/4 and 8/5, \|a − b\|, density zoom, 3.1415 to 3.1416 |
| 5 | Irrational numbers | 13–16 | 3.5, Fig. 3.10, 3.5.1 proof by contradiction, Think and Reflect (√3, √5, √7, √10), 3.5.2 construction (Fig. 3.11) | `sqrt2`: diagonal trials, proof steps, construct √2 and √3, square root spiral |
| 6 | π and the real line | 16–17 | 3.5.3 (Āryabhaṭa, Lambert, Mādhava’s series), Fig. 3.12 | `pi`: Mādhava’s sums, Āryabhaṭa vs 22/7, rolling wheel, real line |
| 7 | Decimals and the real numbers | 17–24 | 3.6.1 (terminating and repeating decimals, Examples 2–9, prime factor test, summary table), 3.6.2 cyclic numbers, 3.6.3 irrational decimals, Exercise Set 3.5, non-uniqueness (0.999… = 1), 3.7 conclusion (Fig. 3.13), imaginary numbers, Chapter summary | `decimals`: long division of 1/7, predicting, converting 0.4545…, 142857, 0.999… |

**Exercises:** 43 items.
- Exercise Set 3.1 has 4 questions, Set 3.2 has 4, Set 3.3 has 8, Set 3.4 has 6, and Set 3.5 has 5.
- The End-of-Chapter Exercises Q1–Q16 are one item each.

The book has no answer key. `gen_ex.py` computes every answer with exact fractions and asserts it before writing, and `tests/verify.cjs` recomputes the answers with BigInt fractions.

**Repeating bars.** The bars over repeating digits in Examples 3–9 and End-of-Chapter Q3–Q4 were read from the PDF’s vector overlines, matched to the characters beneath them. That gives Q3 as (i) 12.6, (ii) 0.0120, (iii) 3.0<ins>52</ins>, (iv) 1.2<ins>35</ins>, (v) 0.<ins>23</ins>, (vi) 2.0<ins>5</ins>, (vii) 2.12<ins>5</ins>, (viii) 3.12<ins>5</ins> and (ix) 2.<ins>1625</ins>, with the underlined block repeating. Q4 (ii) is 1.1<ins>5</ins>.

**Notes:**
- **Set 3.3 Q8 is an identity.** 5/6 (x + 3/5) expands to exactly 5/6 x + 1/2, so every rational x satisfies it. The solution says so, rather than inventing a single value.
- **End-of-Chapter Q13.** Finding n numerators needs only k₂ − k₁ ≥ n + 1. The book’s k₂ − k₁ > n + 1 is sufficient but slightly stronger than necessary, and the solution explains both.
- **Set 3.5 Q2.** 2/13 is not a rotation of 1/13’s block. The twelve blocks of k/13 form two families of rotations (076923 and 153846), and the solution reports this honestly.
- **Dates.** The book dates Hippasus to c. 400 BCE, while he is traditionally placed in the 5th century BCE, so the lesson gives no date. The chapter summary says Brahmagupta 629 CE and the text says 628 CE; the lessons use 628 CE, the date of the Brāhmasphuṭasiddhānta.
- **Fig. 3.14** has 10 triangles, counted from the zoomed PDF render, so the hypotenuses run from √2 to √11.
- **The `realline` lab** places a selection of the numbers shown in Fig. 3.12; it is not an exact copy of the figure.
- **Videos.** Real, oEmbed-verified videos are requested from agy-imported.
