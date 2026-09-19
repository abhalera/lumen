# NCERT Coverage Audit: Class 11 Chemistry Chapter 5 (kech105)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 5: *Thermodynamics*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt1_kech105.pdf` (32 pdf pages, printed pp. 136–167)
**SHA-256:** `095d14a7c535a2b234a228ae7b3a949bccd393a0d26c03bed22064765e9093de` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF (span dictionary + 2× PNG zoom proofs, no pdftotext)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 486 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  22 browser fixtures, 22 exercises with exact pages + source-wording checks, every quantitative answer
  recomputed from the book's givens — first-law arithmetic, Δn_g values, calorimetry, Hess cycles,
  bond-enthalpy atomization, spontaneity thresholds, ΔG°/K conversions, surroundings entropy — plus
  worked-example values and 7 video wire-ups).
- `browser_qa.cjs`: 155 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 22 lab scenarios).
- Videos: 7/7 wow cards wire the results file's oEmbed-verified first candidates
  (work/class11-chemistry-videos/results/kech105.json), each re-verified 200 OK with exact id/title/channel;
  `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  concepts→lessons, connect pairs→3 objects (1 wow + links + video), worked strings→objects,
  group/watch, quizzes level/type/solution/wrong, exercises q/title/given/steps/answer/takeaway/
  conceptIdx/conceptName/page/printPage (+135 offset), exerciseMap/exercisesNote.

## Honest fixes (verified against the PDF, not silently patched)

- **Q5.8 reactant phase**: prose says NH₂CN(s) but the printed equation shows NH₂CN(g); the solid is
  chemically correct (cyanamide melts at 44 °C) and is used (Δn_g = +0.5, ΔH = −741.5 kJ/mol).
- **Lesson section labels** corrected from pre-rationalization numbers to the book's actual 5.1–5.7
  (the Third Law lives at 5.6(e), equilibrium link at 5.6(d)/5.7).
- **One typo** in Q5.9's solution steps fixed against the PDF.
- Figure-dependent reasoning (bomb calorimeter Fig. 5.4, Born-Haber-style cycles) is solved with full
  textual descriptions, so no figure is required to follow the steps.

## Draft errors fixed against the PDF

- Section-label/phase/typo fixes above; TAB indentation corruption repaired; bare-formula fragments
  mapped to label/html/cond cards; stray closing tags removed; runaway-`$` and broken-tag spans fixed
  with anchored span repairs and parsed-string audits; sims.js gained the zero-arg data-preset shim
  and prediction-marking aliases.

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `thermo-systems-state` | Thermodynamic Systems, Boundaries, State Functions & Properties | 5.1 | 1–4 (pr. 136–139) | `systemtypes` (open/closed/isolated/adiabatic) | 3 |
| `first-law-work` | First Law of Thermodynamics, PV-Work & Reversible Expansion | 5.2, 5.3 | 5–10 (pr. 140–145) | `pvworklab` (rev/irrev/free expansion) | 3 |
| `enthalpy-calorimetry` | Enthalpy, Heat Capacities (Cp − Cv = R) & Calorimetry | 5.3, 5.4 | 10–14 (pr. 145–149) | `calorimeter` (bomb/coffee-cup) | 3 |
| `thermochemistry-hess` | Thermochemical Equations, Hess's Law & Bond Enthalpies | 5.4, 5.5 | 14–21 (pr. 149–156) | `hesscycle` (CH₄/CH₃OH/CCl₄ cycles) | 3 |
| `entropy-second-law` | Spontaneity, Entropy & the Second Law of Thermodynamics | 5.6 | 22–26 (pr. 157–161) | `entropylab` (stopcock free expansion) | 3 |
| `gibbs-spontaneity` | Gibbs Free Energy & Temperature-Dependent Spontaneity | 5.6 | 25–27 (pr. 160–162) | `gibbslab` (4 ΔH/ΔS cases) | 3 |
| `free-energy-equilibrium` | Free Energy, Equilibrium Constant (ΔG° = −RT ln K) & Third Law | 5.6, 5.7 | 26–28 (pr. 161–163) | `thirdlawsim` (K ladder + 0 K crystal) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 22 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **5.1 – 5.6** | State functions, adiabatic q=0, elemental enthalpies, ΔH vs ΔU, CH₄ formation, ΔH>0/ΔS>0 spontaneity | ✅ Complete | Source-wording + answer-statement checks |
| **5.7 – 5.11** | First law (701/394 J), cyanamide ΔU→ΔH, Al calorimetry, freezing path, CO₂ combustion heat | ✅ Complete | First-law, Δn_g, q=mcΔT, path-sum recomputation |
| **5.12 – 5.15** | N₂O₄/CO Hess, NH₃ formation per mole, methanol Hess, CCl₄ bond enthalpy | ✅ Complete | Hess-cycle and atomization arithmetic (326.0 kJ) |
| **5.16 – 5.19** | Isolated-system ΔS≥0, threshold T=2000 K, Cl₂ signs, O₃ ΔG°=+0.164 | ✅ Complete | T=ΔH/ΔS, ΔG=ΔH−TΔS recomputation |
| **5.20 – 5.22** | ΔG° from K=10, NO stability, surroundings ΔS=+959.7 | ✅ Complete | −2.303RT logK, q_rev/T recomputation |

**Total Exercises:** 22 / 22 (100% verified coverage).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech105` (204.5 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
