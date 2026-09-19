# NCERT Coverage Audit: Class 11 Chemistry Chapter 3 (kech103)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 3: *Classification of Elements and Periodicity in Properties*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt1_kech103.pdf` (26 pdf pages, printed pp. 74–99)
**SHA-256:** `da5705495086b2123103e471404177a841054adf2422e166a9826949649f8447` (in `output/Class11/SOURCE-MANIFEST-CHEMISTRY.json`)
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 639 checks pass (source-PDF hash fixture, packaging, lesson schema, 21 browser
  fixtures, 40 exercises with exact pages + source-wording checks, every quantitative answer recomputed
  from the book's givens, worked-example values, 7 video wire-ups).
- `browser_qa.cjs`: 151 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 21 lab scenarios).
- Videos: 7/7 wow cards wire the results file's oEmbed-verified first candidates
  (work/class11-chemistry-videos/results/kech103.json), each re-verified 200 OK with exact id/title/channel;
  `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  concepts→lessons, connect pairs→3 objects (1 wow + links + video), worked strings→objects,
  group/watch, quizzes level/type/solution/wrong, exercises q/title/given/steps/answer/takeaway/
  conceptIdx/conceptName/page/printPage (+73 offset), exerciseMap/exercisesNote.

## Honest fixes (verified against the PDF, not silently patched)

- **Q3.32** as drafted asked about Silicon/bromine and Element 120 — pairs that do not appear in the book.
  Rewritten to the PDF's actual six pairs (Li/O, Mg/N, Al/I, Si/O, P/F, Element 71/Lu/F) with full solutions.
- **Q3.31** as drafted omitted part (f) on the covalent MX halide; restored with element I (Lithium) and
  the Fajans-rule justification.
- **Q3.40** follows the NCERT key (b) F > O > Cl > N (confirmed against 8 published solution keys); the steps
  note honestly that aqueous standard potentials would rank Cl₂ above O₂ (a different criterion).
- **Al first IE** normalized to 577 kJ/mol everywhere to match the PDF's Ex 3.19 table (was 578 in two spots).
- No print errata needed handling: the known 1922-Pauling-year quirk is dodged because the chapter never
  claims a year, and all quoted table values (EG, IE, radii, triads, Eka predictions) match the PDF exactly.

## Draft errors fixed against the PDF

- Q3.32 pairs rewritten; Q3.31(f) restored; Q3.40 approach de-contradicted (it cited E° values that
  undermined its own conclusion); Al 577 normalization; two unclosed `$` spans in Q3.15's solution that left
  raw `\Delta` outside any math span; E° carets (`E^°`) cleaned; lesson page spans corrected to true section
  locations (were placeholder 1–4/4–8 style spans); sims.js gained `draw` aliases, the zero-arg data-preset
  shim, prediction-marking aliases and presentation normalization (dead App.updateSim/mountSim tail removed).

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `genesis-periodic-table` | Genesis: Triads, Octaves & Mendeleev's Table | 3.1, 3.2 | 1–4 (pr. 74–77) | `mendeleev` (Eka predictions & triads) | 3 |
| `modern-periodic-law` | Moseley's Law, Modern Table & IUPAC Names | 3.3, 3.4 | 5–7 (pr. 78–80) | `moseleylab` (X-ray √ν vs Z plot) | 3 |
| `periodic-blocks` | s/p/d/f Blocks & Configurations | 3.5, 3.6 | 8–11 (pr. 81–84) | `blockexplorer` (Block architecture) | 3 |
| `atomic-ionic-radii` | Atomic & Ionic Radii, Isoelectronic Series | 3.7(a–b) | 12–14 (pr. 85–87) | `radiitrends` (Radii comparator) | 3 |
| `ionization-enthalpy` | Ionization Enthalpy & Its Anomalies | 3.7(c) | 14–16 (pr. 87–89) | `ionizationlab` (Be–B & N–O probes) | 3 |
| `electron-affinity` | Electron Gain & Electronegativity | 3.7(d–e) | 16–19 (pr. 89–92) | `electronaffinity` (Cl–F & S–O pairs) | 3 |
| `periodic-valency` | Valency, Anomalies & Diagonal Relations | 3.7.2–3.7.3 | 19–22 (pr. 92–95) | `diagonalrel` (Diagonal pairs & ceiling) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 40 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **3.1 – 3.3** | Organisation theme, Mendeleev's property, Mendeleev vs Modern law | ✅ Complete | Source-wording + answer-statement checks |
| **3.4 – 3.8** | Period-6 capacity (32), locating Z=114, Z in P3/G17, Berkeley/Seaborg names, group similarity | ✅ Complete | Orbital-count, config-sum & name checks |
| **3.9 – 3.13** | Radii meaning & variation, isoelectronic examples, 10-electron series order, cation/anion size | ✅ Complete | Electron-count & Z-ordering checks |
| **3.14 – 3.19** | IE definitions, H ionization energy, Be–B/N–O anomalies, Na/Mg, group factors, Group-13 deviation | ✅ Complete | Recomputed 1312.8 kJ/mol; subshell checks |
| **3.20 – 3.25** | EG pairs (O/F, F/Cl), second EG of O, EG vs EN, N EN variability, radius theory, isotopes | ✅ Complete | Sign/value checks (−349/−328/+780) |
| **3.26 – 3.32** | Metals/non-metals, table reading, Group 1/17 reactivity, block configs, positions, enthalpy fingerprints, binary formulas | ✅ Complete | Config/group arithmetic; element-ID checks |
| **3.33 – 3.40** | 8 MCQs: period=n, d-block columns, valence factors, isoelectronic size, IE statements, metallic/non-metallic/oxidizing orders | ✅ Complete | Key checks: c, b, c, a, d, d, c, b |

**Total Exercises:** 40 / 40 (100% verified coverage).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech103` (231.1 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
