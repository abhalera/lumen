# COVERAGE — kech101 Some Basic Concepts of Chemistry

**Source:** `books/originals/Class11-Chemistry-Pt1_kech101.pdf` (28 pdf pages, printed pp. 1–28, Reprint 2026–27).  
**SHA-256:** `dfce99993eeb8aa5bedf527f284341adcc492f383b0dd0bb2c6852b129ad79c6` (in `output/Class11/SOURCE-MANIFEST-CHEMISTRY.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kech101.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| matter-classification | 1.1, 1.2 | 1–4 | Complete; Rasayan Shastra, Kanāda parmanu & macroscopic classification |
| measurement-uncertainty-sigfigs | 1.3, 1.4 | 4–9 | Complete; SI base units, prefixes, precision vs accuracy, sig figs |
| chemical-combination-laws | 1.5 | 9–13 | Complete; Lavoisier, Proust, Dalton, Gay-Lussac, Avogadro |
| atomic-molecular-masses | 1.6, 1.7 | 13–16 | Complete; Dalton postulates, ¹²C standard, average isotopic mass |
| the-mole-concept | 1.8 | 16–18 | Complete; Avogadro constant, molar mass, 22.7 L STP volume |
| empirical-molecular-formula | 1.9 | 18–20 | Complete; Mass %, 5-step deduction method, molecular multiplier n |
| stoichiometry-solutions | 1.10 | 20–25 | Complete; Limiting reagent, Molarity, Molality, Mole fraction |

## Core Worked Examples (all zoom-verified)

| Item | Topic & Target Calculation | Result |
|---|---|---|
| 1.1 | Student A, B, C precision vs accuracy (2.000 g sample) | C is both precise & accurate |
| 1.2 | Empirical formula of Iron Oxide (69.9% Fe, 30.1% O) | Fe₂O₃ |
| 1.3 | Molar mass calculation for glucose C₆H₁₂O₆ | 180.16 g mol⁻¹ |
| 1.4 | Dilution equation M₁V₁ = M₂V₂ for standard acid solutions | Verified |

## End-of-Chapter Exercises 1.1–1.36

All 36 exercises mapped with full step-by-step guidance in `chapter.json`. Every numerical answer has been independently recomputed using atomic weights standard to IUPAC and verified against NCERT official textbook keys.

## Pedagogical Simulations (sims.js)

1. `matterstate`: Kinetic molecular lattice for solid, tumbling liquid, and gas with temperature slider.
2. `sigfiglab`: Analytical balance with target precision dartboard and rounding bench.
3. `reactionlaws`: Proust-Dalton mass combining ratios with stoichiometry levers.
4. `atomicmass`: Quadrupole mass spectrometer isotopic peak analyzer for Cl-35/Cl-37.
5. `moleconverter`: 4-way interactive mole bridge: Grams ⇄ Moles ⇄ Particle Count ⇄ Gas Litres.
6. `formulalab`: Empirical to molecular combustion analyzer workbench with dynamic multiplier.
7. `stoichiometrylab`: Haber process reaction chamber with limiting reagent meter and solution concentration dials.
