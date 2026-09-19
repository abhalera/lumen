# NCERT Coverage Audit: Class 11 Chemistry Chapter 7 (kech201)

**Textbook:** NCERT Class 11 Chemistry Part II, Chapter 7: *Redox Reactions*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt2_kech201.pdf` (21 pdf pages, printed pp. 235–255)
**SHA-256:** `e80210c578356baacefe980fad8714b251affac3c7ef36b866a45469327c848a` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF (span dictionary + 2.5–4× PNG zoom proofs, no pdftotext)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 603 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  24 browser fixtures, 29 exercises with exact pages + draft-vs-PDF source-wording checks, every
  balanced equation rechecked atom-by-atom and charge-by-charge, limiting-reagent/NO mass,
  all five Q7.26 E° values, worked-example arithmetic, and 7 video wire-ups).
- `browser_qa.cjs`: 161 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 24 lab scenarios).
- Videos: fresh research (no kech201 entries existed): 14 candidates scraped from YouTube search,
  each oEmbed-verified 200 OK (one dead Khan link replaced after a 400, one empty-description
  candidate dropped); results written to work/class11-chemistry-videos/results/kech201.json with an
  additive lessons.json entry; `verify_videos.py kech201` passes 14/14. All 7 wow cards wire the
  first candidates; `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  connect string→3 objects (1 wow + links + video), quizzes tier/question/explanation→
  level/prompt/solution/type/wrong, exercises +given/takeaway/conceptName (+234 offset),
  exerciseMap/exercisesNote, authored recall/group/section/print/sim/watch.

## Honest fixes (verified against the PDF, not silently patched)

- **7.18 is deleted in the rationalized edition** (p20 jumps 7.17 → 7.19): dropped, numbering kept (29 exercises).
- **Q7.19(a) prints HPO₂⁻** (missing H subscript, confirmed by span-level read + 4× zoom): only the
  correct hypophosphite H₂PO₂⁻ balances (P₄ + 3OH⁻ + 3H₂O → PH₃ + 3H₂PO₂⁻), and it is used.
- **Q7.19(b) keeps the book's Cl⁻(g)** (confirmed by zoom crop); Q7.26 cites Table 8.1 (Table 7.1 here);
  Q7.2 "oxidation number" (singular), Q7.10 "is unstable compound", Q7.12 "count for",
  Q7.20 "informations" are book slips; the draft's corrected grammar is kept.
- **7.11 illustration 3 was unbalanced** ("S + 3 F₂ → SF₄"): fixed to S + 2 F₂ → SF₄.
- **Lesson page spans corrected**: draft put c6–c7 on the exercise pages (17–19, 19–21); true spans
  end at pdf p17 (exercises start p18). Two printPage off-by-ones fixed (7.9→252, 7.17→253).
- **All 21 quiz keys audited** against the verified text: correct as drafted (no key changes needed).
- Table-7.1-dependent questions carry the E° values in-statement, so no table lookup is required.

## Draft errors fixed against the PDF

- 7.18 drop; bare-LaTeX formula fields converted; bare `^`/`_`/`->`/`=>`/`*` chemistry notation
  converted to sup/sub/arrow/× tags (incl. charge fix Zn²⁺ and paren subs like (CN)₂);
  `√`-style grouping N/A; `delta G°` → ΔG°; sims.js gained the one-arg data-preset shim
  (zero-arg wrapper broke the runtime's mount.length protocol), #preset-bar ids, a lab-readout
  bridge (sims wipe the runtime's lab elements), and a #lab-controls id for the c7 selects.

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `c1` | Classical and Electronic Concepts of Oxidation and Reduction | 7.1, 7.2 | 1–4 (pr. 235–238) | `electrontransfer` (3 metal pairs) | 3 |
| `c2` | Oxidation Number: Rules, Calculation & Stock Notation | 7.3 | 5–7 (pr. 239–241) | `oxnumberlab` (7 fallacy traps) | 3 |
| `c3` | Types of Redox Reactions: Combination, Decomposition… | 7.3.1 | 8–11 (pr. 242–245) | `redoxtypes` (4 reaction types) | 3 |
| `c4` | Balancing Redox Equations: Oxidation Number & Ion-Electron | 7.3.2 | 12–14 (pr. 246–248) | `balancerlab` (stepped balancing) | 3 |
| `c5` | Redox Reactions as the Basis for Titrations: Indicators… | 7.3.3, 7.3.4 | 15 (pr. 249) | `redoxtitration` (permanganate/iodine) | 3 |
| `c6` | Electrochemical Cells & Electrode Potential: The Daniell Cell | 7.4 | 15–16 (pr. 249–250) | `daniellcell` (V_ext sweep) | 3 |
| `c7` | Electrochemical Series & Redox Feasibility | 7.4 | 16–17 (pr. 250–251) | `ecserieslab` (couple picker) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 29 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **7.1 – 7.7** | Oxidation numbers, fractional states, redox justification, HOF, fallacies, Stock names, C/N ranges | ✅ Complete | Source-wording + O.N. statement checks |
| **7.8 – 7.13** | Dual/oxidant-only agents, tracers, AgF₂, limiting states, observations, five role-labels | ✅ Complete | Source-wording + role-statement checks |
| **7.14 – 7.17** | Thiosulfate vs I₂/Br₂, F₂/HI extremes, perxenate, Ag⁺/Cu²⁺ inference | ✅ Complete | E° values + inference statements |
| **7.19 – 7.24** | Basic-medium balancing, cyanogen, Mn³⁺, Cs/Ne/I/F, Cl₂/SO₂, disproportionators | ✅ Complete | Atom/charge balance recomputation |
| **7.25 – 7.30** | Limiting reagent, Table-7.1 feasibility, electrolysis, displacement order, reactivity, Daniell cell | ✅ Complete | 15.00 g, E° arithmetic, series orders |

**Total Exercises:** 29 / 29 (100% verified coverage, 153 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech201` (235.1 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
