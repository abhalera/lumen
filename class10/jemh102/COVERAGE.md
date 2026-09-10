# jemh102 Polynomials pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh102.pdf`, 14 pdf pages, printed pp. 10–23, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + raw text); PNG zooms at `/tmp/opencode/jemh102_zooms/` (p03_fig21, p04 Table 2.1 + Fig 2.2 parabola, p05 Figs 2.3–2.4, p06 Fig 2.5 + Table 2.2, p07 cubics Figs 2.6–2.8, p08 Example 1 Fig 2.9, p09 Fig 2.10 six 3.5× panel crops, p10 §2.3 Vieta algebra, p11 Examples 2–4, p12 cubic relations, p13 Example 5, p14 Ex 2.2 Q2).

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 2.1 degree + linear/quadratic/cubic names, general forms, non-polynomials | 1–2 | degree-names | implemented |
| 2.1 p(x) = x² − 3x − 4 values p(2) = −6, p(0) = −4; zeroes −1, 4; linear zero −b/a | 2 | value-zero | implemented, recomputed |
| §2.1 promise “we will also study the division algorithm” | 2 | vieta-cubic deeper + division sim | labelled extension: this rationalised PDF carries no division section; polynomial long division ships as extension utility with (x²+7x+10)÷(x+2) fixture |
| 2.2 y = 2x + 3 through (−2,−1), (2,7); zero −3/2 = intercept; ax+b meets axis once at (−b/a, 0) | 3 | linear-geometry | implemented, zoom-verified Fig 2.1 |
| 2.2 Table 2.1 row 6, 0, −4, −6, −6, −4, 0, 6; Fig 2.2 parabola; a>0 ∪ / a<0 ∩; zeroes = x-intercepts (plotting footnote: not by students, not evaluated) | 4 | parabola-cases | implemented, zoom-verified |
| 2.2 three cases: (i) cuts twice, (ii) touches once, (iii) misses; at most 2 zeroes | 5–6 | parabola-cases | implemented, Figs 2.3–2.5 zoomed |
| 2.2 Table 2.2 row 0, 3, 0, −3, 0; Fig 2.6 (−1,3),(1,−3); x³ (Fig 2.7), x³−x² (Fig 2.8); degree-n remark | 6–8 | cubic-geometry | implemented, zoom-verified |
| 2.2 Example 1 Fig 2.9 counts 1, 2, 3, 1, 1, 4 | 8 | cubic-geometry | implemented, zoom-counted |
| 2.2 Ex 2.1 Fig 2.10 counts: (i) 0, (ii) 1, (iii) 3, (iv) 2, (v) 4, (vi) 3 | 9 | cubic-geometry deeper + exerciseMap rows 1–6 | counted per 3.5× panel crops (iv = parabola entirely left of axis, two crossings; vi touches twice + crosses once) |
| 2.3 2x² − 8x + 6 = 2(x−1)(x−3), zeroes 1, 3, sum 4 = −(−8)/2, product 3 = 6/2; 3x²+5x−2 zeroes 1/3, −2 | 9–10 | vieta-quadratic | implemented, zoom-verified |
| 2.3 general α+β = −b/a, αβ = c/a (α, β alpha/beta, γ gamma footnote) | 10 | vieta-quadratic | implemented + proved via k(x−α)(x−β) |
| 2.3 Examples 2 (x²+7x+10 → −2,−5), 3 (x²−3 → ±√3), 4 (sum −3, product 2 → x²+3x+2) | 11 | vieta-quadratic | implemented, zoom-verified |
| 2.3 cubic 2x³ − 5x² − 14x + 8 zeroes 4, −2, 1/2; sum 5/2, pairs −7, product −4 | 12 | vieta-cubic | implemented, zoom-verified |
| 2.3 general cubic relations −b/a, c/a, −d/a | 13 | vieta-cubic | implemented |
| 2.3 Example 5 (starred): 3, −1, −1/3 zeroes of 3x³ − 5x² − 11x − 3 with p(−1/3) = −1/9 − 5/9 + 11/3 − 3 = 0 | 13 | vieta-cubic | implemented, zoom-verified |
| 2.3 Ex 2.2 Q1 six quadratics (zeroes: 4,−2; 1/2,1/2; −1/3,3/2; 0,−2; ±√15; 4/3,−1) | 14 | vieta-quadratic deeper + exerciseMap rows 7–12 | located in exerciseMap with PDF pages; factorisation patterns in quizzes/sims |
| 2.3 Ex 2.2 Q2 six (sum,product) builds (zoom-verified Q2 panel: (1/4,−1), (√2,1/3), (0,√5), (1,1), (−1/4,1/4), (4,1)) | 14 | vieta-cubic deeper + exerciseMap rows 13–18 | located in exerciseMap; e.g. (iv) → x²−x+1 in deeper |

Videos (all oEmbed-verified 2026-09-08, never invented): IWigvJcCAJ0, N30tN9158Kc, SSNA9gaAOVc (Khan Academy); 2ZzuZvz33X0, JBSDQLZtjFo, r3SEkdtpobo, bNQY0z76M5A (Khan Academy, reused from jemh104 where already verified — titles/channels re-fetched via oEmbed this session).

Gaps (honest): full worked solutions for all 18 exercise rows are mapped + pattern-covered, not solved in-page; polynomial division is a labelled extension (no division section exists in this rationalised PDF despite the §2.1 promise); browser matrix/teacher/learner review pending.
