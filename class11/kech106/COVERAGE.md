# NCERT Coverage Audit: Class 11 Chemistry Chapter 6 (kech106)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 6: *Equilibrium*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt1_kech106.pdf` (53 pdf pages, printed pp. 168–214 + log tables)
**SHA-256:** `28807c54d2ddf10aed0fcf4d58aff66099cee25f33a8e36aad7106505dfb1bc1` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF (span dictionary + 2.5× PNG zoom proofs, no pdftotext)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 950 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  23 browser fixtures, 73 exercises with exact pages + draft-vs-PDF source-wording checks, every
  quantitative answer recomputed from the book's givens — Kc/Kp conversions, ICE tables, Q direction,
  ΔG°/K, pH/pKa/Ka/Kb, hydrolysis, buffers, Ksp solubilities — plus worked-example values and
  7 video wire-ups).
- `browser_qa.cjs`: 166 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 23 lab scenarios).
- Videos: 7/7 wow cards wire the results file's oEmbed-verified first candidates
  (work/class11-chemistry-videos/results/kech106.json), each re-verified 200 OK with exact id/title/channel;
  `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  concepts→lessons, connect pairs→3 objects (1 wow + links + video), worked strings→objects,
  group/watch, quizzes level/type/solution/wrong, exercises q/title/given/steps/answer/takeaway/
  conceptIdx/conceptName/page/printPage (+167 offset), exerciseMap/exercisesNote.

## Honest fixes (verified against the PDF, not silently patched)

- **~30 draft exercises followed the OLD (pre-rationalization) edition** (wrong questions at those
  numbers) and were rewritten to the 2026-27 PDF with full solutions: 6.18(iii), 6.23 (Kc, not Kp),
  6.27 (equilibrium pressures), 6.31 (water-gas shift), 6.32–6.40, 6.43–6.49, 6.52–6.53, 6.63–6.69,
  6.71. Four more blocks moved to their true rationalized numbers (6.46→6.61 nitrous, 6.47→6.62
  pyridinium, 6.53→6.59 propanoic, 6.69→6.72 CaSO₄ volume).
- **Q6.23 asks for Kc** (rationalized change from Kp, confirmed by PDF text search): Kc = 0.152.
- **Q6.35 species list includes CO₃²⁻** (confirmed by 2.5× zoom crop); Q6.52 aniline Kb = 4.27×10⁻¹⁰
  and Q6.67's five Ksp values read from Tables 6.7/6.9 (table is a scanned image, read by zoom crop).
- **Sim constants fixed**: N₂O₄ dimerization Kc 6.8×10⁻³ → 215.5 (book gives dissociation 4.64×10⁻³);
  HF Ka 3.2→6.8×10⁻⁴ (Q6.43); acetic Ka 1.8→1.74×10⁻⁵ (Q6.46, matches buffer sim pKa 4.76);
  CaF₂ Ksp 4.14×10⁻¹¹ → 5.3×10⁻⁹ (Table 6.9; S = 1.10×10⁻³ M).
- **Lesson page spans corrected**: draft put concepts 5–6 inside the exercise pages (34–42, 42–47);
  true spans end at pdf p40 (exercises start p41).
- **Worked example 5** updated to the book's acetic Ka (1.74×10⁻⁵): α = 0.0187, pH = 3.03.
- Figure/table-dependent questions (6.52, 6.67) carry the table values in-statement, so no figure
  is required to follow the steps.

## Draft errors fixed against the PDF

- Old-edition rewrites above; one `$$…matrix…$$` ICE table rendered as an HTML table; two unclosed
  `<p>` tags closed; 7 stray `</p>` removed; bare `^`/`_` exponents converted to sup/sub tags;
  `√Kₐ/C` grouping notation fixed in 5 spots; 6 mislabeled exercise titles corrected;
  sims.js gained the zero-arg data-preset shim, prediction-marking aliases and presentation
  normalization (draw exports already present; no dead tail to remove).

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `physical-chemical-equilibrium` | Dynamic Equilibrium, Physical Equilibria & Law of Mass Action | 6.1, 6.2, 6.3 | 1–9 (pr. 168–176) | `dynamiceq` (rate equalization) | 3 |
| `kp-kc-relationship` | Relation between Kp and Kc, Reaction Quotient Qc & Heterogeneous Eq. | 6.4, 6.5, 6.6 | 10–16 (pr. 177–183) | `kpconverter` (Kp/Kc/Qc) | 3 |
| `le-chatelier-principle` | Le Chatelier's Principle: Disturbance, Shift & Response | 6.7, 6.8, 6.9 | 17–21 (pr. 184–188) | `lechatelier` (6 stress tests) | 3 |
| `acid-base-theories` | Acid-Base Theories (Arrhenius, Brønsted, Lewis) & Kw | 6.10, 6.11.1 | 21–27 (pr. 188–194) | `acidbasetheory` (pairs/adducts) | 3 |
| `ph-weak-acids-bases` | The pH Scale, Weak Acid/Base Ionization (Ka, Kb) & Ostwald | 6.11.2–6.11.8 | 26–34 (pr. 193–201) | `phweakacid` (Ostwald dilution) | 3 |
| `salt-hydrolysis-buffers` | Salt Hydrolysis, Buffer Solutions & Henderson-Hasselbalch | 6.11.9, 6.12 | 34–36 (pr. 201–203) | `buffersim` (HCl stress test) | 3 |
| `solubility-product-ksp` | Solubility Equilibria, Solubility Product (Ksp) & Common Ion | 6.13 | 37–40 (pr. 204–207) | `ksplab` (common-ion slider) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 73 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **6.1 – 6.7** | Vapor pressure, Kc/Kp computation, K expressions, reverse K, unit activity | ✅ Complete | Source-wording + recomputation (12.23, 2.67e4, 1.59e-15) |
| **6.8 – 6.15** | ICE composition, Kp/Kc conversion, Qc direction, equations from K | ✅ Complete | ICE ratios, Qc = 2379, Kc' = 1/54.8 |
| **6.16 – 6.24** | ICl/PCl₅/ester equilibria, FeO Kp, Boudouard Kc, ΔG°/K | ✅ Complete | p/RT conversions, Kc = 0.152, K = 1.36e6 |
| **6.25 – 6.34** | Le Chatelier shifts, HBr pressures, water-gas shift, K extent, O₃/CH₄ | ✅ Complete | Shift logic, 9.95/0.0249 bar, 3.04 bar, 2.86e-28 |
| **6.35 – 6.40** | Conjugate pairs, Lewis acids, amphiprotic species | ✅ Complete | Source-wording + pair-statement checks |
| **6.41 – 6.49** | pH scale, Ka/Kb, phenol, H₂S, acetic, strong acids/bases, weighed bases | ✅ Complete | Log/Ka/Kb recomputation (3.03, 6.30, 12.63…) |
| **6.50 – 6.58** | Bromoacetic, codeine, aniline, common ion, biofluids, KOH/Sr(OH)₂ | ✅ Complete | pKa 2.70, aniline pH 7.82, Sr pH 13.50 |
| **6.59 – 6.66** | Propanoic, HCNO, nitrite, pyridine, salts, chloroacetic, 310 K, mixtures | ✅ Complete | Hydrolysis, salt pH 7.93, neutral 6.78, 12.63/7.00/1.30 |
| **6.67 – 6.73** | Table-6.9 solubilities, Ag₂CrO₄/AgBr ratio, iodate, benzoate, FeS, CaSO₄, sulfides | ✅ Complete | S values, ratio 92.0, 3.32×, 2.44 L, Qsp 8.89e-22 |

**Total Exercises:** 73 / 73 (100% verified coverage, 300 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech106` (251.4 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
