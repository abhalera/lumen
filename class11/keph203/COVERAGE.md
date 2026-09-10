# COVERAGE — keph203 Thermal Properties of Matter

**Source:** `books/originals/Class11-Physics-Pt2_keph203.pdf` (24 pdf pages, printed pp. 202–225, Reprint 2026–27).  
**SHA-256:** `b062894aea80` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph203.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| temp-heat | 10.1–10.3 | 1–2 | Complete; Eq. 10.1 |
| ideal-gas-abs | 10.4 | 2–3 | Complete; PV = μRT, 0 K = −273.15 °C |
| thermal-expansion | 10.5 | 4–6 | Complete; α_V = 3α_ℓ, Example 10.2 = 218 °C |
| calorimetry | 10.6–10.7 | 7–9 | Complete; Example 10.3 s_Al = 0.911 kJ kg⁻¹ K⁻¹ |
| change-of-state | 10.8 | 9–13 | Complete; L_f, L_v, triple point, Examples 10.4–10.5 |
| conduction | 10.9.1 | 13–16 | Complete; Examples 10.6–10.7 |
| convection-radiation | 10.9.2–10.9.4 | 16–18 | Complete; Wien, Stefan, sea breeze |
| newton-cooling | 10.10 | 18–20 | Complete; Example 10.8 = 42 s |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 10.1 | α_A = 2 α_ℓ |
| 10.2 | T₂ = 218 °C |
| 10.3 | s_Al = 0.911 kJ kg⁻¹ K⁻¹ |
| 10.4 | L_f = 3.34×10⁵ J kg⁻¹ |
| 10.5 | Q = 9.1×10⁶ J |
| 10.6 | junction 44.4 °C |
| 10.7 | T = 315 K, K_eq = 91.6 W m⁻¹ K⁻¹, H ≈ 92 W |
| 10.8 | 42 s |
| Rail (text) | F ≈ 10⁵ N for ΔT = 10 °C, A = 40 cm² |
| Wien | moon ~200 K; Sun 6060 K |
| Body radiation | 66.4 W |

## Exercises 10.1–10.20

All 20 mapped with steps in `chapter.json`.

## Edition notes (honest gaps)

- TOC lists **Additional Exercises**; this 24-page PDF ends at Ex 10.20 on p.24. Additional exercises are **not present and not invented**.
- Kinetic theory of C_V (equipartition) is previewed in Ex 10.15 and deferred to Chapter 11 / 13 as the book does.
- Newton’s law is stated for small ΔT; Ex 10.20 is solved with the integrated form Eq. (10.22) → 10 min (the Example 10.8 average-rate shortcut would give ~9 min on a 30 °C drop).
