# COVERAGE — kemh112 Limits and Derivatives

**Source:** `books/originals/Class11-Maths_kemh112.pdf` (40 pdf pages, printed pp. 217–256, Reprint 2026–27).  
**SHA-256:** `958f84db2b6254741392033e67e2467c55742af4f21b54065334982f703b1ce0`  
**Extraction:** PyMuPDF `page.get_text("dict")` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh112.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| intuitive-derivative | 12.1–12.2 | 1–4 | Complete; Tables 12.1–12.3 and Fig. 12.1 zoom-verified |
| limits-lhl-rhl | 12.3 | 4–12 | Complete; Fig. 12.2 hole, Fig. 12.3 jump |
| algebra-poly-rational | 12.3.1–12.3.2 | 12–17 | Complete; Theorem 1, p(a), cancelled rationals |
| trig-limits | 12.4 | 18–21 | Complete; inequality (*) and Example 4 zoom p.18–20 |
| derivative-def | 12.5 | 23–27 | Complete; Definition 1, Examples 5–12 |
| algebra-derivatives | 12.5.1 | 28–30 | Complete; Theorem 5 product/quotient |
| poly-trig-deriv | 12.5.2 | 30–33 | Complete; Theorems 6–7, Examples 13–18 |
| first-principles-misc | Misc. Ex. | 33–40 | Complete; summary zoom p.38–39 |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| Tables 12.2–12.3 | v(2) squeezed in (19.551, 19.649); exact 19.6 m/s |
| Example 1 | polynomial limits 1, 12, 1 |
| Example 4 | sin 4x / sin 2x → 2; tan x / x → 1 |
| Example 5 | (3x)′ at 2 is 3 |
| Example 6 | f′(−1) = −1, f′(0) = 3 |
| Example 7 | (sin x)′ at 0 is 1 |
| Example 13 | 600x⁹⁹ − 55x⁵⁴ + 1 |
| Example 18 | (sin² x)′ = sin 2x |

## Exercises

- **12.1 Q1–Q32** (pdf pp. 21–23, print 237–239) — all mapped.
- **12.2 Q1–Q11** (pdf pp. 32–33, print 248–249) — all mapped, sub-parts included.
- **Miscellaneous Exercise Q1–Q30** (pdf pp. 37–38, print 253–254) — all mapped.

Numerical items were recomputed independently in `tests/verify.cjs` (falling-body table, cancelled rationals, sandwich, first-principle difference quotients).

## Edition note

Chapter number is **12** in this 2026–27 reprint (older prints numbered it 13). Table 12.1 is still referred to once as “Table 13.1” on p.1 — a leftover; the adjoining table and later captions say 12.1. Not invented.
