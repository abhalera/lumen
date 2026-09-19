# COVERAGE — iemh108 Predicting What Comes Next: Exploring Sequences and Progressions

**Source:** `books/originals/Class09-Maths_iemh108.pdf` (NCERT *Ganita Manjari*, Grade 9, Part I), 27 PDF pages. Pages 24–27 are graph paper. Printed page = PDF page + 173.
**Build:** `python3 scripts/build_chapter.py iemh108`.
**Checks:**
- `node output/Class09/iemh108/tests/verify.cjs`
- `browser_qa.cjs output/Class09/iemh108`

| # | Concept | PDF pp. | NCERT items | Lab |
|---|---|---|---|---|
| 1 | Sequences and patterns | 1–3 | 8.1 natural, odd, triangular and square numbers; Figs. 8.1–8.2; Think and Reflect ×2; finite and infinite sequences; notation tₙ; in-text exercises on 1, 4, 7, … and t₅–t₈ | `patterns`: triangular, squares from odd numbers, running sums, fractions and negatives |
| 2 | Explicit rules | 3–5 | 8.2 Example 1 (uₙ = 2n − 1), Think and Reflect, membership (137), Example 2 (sₙ = 5n − 2; 308 and 471), squares and primes, in-text exercises on uₙ and tₙ = 3n − 7 | `explicit`: odd numbers, membership test, squares, your own rule |
| 3 | Recursive rules | 5–7 | 8.3, Examples 3–4, Virahānka–Fibonacci and its history, Exercise Set 8.1 | `recursive`: add 3, Example 3, Example 4, Virahānka |
| 4 | Arithmetic progressions | 7–10 | 8.4 Fig. 8.3, Think and Reflect ×2, a and d, 8.4.1 table and Fig. 8.4, in-text exercises (verify and plot, fractional APs, recursive rules), Example 5 taxi | `ap`: Fig. 8.3 pattern, choose a and d, taxi fare, decreasing AP |
| 5 | Sum of 1 to n | 10–13 | 8.5 reversed sum, Fig. 8.5, Āryabhaṭa (Āryabhaṭīya 2.19), 25 + … + 58, triangular numbers, Think and Reflect ×3, Exercise Set 8.2 | `gauss`: pairing, staircase, any n, runs |
| 6 | Geometric progressions | 13–20 | 8.6 Fig. 8.6, Examples 6–9, in-text exercises (three GPs, recursive rule for 3 × 10ⁿ⁻¹), 8.6.2 Fig. 8.9, Example 10 bouncing ball (Fig. 8.11), Exercise Set 8.3 | `gp`: doubling, ratio test, bouncing ball, AP versus GP |
| 7 | Fractals | 15–23 | 8.6.1 Sierpiński triangle (Fig. 8.7), Think and Reflect (a)–(d), Table 1, Fig. 8.8, Fig. 8.10, End-of-Chapter Exercises, Chapter summary | `fractal`: triangle, carpet, count and area graphs, self-similarity |

**Exercises:** 44 items.
- There are 9 in-text ‘Exercise:’ prompts.
- Exercise Sets 8.1, 8.2 and 8.3 have 6, 7 and 7 questions.
- The End-of-Chapter Exercises Q1–Q15 are one item each.

**Figures shown with their exercises:** 8.12 (Sierpiński carpet). The §8.4.1 in-text exercise draws its plot in the solution.

**Notes:**
- **Set 8.3 Q6 extraction.** Text extraction drops the radicals. The rendered PDF reads ‘2, 2√2, 4, …’, so 128 is the 13th term.
- **Stage indexing.** Table 1 starts at Stage 0, but the book writes the recursive rule as t₁ = 1, tₙ = 3tₙ₋₁. Lesson 7 and the Set 8.3 Q7 solution use t₀ = 1 so that the recursion agrees with tₙ = 3ⁿ, and the lesson explains why.
- **Example 10.** Fig. 8.11 labels the 4th bounce ‘7.9 ft’, but the text gives 7.59375 ft. Lesson 6 and the lab use 7.59 ft.
- **Set 8.2 Q6.** The answer is given as ‘after 10 years (in his 11th year)’, because the first year has no increment.
- **Set 8.3 Q5(ii).** The total distance counts the first 80 m fall once and each of bounces 1–5 twice (up and down): 301.3376 m.
- **EoC Q6.** Checked by exhaustive search over the number of terms k and the first term; there are exactly two runs.
