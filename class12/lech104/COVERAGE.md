# COVERAGE — lech104 The d- and f-Block Elements

**Source:** `books/originals/Class12-Chemistry-Pt1_lech104.pdf` (29 pdf pages, printed pp. 89–117, Reprint 2026–27).  
**SHA-256:** `4f33bf2825d1d693b78ae52c13002f45bce3881a3934790eaf34133b6ccb8972`  
**Extraction:** PyMuPDF `page.get_text("dict")` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/lech104.pdf

## Lessons (8)

| ID | Section | PDF pp | Print | Sim | Status |
|---|---|---|---|---|---|
| dblock-config | 4.1–4.2 | 1–3 | 89–91 | `dfill` | Complete; Table 4.1 Cr 3d⁵4s¹, Cu 3d¹⁰4s¹ zoom p.2–3 |
| physical-sizes | 4.3.1–4.3.2 | 4–6 | 92–94 | `physprop` | Complete; Zn ΔaH 126; Zr 160 / Hf 159 pm |
| ie-oxstates | 4.3.3–4.3.4 | 7–9 | 95–97 | `oxmap` | Complete; Table 4.3 bold OS zoom p.8 |
| electrode-plus2plus3 | 4.3.5–4.3.8 | 10–13 | 98–101 | `ezero` | Complete; E° Cu +0.34; Mn³⁺/Mn²⁺ +1.57; Co³⁺/Co²⁺ +1.97 |
| magnet-colour-cat | 4.3.9–4.3.14 | 13–16 | 101–104 | `spinonly` | Complete; Table 4.7 μ = √n(n+2); Table 4.8 colours |
| oxoanions | 4.4 | 17–20 | 105–108 | `oxoanion` | Complete; E° 1.33 / 1.52 / 1.69 / 0.56 V; 6.4 g/100 g; 513 K |
| lanthanoids | 4.5 | 20–23 | 108–111 | `lnradii` | Complete; Table 4.9 only — Lu radii not invented |
| actinoids-apps | 4.6–4.7 | 23–26 | 111–114 | `actinoid` | Complete; Table 4.11 Th+4…Np+7 |

## Tables / numbers zoom-verified

| Item | Result |
|---|---|
| Table 4.2 ΔaH | Sc 326 … V 515 … Zn 126 kJ mol⁻¹ |
| Table 4.2 E°(M²⁺/M) | Cu +0.34 V; Zn −0.76 V |
| Table 4.2 E°(M³⁺/M²⁺) | Cr −0.41; Mn +1.57; Fe +0.77; Co +1.97 V |
| Table 4.3 | Mn +2…+7 (bold +2,+7); Zn only +2 |
| Table 4.7 | Mn²⁺ μ_calc 5.92 BM (obs. 5.96) |
| Table 4.9 Ln³⁺ | La 106 … Yb 86 pm; Lu blank |
| E°(Ce⁴⁺/Ce³⁺) | +1.74 V |
| Mischmetall | ~95% Ln + ~5% Fe |

## Exercises 4.1–4.38

All 38 mapped with steps in `chapter.json`. Intext 4.1–4.10 answers from zoom p.29. Open-ended comparison items (4.20, 4.33, 4.35, 4.37) stay inside tabulated facts.

## Honest gaps

- Lu metallic and Ln³⁺ radii are **not listed** in Table 4.9; not invented.
- Table 4.4 ΔaH(Ti) is 469 vs Table 4.2 473 — each table quoted as printed.
- Exercise 4.17 uses rounded E° (−0.9, −0.4, −1.2, +1.5, −0.4, +0.8 V), not the Table 4.2 extras.
