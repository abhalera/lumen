# jemh101 Real Numbers pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh101.pdf`, 9 pdf pages, printed pp. 1–10, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + PNG zooms; Symbol PUA audit). Every equation line authored here was checked against a 170-dpi PNG zoom in `/tmp/opencode/jemh101_zooms/` (14 clips: factor lines, Ex 1–7 solutions, Thm 1.2/1.3 boxes, both exercises, summary, Note to Reader) and every number recomputed by `/tmp/opencode/nums101.py`.

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 1.1 Introduction (Euclid division algorithm for HCF; FTA for multiplication) | 1 | fta-unique Connect/deeper, hcf-lcm-method Connect | implemented (Euclid divide in model; FTA uniqueness as hinge) |
| 1.2 FTA: products 5313/1771/10626/8232/21252; 32760 tree → 2³×3²×5×7×13; 123456789 = 3²×3803×3607 | 2–3 | fta-unique | implemented, PNG zoom cited |
| Theorem 1.1 statement + uniqueness + ascending-order form x = p₁…pₙ; Gauss/Elements note | 3–4 | fta-unique, lemma-squares | implemented |
| Example 1: 4ⁿ never ends in 0 (4ⁿ = 2²ⁿ, needs prime 5; uniqueness) | 4 | no-zero-4n | implemented, PNG zoom cited |
| Example 2: HCF/LCM of 6 and 20 (2¹×3¹; 2²×5¹ → HCF 2, LCM 60; min/max rules) | 4 | hcf-lcm-method, product-rule | implemented, PNG zoom cited |
| HCF(a,b)×LCM(a,b) = a×b (two numbers) | 4 | product-rule | implemented + proved via min+max |
| Example 3: HCF(96,404) = 4, LCM = 96×404/4 = 9696 | 5 | product-rule | implemented, PNG zoom cited (stacked fraction verified: 38784/4) |
| Example 4: HCF/LCM of 6, 72, 120 (6; 360); Remark: product ≠ HCF×LCM for three | 5 | product-rule | implemented, PNG zoom cited (51840 ≠ 2160) |
| Ex 1.1 Q1–Q7 (140/156/3825/5005/7429; pairs 26-91/510-92/336-54; triples; HCF 306-657 → LCM 22338; 6ⁿ; composites 1014 & 5045; LCM 18-12 = 36) | 5–6 | all (map rows 1–15) | located in exerciseMap with PDF pages; patterns in quizzes/sims |
| 1.3 Theorem 1.2 (p\|a² ⟹ p\|a) + proof via a = p₁…pₙ | 6 | lemma-squares | implemented, PNG zoom cited |
| Theorem 1.3: √2 irrational by contradiction (2b² = a² → 2\|a, 2\|b) | 6–7 | sqrt2-contradiction | implemented, PNG zoom cited |
| Example 5: √3 irrational (3b² = a² → 3\|a, 3\|b) | 7 | sqrt2-contradiction worked | implemented, PNG zoom cited |
| Example 6: 5 − √3 irrational (√3 = (5b−a)/b) | 8 | combo-irrationals | implemented, PNG zoom cited |
| Example 7: 3√2 irrational (√2 = a/3b) | 8 | combo-irrationals | implemented, PNG zoom cited |
| Ex 1.2 Q1–Q3 (√5; 3+2√5; 1/√2, 7√5, 6+√2) | 9 | sqrt2-contradiction, combo-irrationals (map rows 16–20) | located; isolation templates in deeper/worked |
| 1.4 Summary points 1–3 | 9 | revision strip | implemented |
| A NOTE TO THE READER: HCF×LCM ≠ product for three; triple LCM/HCF identities | 9 | product-rule deeper | implemented, PNG zoom cited, model-checked on (6,72,120): 360 ✓ / 6 ✓ |
| Decimal promise (p.1): q = 2ⁿ×5ᵐ rule for terminating vs repeating | 1 (+§1.4 texts) | decimal-rule | implemented as the chapter-promised rule (recomputed fixtures: 13/3125 T, 15/1600 T, 64/455 R, 1/6 R, 7/80 T); full §1.4 theorem set is beyond this 9-page source PDF |

Videos (all oEmbed-verified 2026-09-08, never invented): Numberphile `ctC33JAV4FI`, Khan Academy Labs `klcIklsWzrY`, mathantics `SXPsfr-Fnu4`, Khan Academy India-English `jmqyZStRV_M`, Michael Penn `UCNfsZ4JoFs`, Khan Academy `mX91_3GQqLY` + `pPM72fPwIjw`, Khan Academy India-English `o4M6HnNatZ0`.

Gaps (honest): no full in-page solutions for all 20 exercise rows (mapped + pattern-covered, not fully solved); decimal-rule §1.4 theorem proofs (beyond source PDF scope) taught as rule + fixtures only; browser matrix/teacher/learner review pending.
