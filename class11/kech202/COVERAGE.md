# NCERT Coverage Audit: Class 11 Chemistry Chapter 8 (kech202)

**Textbook:** NCERT Class 11 Chemistry Part II, Chapter 8: *Organic Chemistry – Some Basic Principles and Techniques*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt2_kech202.pdf` (39 pdf pages, printed pp. 256–294)
**SHA-256:** `2508afbdbbd6c34ed1eb619fb096738b312e6bc87658dbcb014fbc9f70979b89` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF + Caesar-shift decoder (body −3, headings +3, digits in a private font at U+0013–U+001C)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 644 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  22 browser fixtures, 40 exercises with exact pages + draft-vs-PDF source-wording checks, all four
  quantitative estimations recomputed (8.32–8.35), steam-distillation worked arithmetic, and 7 video wire-ups).
- `browser_qa.cjs`: 151 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 22 lab scenarios).
- Videos: fresh research (no kech202 entries existed): 7 candidates, each oEmbed-verified 200 OK
  with exact title/channel match; results written to work/class11-chemistry-videos/results/kech202.json
  with an additive lessons.json entry; `verify_videos.py kech202` passes 7/7. All 7 wow cards wire the
  first candidates; `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  connect string→3 objects (1 wow + links + video), quizzes tier/question/explanation→
  level/prompt/solution/type/wrong, exercises +given/takeaway/conceptName (+255 offset),
  exerciseMap/exercisesNote, authored recall/group/section/print/sim/watch.

## Honest fixes (verified against the PDF, not silently patched)

- **PDF text layer is Caesar-shifted** (body −3, headings +3, digits U+0013–U+001C, formulas in a
  mixed-case font): exercise wording/values were decoded per-line with dictionary scoring and
  cross-checked (8.34's 0.3780/0.5740 g pins the digit mapping; the formula-font rule
  lowercase+3→UPPER / uppercase→lower decodes 8.4(f) Cl₂CHCH₂OH, 8.6(a) H–COOH, 8.2 HCONHCH₃ exactly).
- **Q8.32 uses the book's 0.20 g sample mass** (69% C, 4.8% H → 0.506 g CO₂, 0.0864 g H₂O).
- **Structure sub-parts printed as figures** (8.4 a–e, 8.8, 8.15, 8.16, 8.38 options) are transcribed
  from the printed diagrams into the question text; no figure is cited without being shown.
- **iupacbuilder default was chemically impossible** (2-methylpentan-2-one: C2 would carry five
  bonds): default substituent moved to C4 → 4-methylpentan-2-one.
- **Raw LaTeX in sim readouts fixed**: steam-distillation and TLC formulas now render as unicode.
- **Q8.16 wording**: draft dropped the article ("show electron flow"); restored the book's
  "show the electron flow".
- **Lesson page spans corrected**: draft put c6–c7 on the exercise pages; true body spans end at
  pdf p36 (exercises start p37). Exercise pages fixed per question (8.1–8.13 → p37, 8.14–8.20 →
  p38, 8.21–8.40 → p39).

## Draft errors fixed against the PDF

- Lesson spans/pages above; sims.js gained #preset-bar ids, preset-btn classes, #lab-controls ids
  for the c2 selects and c5 slider, plus the shared QA wrapper (data-preset), lab-readout bridge,
  prediction aliases, and connect-wow normalizer used by kech201.

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `c1` | Tetravalency of Carbon, Hybridization and Molecular Representations | 8.1–8.3 | 1–5 (pr. 256–260) | `hybridviewer` (5 molecules) | 3 |
| `c2` | IUPAC Nomenclature of Organic Compounds | 8.4, 8.5 | 6–14 (pr. 261–269) | `iupacbuilder` (name builder) | 3 |
| `c3` | Isomerism in Organic Compounds: Structural and Stereoisomerism | 8.6 | 15–16 (pr. 270–271) | `isomersim` (4 isomer types) | 3 |
| `c4` | Fundamental Concepts in Organic Reaction Mechanisms: Cleavage… | 8.7.1–8.7.3, 8.7.10 | 16–18 (pr. 271–273) | `arrowpusher` (3 intermediates) | 3 |
| `c5` | Electronic Displacement Effects: Inductive, Electromeric… | 8.7.4–8.7.9 | 19–22 (pr. 274–277) | `hyperlab` (α-H slider) | 3 |
| `c6` | Methods of Purification of Organic Compounds | 8.8 | 23–28 (pr. 278–283) | `purificationlab` (4 methods) | 3 |
| `c7` | Qualitative and Quantitative Elemental Analysis of Organic… | 8.9, 8.10 | 29–36 (pr. 284–291) | `elementalanalysis` (4 assays) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 40 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **8.1 – 8.8** | Hybridisation, σ/π counts, bond-line, IUPAC names, homologous series, functional groups | ✅ Complete | Source-wording + name-statement checks |
| **8.9 – 8.17** | Anion stability, hyperconjugation, resonance, electrophiles/nucleophiles, reaction types, isomer pairs, cleavage, acidity orders | ✅ Complete | Source-wording + mechanism-statement checks |
| **8.18 – 8.31** | Purification principles, crystallisation, distillation variants, Lassaigne chemistry, Dumas/Kjeldahl, Carius, chromatography, qualitative tests | ✅ Complete | Source-wording + principle-statement checks |
| **8.32 – 8.40** | Combustion masses, Kjeldahl %N, Carius %Cl/%S, hybridisation MCQ, Prussian blue, carbocation stability, chromatography, substitution type | ✅ Complete | Full numeric recomputation + MCQ keys |

**Total Exercises:** 40 / 40 (100% verified coverage, 227 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech202` (256.8 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
