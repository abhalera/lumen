# COVERAGE — lech101 Solutions

**Source:** `books/originals/Class12-Chemistry-Pt1_lech101.pdf` (30 pdf pages, printed pp. 1–30, Reprint 2026–27).
**SHA-256:** `99d19dbb008280c361496c6e184be91b214d70fb40837749c692c8c52add341f` (in `output/Class12/CHEM-SOURCE-MANIFEST.json`).
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/lech101.pdf

This 2026–27 reprint of Class 12 Chemistry Part I begins at Unit 1 Solutions. Solid State and the p-block chapters of older reprints are **not** in this book and are **not** restored here.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| types-concentration | 1.1, 1.2 | 1–5 | Complete; Table 1.1 types, Eqs. 1.1–1.9, Examples 1.1–1.3 |
| solubility-henry | 1.3 | 5–9 | Complete; like-dissolves-like, Eq. 1.11 p = K_H x, Table 1.2, Example 1.4 |
| raoult-vapour | 1.4 | 9–14 | Complete; Eqs. 1.12–1.16, 1.25; Intext 1.8; Example 1.6 |
| ideal-nonideal | 1.5 | 14–15 | Complete; Δ_mix H, Δ_mix V; ± deviations; Ex. 1.37 acetone–CHCl₃ |
| colligative-tb | 1.6.1–1.6.2 | 15–18 | Complete; relative lowering, ΔT_b = K_b m, Example 1.7 |
| freezing-osmosis | 1.6.3–1.6.5 | 18–23 | Complete; ΔT_f, π = CRT, reverse osmosis; Examples 1.9–1.10 |
| vant-hoff | 1.7 | 23–27 | Complete; i = 1+(n−1)α; Ex. 1.32–1.33, 1.40–1.41 |

## Core Worked Examples (zoom-verified)

| Item | Topic | Result |
|---|---|---|
| Ex 1.1 | 20% glycol mole fraction | x = 0.068 |
| Ex 1.2 | 5 g NaOH in 450 mL | 0.278 M |
| Ex 1.3 | 2.5 g CH₃COOH in 75 g benzene | 0.556 m |
| Ex 1.4 | N₂ Henry, K_H = 76.48 kbar | 0.716 mmol L⁻¹ |
| Ex 1.6 | 0.5 g in 39 g benzene, Δp | M₂ = 170 g mol⁻¹ |
| Ex 1.7 | 18 g glucose, K_b = 0.52 | ΔT_b = 0.052 K |
| Ex 1.9 | 45 g glycol in 600 g water | ΔT_f = 2.2 K; T_f = 270.95 K |
| Ex 1.10 | 1 g in 50 g benzene, ΔT_f = 0.40 K | M₂ = 256 g mol⁻¹ |

## End-of-Chapter Exercises 1.1–1.41

All **41** exercises from this reprint mapped with verbatim stems and independently recomputed numbers in `chapter.json`. Intext 1.1–1.12 answers checked against the book key (p.30): 15.28%/84.72%; 0.459; 0.024 M & 0.03 M; 36.946 g; 1.5 m, 1.45 M, 0.0263; 23.4 mm Hg; 121.67 g; 5.077 g; 30.96 Pa.

## Pedagogical Simulations (sims.js)

1. `concunits` — mass % ⇄ mole fraction ⇄ molarity ⇄ molality (Example 1.1–1.3 numbers).
2. `henrylaw` — p = K_H x; soda / scuba / warm-lake presets (Table 1.2).
3. `raoult` — two-component p–x diagram, Intext 1.8 and heptane–octane.
4. `deviation` — ideal line vs Exercise 1.37 acetone–chloroform negative deviation.
5. `deltatb` — ΔT_b = K_b m kettle (Example 1.7).
6. `osmosis` — π = CRT and reverse-osmosis pressure.
7. `vanthoff` — i for KCl / weak acid / dimer.
