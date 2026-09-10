# COVERAGE — kemh109 Straight Lines

**Source:** `books/originals/Class11-Maths_kemh109.pdf` (25 pdf pages, printed pp. 151–175, Reprint 2026–27).  
**SHA-256:** `a162e0c15553689ad82f91b3595c87dcbc4b9f03a0a31660f61da1871167d385` (in `output/Class11/MATHS-SOURCE-MANIFEST.md`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh109.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| recall-coord | 9.1 | 1–2 | Complete; distance, 1:3 section, shoelace 27 zoom-verified p.2 |
| slope-inclination | 9.2, 9.2.1 | 2–6 | Complete; m=tan θ, two-point slope, Example 1 |
| parallel-perp-angle | 9.2.2–9.2.3 | 4–8 | Complete; m₁=m₂, m₁m₂=−1, tan θ formula, Examples 2–3 |
| point-slope-twopoint | 9.3.1–9.3.3 | 9–11 | Complete; y=±a, x=±b, point-slope, two-point, Examples 4–6 |
| slope-intercept | 9.3.4–9.3.5 | 11–14 | Complete; y=mx+c, x/a+y/b=1, general Ax+By+C=0 |
| distance-point-line | 9.4 | 14–17 | Complete; d=\|Ax₁+By₁+C\|/√(A²+B²) zoom p.16, Example 9 |
| parallel-distance-apps | 9.4.1 + Misc. | 16–25 | Complete; parallel-gap, image, concurrency |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| Distance (6,−4)–(3,0) | 5 |
| Section 1:3 of (1,−3),(−3,9) | (0,0) |
| Area (4,4),(3,−2),(−3,16) | 27 |
| 1a slope (3,−2),(−1,4) | −3/2 |
| 1d inclination 60° | √3 |
| 2 other slope, θ=π/4, m₁=½ | 3 or −1/3 |
| 3 perpendicular, x | 4 |
| 5 point-slope (−2,3), m=−4 | 4x+y+5=0 |
| 8 intercepts −3, 2 | 2x−3y+6=0 |
| 9 distance (3,−5) from 3x−4y−26=0 | 3/5 |
| 10 parallel gap | 2/5 |
| 11 concurrent k | −2 |
| 12 along 135° | 3√2 |
| 13 image of (1,2) in x−3y+4=0 | (6/5, 7/5) |

## Exercises 9.1 (11) + 9.2 (19) + 9.3 (17) + Miscellaneous (23)

All **70** items mapped with steps in `chapter.json`. Numerical items independently recomputed. This reprint has no family-of-lines / shifting-of-origin section (rationalised); those are not invented.

## Pedagogical simulations (sims.js)

1. `coordrecall` — distance, 1:3 section, shoelace triangle.
2. `slopeline` — inclination θ slider, m=tan θ, vertical trap.
3. `parperp` — two slopes, parallel / perpendicular / Example 2.
4. `pointslope` — y−y₀=m(x−x₀) sliders.
5. `slopeint` — **y=mx+c** intercept lab.
6. `distptline` — perpendicular from P to Ax+By+C=0.
7. `parldist` — gap between parallel lines.
