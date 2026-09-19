# COVERAGE — jemh102 Polynomials

**Source:** `books/originals/Class10-Maths_jemh102.pdf`. NCERT *Mathematics*, Grade 10, Chapter 2 (reprint 2026–27), 14 PDF pages, printed pp. 10–23 (printed = PDF + 9).
**NCERT:** https://ncert.nic.in/textbook/pdf/jemh102.pdf

**Build:** `python3 scripts/build_chapter.py jemh102` → 123.9 KB
**Checks:** verify.cjs PASS 306 after wiring videos; browser_qa 106 checks, 0 failures, 0 console errors.

Old `pilot/` is a different shape. Numbers were salvageable and recomputed; rebuilt to the shared `chapter.json` standard.

Videos: 7/7 wow cards from `results/jemh102.json` (first of each lesson). `verify_videos.py jemh102` PASS 14/14.

## Concepts (7)

degree-names, value-zero, linear-geometry, parabola-cases, cubic-geometry, vieta-quadratic, vieta-cubic.

## Exercises

Exercise 2.1 Fig. 2.10 (i)–(vi) and Exercise 2.2 Q1(i)–(vi), Q2(i)–(vi) — 18 items. Fig. 2.10 redrawn in `figures.js`.

## Recomputed / PDF facts

- p(x)=x²−3x−4: p(2)=−6, p(0)=−4, zeroes −1 and 4
- Table 2.1: 6, 0, −4, −6, −6, −4, 0, 6
- Fig. 2.10 counted from a 5× zoom: 0, 1, 3, 2, 4, 3 (vi: one crossing + two touches)
- Q1: (4, −2); 1/2 repeated; (−1/3, 3/2); (0, −2); ±√15; (4/3, −1)
- Example 3-style cubic: zeroes 4, −2, 1/2; sum 5/2, pairs −7, product −4
- Example 5*: p(3)=p(−1)=p(−1/3)=0

## Honest gaps

- §2.1 promises the division algorithm; this reprint has no division section (summary omits it).
- Discriminant is not named; three parabola pictures only.
- Example 5 is starred, not from the examination point of view.
- Q2 polynomials are determined only up to a non-zero multiple k.
