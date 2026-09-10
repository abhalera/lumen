# COVERAGE — kemh114 Probability

**Source:** `books/originals/Class11-Maths_kemh114.pdf` (25 pdf pages, printed pp. 289–312, Reprint 2026–27).  
**SHA-256:** `5fa16487face00ddff9fe2b4668fb3bdac0e0694a4ca515616ffea89506ac4ee`  
**Extraction:** PyMuPDF `page.get_text("dict")` + 1.6× PNG zooms in `extracted/zooms/` (p01–p25 complete). **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh114.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| events | 14.1–14.1.1 | 1–2 | Complete; two-coin table zoom p.1 |
| types-algebra | 14.1.2–14.1.3 | 2–4 | Complete; Example 1 die |
| exclusive-exhaustive | 14.1.4–14.1.5 | 4–7 | Complete; Examples 2–3 |
| axioms | 14.2 | 7–10 | Complete; three axioms zoom p.8 |
| equally-likely | 14.2.1–14.2.2 | 10–11 | Complete; P = m/n |
| addition-or | 14.2.3 | 11–13 | Complete; Fig. 14.1 Venn |
| complement | 14.2.4 | 13–17 | Complete; P(A′)=1−P(A) |
| applications | Examples 8–12 + Misc. | 17–24 | Complete |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| Example 3 | 0 / 1 / ≥2 heads partition 8 outcomes |
| Example 5 | P(diamond)=1/4, P(not ace)=12/13 |
| Example 6 | P(red)=4/9 |
| Example 7 | P(only one qualifies)=0.11 |
| Example 8 | P(no man)=1/6, P(one man)=2/3 |
| Example 12 | ⁵P₃=60; 1/60 and 1/10 |

## Exercises

- **14.1 Q1–Q7** (pdf pp. 6–7, print 294–295) — all mapped.
- **14.2 Q1–Q20** (pdf pp. 17–19, print 305–307) — all mapped.
- **Miscellaneous Exercise Q1–Q10** (pdf pp. 22–23, print 310–311) — all mapped.

Independent recomputation in `tests/verify.cjs` (m/n, addition, complements, ⁿCᵣ / ⁿPᵣ).

## Edition note

Conditional probability and Bayes are Class 12 in this rationalised sequence. This 25-page reprint stops at the addition rule, complements, and equally likely counting. Not invented.
