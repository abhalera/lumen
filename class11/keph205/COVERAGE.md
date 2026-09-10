# COVERAGE — keph205 Kinetic Theory

**Source:** `books/originals/Class11-Physics-Pt2_keph205.pdf` (15 pdf pages, printed pp. 244–258, Reprint 2026–27).  
**SHA-256:** `198ca1df5f39` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph205.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| molecular-nature | 12.1–12.2 | 1–3 | Complete; Kanada / Dalton / Avogadro |
| gas-laws | 12.3 | 3–5 | Complete; PV = μRT, Boyle, Charles, Dalton |
| kinetic-pressure | 12.4.1 | 6–7 | Complete; P = (1/3) n m ⟨v²⟩, Fig. 12.4 |
| kinetic-temp-rms | 12.4.2 | 7–8 | Complete; v_rms(N₂, 300 K) = 516 m s⁻¹ |
| equipartition | 12.5 | 9–10 | Complete; ½ k_B T per quadratic term |
| gas-specific-heats | 12.6 | 10–12 | Complete; Example 12.8 → 374 J |
| mean-free-path | 12.7 | 12–13 | Complete; ℓ = 1/(√2 π n d²) |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 12.1 steam fraction | 6×10⁻⁴ |
| 12.2 water-molecule volume | ~3×10⁻²⁹ m³, radius ~2 Å |
| 12.3 interatomic distance in vapour | ~40 Å |
| 12.4 Ne:O₂ | N ratio 3:2; density ratio 0.947 |
| 12.5 Ar/Cl₂ | KE ratio 1:1; v_rms ratio 1.33 |
| 12.6 UF₆ | 0.44 % speed difference |
| 12.8 helium flask | 374 J |
| 12.9 water vapour MFP | ~4×10⁻⁷ m |

## Exercises 12.1–12.10

All 10 mapped with steps in `chapter.json`. This reprint’s exercise list **ends at 12.10** (older additional-exercise numbers 12.11+ are not in this PDF).

## Edition note

Maxwell–Boltzmann speed distribution is **mentioned** (a distribution in velocities; ⟨v²⟩) but is **not** written as a numbered f(v) law. The Maxwell-speeds lab visualises v_rms = √(3RT/M) and the qualitative shape; it does not restore a deleted distribution section.

Van der Waals equation, viscosity derivation, and extra mean-free-path applications beyond §12.7 are not in this reprint — not invented.
