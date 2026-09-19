# NCERT Coverage Audit: Class 11 Chemistry Chapter 9 (kech203)

**Textbook:** NCERT Class 11 Chemistry Part II, Chapter 9: *Hydrocarbons*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt2_kech203.pdf` (33 pdf pages, printed pp. 295–327)
**SHA-256:** `0afd5c294084a15d8c2d2be7d3b6bc09dd7a9a43d61691b29ff9791374a33046` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF plain-text read (no cipher, unlike kech202)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 560 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  26 browser fixtures, 25 exercises with exact pages + draft-vs-PDF source-wording checks, all four
  Q9.8 combustion equations rechecked atom-by-atom, ozonolysis carbon counts, Q9.14 H-count,
  resonance-energy arithmetic, and 7 video wire-ups).
- `browser_qa.cjs`: 171 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 26 lab scenarios).
- Videos: fresh research (no kech203 entries existed): 7 candidates, each oEmbed-verified 200 OK
  with exact title/channel match (one dead Quizalize-sourced Markovnikov link replaced by the
  OrgChemTutor peroxide-effect video); results in work/class11-chemistry-videos/results/kech203.json
  with an additive lessons.json entry; `verify_videos.py kech203` passes 7/7. All 7 wow cards wire the
  first candidates; `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  29 LaTeX formulas → unicode cards, worked problem/solution → titled object with given/steps/answer,
  prediction question/correct → prompt/answer, quizzes +level/type/solution/wrong,
  connect 2 desc-cards + wow video card, exercises +q/given/takeaway/conceptName/conceptIdx (+294 offset),
  exerciseMap/exercisesNote, authored recall/group/section/print/sim/watch.

## Honest fixes (verified against the PDF, not silently patched)

- **Structure sub-parts printed as figures** (9.2 c–f, 9.12) are transcribed from the printed
  diagrams into the question text; no figure is cited without being shown.
- **Book quirks kept verbatim**: Q9.7 "of an alkene?", Q9.10 "extra ordinarily", Q9.15 "has on
  its boiling point" (all confirmed in the PDF text layer).
- **Lesson page spans corrected**: draft strings ran c7 to p42, past the 33-page PDF; true body
  spans end at pdf p31 (summary p32, exercises pp. 32–33).
- **Conformation-lab energy curve was inverted**: staggered ethane displayed 12.55 kJ/mol and
  eclipsed 0.00 (sign error in the torsional formula); fixed to E = (V0/2)(1 + cos 3θ) and
  re-harvested (stag 0.00, ecl 12.55, anti 0.00, gauche 3.80, ecl 16.00).
- **Raw LaTeX in 11 sim readout equations fixed** (c2 chain steps, c4 additions/ozonolysis,
  c5 acidity/silver/hydration now render as unicode).
- **16 LaTeX-ish notations in prose fixed** (C_nH_{2n+2} → CₙH₂ₙ₊₂, C_xH_y → CₓHᵧ, pK_a → pKₐ,
  ΔH_hydrog → ΔH(hydrog), μ_cis → μ(cis), 2p_z → 2p(z), etc.); parsed-string audit is clean.

## Draft errors fixed against the PDF

- Spans/pages/formulas/worked/quizzes above; sims.js gained #preset-bar ids, preset-btn classes,
  a #lab-controls id for the c7 selects, plus the shared QA wrapper (data-preset), lab-readout
  bridge, prediction aliases, and connect-wow normalizer used by kech201/kech202.

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `c1` | Classification of Hydrocarbons, Alkanes & Conformations | 9.1, 9.2.1, 9.2.4 | 1–5 (pr. 295–299) | `conformationlab` (5 rotamers) | 3 |
| `c2` | Reactions of Alkanes & Free-Radical Halogenation Mechanism | 9.2.2, 9.2.3 | 6–10 (pr. 300–304) | `freeradicalsim` (5 chain steps) | 3 |
| `c3` | Alkenes: Structure, Nomenclature & Geometrical Isomerism | 9.3.1–9.3.3 | 12–14 (pr. 306–308) | `cistranslab` (3 alkenes) | 3 |
| `c4` | Electrophilic Addition to Alkenes: Markovnikov & Peroxide… | 9.3.4, 9.3.5 | 15–19 (pr. 309–313) | `markovnikovsim` (3 modes) | 3 |
| `c5` | Alkynes: Structure, Acidic Character & Addition Reactions | 9.4 | 20–23 (pr. 314–317) | `alkynelab` (3 tests) | 3 |
| `c6` | Aromatic Hydrocarbons: Benzene Structure, Resonance & Hückel | 9.5.1–9.5.4 | 24–27 (pr. 318–321) | `aromaticitytester` (6 rings) | 3 |
| `c7` | Electrophilic Aromatic Substitution (EAS) & Directive Influence | 9.5.5, 9.5.6, 9.6 | 28–31 (pr. 322–325) | `easmechanism` (reaction × substituent) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 25 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **9.1 – 9.4** | Ethane termination, IUPAC names ×7, C₄H₈/C₅H₈ isomers, ozonolysis products | ✅ Complete | Source-wording + name-statement checks |
| **9.5 – 9.9** | Ozonolysis deduction ×3, combustion equations, cis/trans hex-2-ene | ✅ Complete | Carbon counts + atom-balance recomputation |
| **9.10 – 9.17** | Benzene stability, aromaticity rules, non-aromatic systems, EAS synthesis, C degrees, branching bp, peroxide mechanism, o-xylene/Kekulé | ✅ Complete | Source-wording + mechanism-statement checks |
| **9.18 – 9.25** | Acidity order, EAS vs nucleophilic, benzene preparations, alkene→alkane set, EAS reactivity orders, nitration ease, Lewis acid, Wurtz odd-C | ✅ Complete | Source-wording + order-statement checks |

**Total Exercises:** 25 / 25 (100% verified coverage, 314 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech203` (235.0 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
