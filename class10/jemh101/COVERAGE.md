# COVERAGE — jemh101 Real Numbers

**Source:** `books/originals/Class10-Maths_jemh101.pdf`. NCERT *Mathematics*, Grade 10, Chapter 1 (reprint 2026–27), 9 PDF pages, printed pp. 1–9 (printed = PDF page).
**NCERT:** https://ncert.nic.in/textbook/pdf/jemh101.pdf

**Build:** `python3 scripts/build_chapter.py jemh101` → 124.9 KB
**Checks:** verify.cjs PASS 296; browser_qa 106 checks, 0 failures, 0 console errors.

Old `pilot/` content.js is a different shape (not iesc104/iemh101 `chapter.json`). Numbers were salvageable and recomputed; the chapter is rebuilt to the shared standard.

Videos: 7/7 wow cards from `results/jemh101.json` (first of each lesson). `verify_videos.py jemh101` PASS 14/14.

## Concepts (7)

fta-unique, no-zero-4n, hcf-lcm-method, product-rule, lemma-squares, sqrt2-contradiction, combo-irrationals.

Dropped the old pilot’s standalone `decimal-rule` lesson: the intro promises a terminating-decimal test, but this 9-page reprint never develops it. No 13/3125-style examples invented.

## Exercises

All of Exercise 1.1 Q1–Q7 and Exercise 1.2 Q1–Q3, parts split to 20 items (PDF pp. 5–6 and 9).

## Recomputed / PDF facts

- 32760 = 2³ × 3² × 5 × 7 × 13; 123456789 = 3² × 3803 × 3607 (both prime)
- 8232 = 2³ × 3 × 7³ (superscripts; flattened extract reads 23 × 3 × 73)
- Example 2: HCF(6, 20) = 2, LCM = 60
- Example 3: HCF(96, 404) = 4, LCM = 9696
- Example 4: HCF(6, 72, 120) = 6, LCM = 360, and 51840 ≠ 2160
- Q4: LCM(306, 657) = 22338; Q7: LCM(18, 12) = 36 min
- Note to the Reader identities recover 360 and 6 on (6, 72, 120)

## Honest gaps

- Euclid’s division algorithm is named on p. 1; this reprint does not work an example of it.
- Gauss box says “Theorem 1.2” while FTA is Theorem 1.1 (leftover numbering).
- Note to the Reader cites “Example 8”; the three-number break is Example 4 here.
- Terminating vs repeating decimals are promised in the intro and absent from §1.4 Summary.
