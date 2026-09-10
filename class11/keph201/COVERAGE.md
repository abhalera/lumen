# COVERAGE — keph201 Mechanical Properties of Solids

**Source:** `books/originals/Class11-Physics-Pt2_keph201.pdf` (13 pdf pages, printed pp. 167–179, Reprint 2026–27).  
**SHA-256:** `54ef32e2d3eb` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph201.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| elasticity-intro | 8.1 | 1 | Complete |
| stress-strain | 8.2 | 2–3 | Complete; Eqs. 8.1–8.5 zoom-verified |
| hooke-curve | 8.3–8.4 | 3–4 | Complete; Fig. 8.2 / 8.3 |
| young-modulus | 8.5.1 | 4–6 | Complete; Table 8.1, Examples 8.1–8.3 |
| shear-modulus | 8.5.2 | 6 | Complete; Table 8.2, Example 8.4 |
| bulk-poisson-energy | 8.5.3–8.5.5 | 7–8 | Complete; Table 8.3, Example 8.5, Eq. 8.14 |
| applications | 8.6 | 8–10 | Complete; crane rope, Eq. 8.16, 10 km mountain |

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 8.1 | stress 3.18×10⁸ Pa, ΔL = 1.59 mm, strain 0.16% |
| 8.2 | W = 1.8×10² N (ΔL_c : ΔL_s = 2.5) |
| 8.3 | each femur ΔL = 4.55×10⁻⁵ m (0.0091%) |
| 8.4 | lead slab Δx = 0.16 mm |
| 8.5 | Indian Ocean 3000 m, ΔV/V = 1.36% (g = 10) |
| Table 8.1 | steel Y = 200 GPa, copper 110, bone 9.4; 0.1% of 0.1 cm² steel needs 2000 N |
| Table 8.2 | G_steel = 84 GPa, G_lead = 5.6 GPa; G ≈ Y/3 |
| Table 8.3 | B_water = 2.2 GPa, B_steel = 160, B_air (STP) = 1.0×10⁻⁴ GPa |

## Exercises 8.1–8.16

All 16 mapped with steps in `chapter.json`. Fig. 8.9–8.11 read from zooms p.11–12.

**Edition note:** PDF p.13 ends Ex 8.16 with a leftover typesetting fragment “carry one quarter of the load.” That is a remnant of a deleted additional exercise (older books had a pillar/load-sharing item). **Not invented as 8.17.** Additional exercises listed in some older TOCs are absent from this 13-page reprint.

Y_brass = 0.91×10¹¹ Pa is used in Ex 8.5 because Table 8.1 of this reprint does not list brass, but the same value appears in Chapter 10 Ex 10.9 of this edition.

## Honest gaps

- Interatomic-spring model of elasticity is not a numbered section in this reprint (older editions had it). Not invented.
- Anisotropy / single-crystal moduli are not in this PDF.
