# COVERAGE — keph105 Work, Energy and Power

**Source:** `books/originals/Class11-Physics-Pt1_keph105.pdf` (21 pdf pages, printed pp. 71–91, Reprint 2026–27).  
**SHA-256:** `a6d4b72b0fc1` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph105.pdf

## Concepts (7)

| ID | Section | PDF pp | Status |
|---|---|---|---|
| scalar-work | 5.1–5.3 | 1–4 | Complete; Example 5.1 zoom p.2, Example 5.3 zoom p.4 |
| we-ke | 5.2, 5.4, 5.6 | 3–7 | Complete; raindrop and bullet zoom-verified |
| variable-force | 5.5–5.6 | 5–7 | Complete; Fig. 5.3–5.4 area rule |
| pe-conserve | 5.7–5.8 | 7–10 | Complete; vertical circle Example 5.7 |
| spring | 5.9 | 10–12 | Complete; independent x_m (see edition note) |
| power | 5.10 | 13 | Complete; 44000 W = 59 hp |
| collisions | 5.11 | 13–16 | Complete; 1-D + 2-D glance. No extra collision types invented |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 5.1 | F·d=16, cos θ=0.32 |
| 5.2 | W_g=10.0 J, ΔK=1.25 J, W_r=−8.75 J (g=10) |
| 5.3 | W_road=−2000 J; W_cycle on road=0 |
| 5.4 | K_i=1000 J, v_f=63.2 m s⁻¹ |
| 5.5 | W_F=1750 J, W_f=−1000 J |
| 5.6 | K_f=0.50 J, v_f=1 m s⁻¹ |
| 5.7 | v₀=√(5gL), v_B=√(3gL), v_C=√(gL), K_B/K_C=3 |
| 5.8 | K=1.25×10⁴ J. Independent x_m=√(2K/k)=2.18 m |
| 5.9 | Independent x_m=1.43 m (μ=0.5, g=10) |
| 5.10 | P=44000 W=59 hp |
| 5.11 | deuterium f1=1/9 |
| 5.12 | θ1=53°, outgoing 90° |

## Exercises 5.1–5.23

All 23 end-exercises of this reprint mapped with steps in `chapter.json`. Fig. 5.11–5.15 read from zooms p.18–21. No Additional Exercises (those were dropped in the rationalised edition).

## Edition notes

- This 21-page rationalised reprint has **no** Additional Exercises and **no** deleted older appendices.
- Example 5.8 prints x_m=2.00 m with k=5.25×10³ N m⁻¹ and K=1.25×10⁴ J. Independently ½k(2)²=1.05×10⁴ J ≠ K; √(2K/k)=**2.18 m**. Example 5.9 prints 1.35 m; the quadratic with the given k, μ=0.5, g=10 gives **1.43 m**. Lessons and tests use the independent values and flag the print.
- g=10 in Examples 5.2, 5.9, 5.10 as printed; g=9.8 in numerical end-exercises unless the example specifies 10.
