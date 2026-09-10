# COVERAGE — keph202 Mechanical Properties of Fluids

**Source:** `books/originals/Class11-Physics-Pt2_keph202.pdf` (22 pdf pages, printed pp. 180–201, Reprint 2026–27).  
**SHA-256:** `3ff64c89dcbf` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph202.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| pressure | 9.1–9.2 | 1–3 | Complete; Example 9.1 = 2×10⁵ Pa |
| pascal-depth | 9.2.1–9.2.3 | 3–6 | Complete; Pascal prism, P = P_a+ρgh, barometer |
| hydraulic | 9.2.4 | 6–7 | Complete; Examples 9.5–9.6 |
| streamline | 9.3 | 7–8 | Complete; Av = constant |
| bernoulli | 9.4 | 8–11 | Complete; Torricelli, Magnus, Example 9.7 |
| viscosity-stokes | 9.5 | 11–13 | Complete; Stokes, v_t, Example 9.9 |
| surface-tension | 9.6 | 13–18 | Complete; 2S/r, 4S/r, capillary, Example 9.10 |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 9.1 | P_av = 2×10⁵ Pa (g = 10) |
| 9.2 | 10 m lake: 2.01×10⁵ Pa ≈ 2 atm (g = 10) |
| 9.3 | uniform-density atmosphere ≈ 8 km |
| 9.4 | 1000 m ocean: ~104 atm absolute; window force 4.12×10⁵ N |
| 9.5 | F₂ = 90 N; L₂ = 0.67 cm |
| 9.6 | F₁ = 1470 N ≈ 1.5×10³ N |
| 9.7 | ΔP = 6.5 kPa; 8% speed difference |
| 9.8 | η = 3.46×10⁻³ Pa s |
| 9.9 | η_oil = 0.99 Pa s |
| 9.10 | P_i = 1.02×10⁵ Pa; excess 146 Pa |

## Exercises 9.1–9.20

All 20 mapped with steps in `chapter.json`. Fig. 9.20–9.21 read from zooms p.22.

## Edition notes (honest gaps)

- **Archimedes / buoyancy is not a numbered section** in this reprint’s body (TOC: 9.1–9.6 only). Buoyancy appears only as the −σ term in Stokes’ terminal-velocity balance (Eq. 9.18). Not invented as a lesson.
- **Poiseuille’s formula** is not derived in the body; Ex 9.13 nevertheless requires Q = πr⁴ΔP/(8ηL). Used for that exercise and labelled as beyond the derived text.
- TOC lists “Additional exercises” and “Appendix”; this 22-page PDF ends at Ex 9.20. **Additional exercises are not present and are not invented.**
- 1 atm is 1.013×10⁵ Pa in §9.2 and 1.01×10⁵ Pa in several examples — both as printed.
