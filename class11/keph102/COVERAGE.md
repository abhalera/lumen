# COVERAGE — keph102 Motion in a Straight Line

**Source:** `books/originals/Class11-Physics-Pt1_keph102.pdf` (14 pdf pages, printed pp. 13–26, Reprint 2026–27).  
**SHA-256:** `cd0307176cef` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph102.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| point-rectilinear | 2.1 | 1 | Complete |
| instantaneous-velocity | 2.2 | 2–3 | Complete; Table 2.1 and Example 2.1 zoom-verified |
| acceleration | 2.3 | 3–5 | Complete |
| vt-area | 2.3 area rule | 4–5 | Complete |
| kinematic-eqns | 2.4 Eq. (2.9) | 5–6 | Complete; zoom p.6 |
| freefall-stopping | Examples 2.3–2.7 | 6–9 | Complete; t=5 s, t_r≈0.2 s zoom-verified |
| relative-velocity | Intro + Ex 2.14 | 1, 13 | Complete. Honest gap: TOC lists §2.5 but this reprint has no written §2.5 body |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 2.1 | v(0)=0, v(2)=10 m/s, avg 2–4 s = 15 m/s |
| Table 2.1 | v(4)=3.84 m/s for x=0.08 t³ |
| 2.3 | rise 20 m, t_ground=5 s (g=10) |
| 2.6 | d_s ∝ v₀² |
| 2.7 | t_r = √(2×0.21/9.8) ≈ 0.2 s |

## Exercises and figures

All 18 end exercises plus worked Examples 2.1, 2.3, and 2.7 are mapped to the seven lessons in `chapter.json` (21 mappings total). Each end exercise includes source page metadata, givens where applicable, worked steps, and a final answer. Numerical results were independently recomputed, including the 37 s drunkard timeline and the rebounding-ball event times.

Figures 2.9–2.15 were read from the p.12–14 source zooms and redrawn as accessible inline SVGs. The redraws support the graph-reading answers for Exercises 2.15–2.18 directly in the revision view.

## Interactive and media QA

The seven lessons contain 17 answerable interactive scenarios. Each lesson has one explicit “Wow!” video card wired to a verified, embeddable video; `work/class11-physics-videos/verify_videos.py keph102` reports zero problems. `tests/verify.cjs` checks source provenance, lesson structure, videos, exercises, figures, recomputations, and scenario syntax.

## Edition note

Relative velocity is promised in the contents and used in Ex 2.14, but there is no rain-man / 2-D relative-velocity section in this 14-page PDF. Not invented.
