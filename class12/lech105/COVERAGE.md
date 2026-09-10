# COVERAGE — lech105 Coordination Compounds

**Source:** `books/originals/Class12-Chemistry-Pt1_lech105.pdf` (23 pdf pages, printed pp. 118–140, Reprint 2026–27).  
**SHA-256:** `9cca0d995461bb4ba9e02dd4c40b9c3ba40fccfdc132f4a8a0959a82cea209b3`  
**Extraction:** PyMuPDF `page.get_text("dict")` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/lech105.pdf

## Lessons (8)

| ID | Section | PDF pp | Print | Sim | Status |
|---|---|---|---|---|---|
| werner | 5.1 | 1–3 | 118–120 | `werner` | Complete; Table 5.1 3/2/1 mol AgCl |
| definitions | 5.2 | 4–5 | 121–122 | `terms` | Complete; CN of ox/en = 6; EDTA hexadentate |
| nomenclature | 5.3 | 5–7 | 122–124 | `iupac` | Complete; Examples 5.2–5.3; 2004 –ido draft |
| stereo-isomerism | 5.4.1–5.4.2 | 8–9 | 125–126 | `isomerism` | Complete; cis/trans, fac/mer, Fig. 5.6–5.7 |
| structural-isomerism | 5.4.3–5.4.6 | 10–11 | 127–128 | `structiso` | Complete; linkage, coordination, ionisation, hydrate |
| vbt | 5.5.1–5.5.3 | 11–14 | 128–131 | `vbtlab` | Complete; d²sp³ vs sp³d²; Ex 5.7 μ=5.9 BM Td |
| cft | 5.5.4–5.5.6 | 14–18 | 131–135 | `cftlab` | Complete; e_g +0.6 Δo, t₂g −0.4 Δo; Δt=(4/9)Δo; 498 nm |
| carbonyls-apps | 5.6–5.7 | 18–20 | 135–137 | `apps` | Complete; synergic CO; EDTA, cis-platin, cyanidation |

## CFT / geometry zoom-verified (p.15)

| Item | Result |
|---|---|
| Octahedral barycentre | e_g + (3/5)Δo = +0.6 Δo; t₂g −(2/5)Δo = −0.4 Δo |
| d⁴ weak | t₂g³ e_g¹ (Δo < P) |
| d⁴ strong | t₂g⁴ e_g⁰ (Δo > P) |
| Tetrahedral | Δt = (4/9) Δo; inverted; low-spin rare |
| [Ti(H₂O)₆]³⁺ | 498 nm blue-green absorbed → violet |
| Spectrochemical | I⁻ < Br⁻ < SCN⁻ < Cl⁻ < S²⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < edta⁴⁻ < NH₃ < en < CN⁻ < CO |

## Exercises 5.1–5.31

All 31 mapped with steps in `chapter.json`. Intext 5.1–5.10 answers from zoom p.23. Ex 5.24 magnetic moments use spin-only √n(n+2) consistent with Unit 4 Table 4.7.

## Honest gaps

- Ex 5.6(v)/(x) nitrito-O vs nitrito-N formulas follow the 2004 donor-atom tags in this reprint.
- Ex 5.11(iii) has several geometrical arrangements; the solution lists the pattern rather than inventing unlabelled drawings.
- CFT does not quote numerical Δo values not present in the reprint.
