# COVERAGE — keph204 Thermodynamics

**Source:** `books/originals/Class11-Physics-Pt2_keph204.pdf` (18 pdf pages, printed pp. 226–243, Reprint 2026–27).  
**SHA-256:** `00462650d55b` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph204.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| thermal-eq-zeroth | 11.1–11.3 | 1–3 | Complete; Fig. 11.1–11.2 |
| heat-u-work | 11.4 | 4–5 | Complete; water ΔU = 2086.8 J zoom p.5 |
| first-law | 11.5 | 5–6 | Complete; Eq. (11.1) ΔQ = ΔU + ΔW |
| specific-heat | 11.6 | 6–7 | Complete; C_p − C_v = R, 1 cal = 4.186 J |
| state-vars-quasi | 11.7–11.8.1 | 8–9 | Complete; free expansion off the P–V–T surface |
| pv-processes | 11.8.2–11.8.6 | 9–11 | Complete; Fig. 11.8 isotherm vs adiabat zoom p.10 |
| second-law-rev | 11.9–11.10 | 11–12 | Complete; Kelvin–Planck and Clausius |
| carnot | 11.11 | 12–14 | Complete; Fig. 11.9, η = 1 − T₂/T₁ |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 1 g water → steam | ΔQ = 2256 J, ΔW = 169.2 J, ΔU = 2086.8 J |
| Ex 11.1 geyser | 15.75 g min⁻¹ (s = 4.2×10³ J kg⁻¹ K⁻¹) |
| Ex 11.2 N₂ | Q = 933.75 J at constant pressure |
| Ex 11.4 H₂ adiabatic | P₂/P₁ = 2^{1.4} = 2.64 |
| Ex 11.5 two paths | W = 16.9 J |
| Ex 11.6 free expansion | P_f = 0.5 atm, ΔU = ΔT = 0, off-surface |
| Ex 11.7 heater | dU/dt = 25 W |
| Ex 11.8 Fig. 11.11 | W_{DEF} = 450 J (zoom p.18) |

## Exercises 11.1–11.8

All 8 mapped with steps in `chapter.json`. This reprint’s exercise list ends at 11.8 (no Additional Exercises). Fig. 11.11 axes read from zoom p.18: D(2.0 m³, 600 N m⁻²), E(5.0 m³, 300 N m⁻²), F(2.0 m³, 300 N m⁻²).

## Edition note

Heat engines, refrigerators, Carnot, reversible/irreversible processes are present. Entropy is named in a footnote as a state variable but is **not** developed as a section in this reprint — not invented here.
