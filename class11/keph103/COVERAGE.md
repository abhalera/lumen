# COVERAGE — keph103 Motion in a Plane

**Source:** `books/originals/Class11-Physics-Pt1_keph103.pdf` (22 pdf pages, printed pp. 27–48, Reprint 2026–27).  
**SHA-256:** `7619da28a2e5` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph103.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| scalars-vectors | 3.1–3.2 | 1–3 | Complete |
| graphical-add | 3.3–3.4 | 3–5 | Complete; Example 3.1 zoom p.5: 37 m s⁻¹, 19° |
| resolution | 3.5 | 5–7 | Complete |
| analytical-add | 3.6 | 7–9 | Complete; Example 3.3 zoom p.8: ≅22 km/h, 23.4° |
| plane-kinematics | 3.7 | 9–11 | Complete; Example 3.4 zoom p.11: 5.0 m s⁻¹ at 53° |
| const-acc-plane | 3.8 | 11–13 | Complete; Example 3.5 zoom p.12: t=6 s, y=36 m, |v|≅26 m s⁻¹ |
| projectile | 3.9 | 13–15 | Complete; Examples 3.6–3.8 zoom p.14 |
| ucm | 3.10 | 15–17 | Complete; Example 3.9 zoom p.16 |

This reprint has **no separate relative-velocity section** (rain-man, river-boat as named §). Relative combination appears only as ordinary vector addition (Example 3.1, 3.3). Not invented.

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 3.1 | R=37 m s⁻¹, θ=19° east of vertical |
| 3.2 | R=√(A²+B²+2AB cos θ); tan α = B sin θ / (A+B cos θ) |
| 3.3 | R≅22 km/h, φ≅23.4° |
| 3.4 | v=3.0 î+4.0 t ĵ, a=4.0 ĵ; at 1 s, 5.0 m s⁻¹ at 53° |
| 3.5 | t=6 s, y=36.0 m, speed ≅26 m s⁻¹ |
| 3.6 | ranges at 45°±α equal |
| 3.7 | t=10 s, speed=99 m s⁻¹ (g=9.8) |
| 3.8 | h_m=10.0 m, T_f=2.9 s, R=69 m |
| 3.9 | ω=0.44 rad/s, v=5.3 cm s⁻¹, a=2.3 cm s⁻² |

## Exercises 3.1–3.22

All 22 mapped. Fig. 3.19–3.20 read from zoom p.21. Numerical items independently recomputed with g=9.8 unless an example used another value (none of the in-chapter projectile examples use g=10).

Ex 3.22 uses the symmetric 15°+15° geometry (observer under the midpoint of the 10 s chord): v=2×3400×tan 15° / 10 ≈ 182 m s⁻¹. The PDF does not print a numerical key; this is the standard reading of “angle subtended … 30°”.

## Edition notes / honest gaps

- No Additional / Appendix exercises in this 22-page PDF.
- Scalar product and vector product are **not** developed (they wait for later chapters). Not invented.
- Non-uniform circular motion (tangential a) is only a Point to Ponder, not a numbered section.
