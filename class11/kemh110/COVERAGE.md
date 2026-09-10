# COVERAGE — kemh110 Conic Sections

**Source:** `books/originals/Class11-Maths_kemh110.pdf` (32 pdf pages, printed pp. 176–207, Reprint 2026–27).  
**SHA-256:** `f4c1153fc0b2d647b2e67e46b83fb790d630936a6c2c5a402d2a4b44ff5bde4b` (in `output/Class11/MATHS-SOURCE-MANIFEST.md`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh110.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| cone-sections | 10.1–10.2 | 1–4 | Complete; β vs α, degenerates through V |
| circle | 10.3 | 4–6 | Complete; (x−h)²+(y−k)²=r² zoom p.5 |
| parabola | 10.4 | 7–12 | Complete; y²=4ax zoom p.8, four standards, LR=4a |
| ellipse-std | 10.5–10.5.2 | 12–14 | Complete; PF₁+PF₂=2a, a²=b²+c², e=c/a |
| ellipse-eq | 10.5.3–10.5.4 | 14–20 | Complete; both standard forms, LR=2b²/a, Examples 9–13 |
| hyperbola | 10.6 | 20–27 | Complete; \|PF₁−PF₂\|=2a, c²=a²+b², e>1, Examples 14–16 |
| conic-apps | Misc. Ex 17–19 | 27–29 | Complete; mirror 60 cm, beam 2√6 m, rod ellipse |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 1 origin circle | x²+y²=r² |
| 2 centre (−3,2), r=4 | (x+3)²+(y−2)²=16 |
| 3 complete the square | centre (−4,−5), r=7 |
| 5 y²=8x | a=2, focus (2,0), dir x=−2, LR=8 |
| 8 through (2,−3), y-axis | 3x²=−4y |
| 9 x²/25+y²/9=1 | c=4, e=4/5, LR=18/5 |
| 10 9x²+4y²=36 | major on y, a=3, e=√5/3 |
| 14(i) x²/9−y²/16=1 | c=5, e=5/3, LR=32/3 |
| 16 foci (0,±12), LR=36 | 3y²−x²=108 |
| 17 mirror a=5, depth 45 | AB=60 cm |
| 18 beam | x=2√6 m |
| 19 rod AP=6, AB=15 | x²/81+y²/36=1 |

## Exercises 10.1 (15) + 10.2 (12) + 10.3 (20) + 10.4 (15) + Miscellaneous (8)

All **70** items mapped with steps in `chapter.json`. Ex 10.4 Q14 is **e=4/3** (zoom p.27, stacked fraction). Numerical items independently recomputed.

## Pedagogical simulations (sims.js)

1. `conecut` — β vs α: circle / ellipse / parabola / hyperbola / degenerate.
2. `circlehk` — (h,k,r) sliders.
3. `parabola` — four standard openings, focus, directrix, latus rectum.
4. `ellipse` — a, b, major-axis toggle, e and LR.
5. `hyperbola` — transverse-axis toggle, e>1.
6. `conicapp` — Example 17 mirror and Example 18 beam.
