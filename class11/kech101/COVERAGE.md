# COVERAGE — kech101 Some Basic Concepts of Chemistry

**Source:** `books/originals/Class11-Chemistry-Pt1_kech101.pdf` (28 pdf pages, printed pp. 1–28, Reprint 2026–27).
**SHA-256:** `dfce99993eeb8aa5bedf527f284341adcc492f383b0dd0bb2c6852b129ad79c6` (in `output/Class11/SOURCE-MANIFEST-CHEMISTRY.json`).
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/kech101.pdf

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 655 checks pass (source-PDF hash fixture, packaging, lesson schema, 22 browser
  fixtures, 36 exercises with exact pages + source-wording checks, every numerical answer recomputed
  from the book's givens, 6 numeric quizzes recomputed, worked-example values, 7 video wire-ups).
- `browser_qa.cjs`: 149 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 22 lab scenarios).
- Videos: 7/7 wow cards wire agy-imported's oEmbed-verified first candidates
  (work/class11-chemistry-videos/results/kech101.json); `verify_videos.py kech101` passes with 0 problems
  on an independent re-run, and `tests/verify.cjs` cross-checks every wired id/title/channel exactly.

## Honest print quirks (handled in the steps, not silently patched)

- **Q1.8** as printed gives only mass percents (69.9/30.1) with no molar mass, so only the empirical
  formula (Fe₂O₃) is determinable. The solution says so explicitly and gives the conditional n = 1 case.
- **Q1.24** as printed omits the coefficient 3 (`N₂ + H₂ → 2NH₃`, confirmed on the p. 27 zoom). The
  question quotes it verbatim; step 1 restores the balanced equation before computing.
- **Q1.14 / §1.3**: this reprint still defines the kilogram by the Pt-Ir prototype cylinder (the mole alone
  was updated to the exact-constant definition). Answer follows the book, with the 2019 update noted.
- **STP volume**: the book uses 22.7 L (CH₄ combustion example, p. 20), so Q1.34's molar mass is 26.3 g mol⁻¹.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| matter-classification | 1.1, 1.2 | 1–6 | Rasayan Shastra, Kanada Parmanu (Vaiseshika) & macroscopic classification |
| measurement-uncertainty-sigfigs | 1.3, 1.4 | 6–14 | SI base units, Table 1.4 precision/accuracy, sig figs |
| chemical-combination-laws | 1.5 | 14–16 | Lavoisier, Proust (cupric carbonate 51.35/9.74/38.91), Dalton, Gay-Lussac, Avogadro |
| atomic-molecular-masses | 1.6, 1.7 | 16–18 | Dalton postulates, ¹²C standard, 1 u = 1.66056×10⁻²⁴ g, average isotopic mass |
| the-mole-concept | 1.8 | 18 | Avogadro constant (exact 6.02214076×10²³ per this reprint), molar mass, 22.7 L STP volume |
| empirical-molecular-formula | 1.9 | 18–20 | Mass %, Problem 1.2 five-step method, molecular multiplier n |
| stoichiometry-solutions | 1.10 | 20–25 | Limiting reagent, balancing box, molarity, molality, mole fraction |

## Worked examples (all recomputed from the book's data)

| Lesson | Item | Result |
|---|---|---|
| 1 | Classification check (element/compound/mixture) | (a) element; (b) compound; (c) homogeneous; (d) heterogeneous; (e) homogeneous |
| 2 | Table 1.4: Students A, B, C vs 2.000 g standard | A precise only; B neither; C both |
| 3 | Ex 1.21 oxygen ratio per 14 g N | 2 : 4 : 2 : 5 |
| 4 | Ex 1.9 chlorine average | 35.453 u |
| 5 | Ex 1.10 in 3 mol ethane | 6 mol C; 18 mol H; 1.807 × 10²⁴ molecules |
| 6 | Ex 1.3 iron oxide empirical formula | Fe₂O₃ |
| 7 | Ex 1.24 Haber limiting reagent | 2.43 kg NH₃; 568 g H₂ unreacted |

## End-of-Chapter Exercises 1.1–1.36 (pp. 25–28)

All 36 present with full step-by-step solutions; every numerical value independently recomputed
(see `tests/verify.cjs` §6). Exercise pages: 1.1–1.5 on p. 25, 1.6–1.19 on p. 26, 1.20–1.27 on p. 27,
1.28–1.36 on p. 28. No exercise cites a textbook figure.

## Pedagogical Simulations (sims.js)

1. `matterstate`: solid/liquid/gas kinetic lattice with temperature slider.
2. `sigfiglab`: Table 1.4 precision dartboard + live sig-fig analyser.
3. `reactionlaws`: Ex 1.21 multiple-proportions table, Proust water, Gay-Lussac volumes.
4. `atomicmass`: chlorine isotope mass spectrum with live weighted average.
5. `moleconverter`: 4-way mole bridge (mass ⇄ moles ⇄ entities ⇄ STP litres, 22.71 L).
6. `formulalab`: 5-step empirical→molecular deduction workbench.
7. `stoichiometrylab`: Haber reactor with limiting-reagent meter + M-vs-m comparator.
