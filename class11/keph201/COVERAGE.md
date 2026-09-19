# NCERT Coverage Audit: Class 11 Physics Chapter 8 (keph201)

**Textbook:** NCERT Class 11 Physics Part II, Chapter 8: *Mechanical Properties of Solids*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Physics-Pt2_keph201.pdf` (13 pdf pages, printed pp. 167–179)
**SHA-256:** `54ef32e2d3eb1e47e87f9d8e6a49423b8b2cc77e4ac5efbc7c34670c49462de6` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF plain-text read
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 446 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  19 browser fixtures, 16 exercises with exact pages + draft-vs-PDF source-wording checks, all 16
  NCERT answers recomputed (Q8.1 ratio, Q8.2 slope, Q8.5–8.16 full arithmetic), worked examples,
  and 7 video wire-ups).
- `browser_qa.cjs`: 138 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 19 lab scenarios).
- Videos: self-researched in parallel (agy-imported was asked for 202–204 after 201 landed here):
  7 candidates, each oEmbed-verified 200 OK with exact title/channel match; results written to
  work/class11-physics-videos/results/keph201.json with an additive lessons.json entry;
  `verify_videos.py keph201` passes 7/7. All 7 wow cards wire the first candidates;
  `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the leph201 standard (physics slug lesson ids kept): top-level
  code/title/book/edition/source/page span, connect pairs → 3 objects (1 wow + links + video),
  worked strings/dicts → titled objects with given/steps/answer, recall strings → 3-lists,
  quick 2 → 3, quizzes already leveled, exercises +q/title/conceptName/takeaway,
  exerciseMap/exercisesNote, authored group/watch. No revision_summary (neither physics
  reference has one); extraction/provenance keys kept.

## Honest fixes (verified against the PDF, not silently patched)

- **Q8.12 uses |ΔV| = 0.5 L via an explicit step-0 note**: the book prints final volume 100.5 L
  (above the initial 100.0 L) — expansion under a pressure increase is unphysical, so only the
  0.5 L magnitude enters B = 2.03×10⁹ Pa.
- **Figure-read values transcribed into steps**: 8.2 (Fig. 8.9: OA through ≈ (0.002, 150 MPa)),
  8.3 (Fig. 8.10 same-scale comparison), 8.5 (Fig. 8.11: steel carries 10 kg, brass 6 kg).
- **Stray fragment after 8.16** ("carry one quarter of the load.") is not a question — excluded.
- **Book cross-refs "Table 9.x / Eq. (9.x)" read as 8.x** (edition-renumbering leftovers);
  Table 8.1 values used (steel 200, Cu 110, Al 70, Fe 190, brass 91 GPa) confirmed in-lesson.
- **page_start/end corrected 167/179 → 1/13** (PDF pages, leph201 convention); chapterNumber
  int 8 → '08' (zero-padded string convention).
- **sims.js gained the shared QA-compat blocks** the minimal draft lacked: data-preset shim,
  prediction is-answer/is-wrong aliases, watch-text + wow normalizer (copied from the proven
  kech/keph pattern; native mount/draw protocol untouched).

## Draft errors fixed against the PDF

- Lesson spans verified correct as drafted ([1,1]…[8,10]); L4 worked given corrected to its
  actual problem (Example 8.2 composite wire, d = 3.0 mm); 3 missing exercise givens authored
  (8.2–8.4); L6 worked expanded to 3 steps.

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `elasticity-intro` | Elastic Behaviour of Solids: Spring, Clay and Rail | 8.1 | 1 (pr. 167) | `stressstrain` (3 curves) | 3 |
| `stress-strain` | Stress and Strain: Four Loads, Three Strains | 8.2 | 2–3 (pr. 168–169) | `stresskinds` (3 kinds) | 3 |
| `hooke-curve` | Hooke's Law and the Metal Curve to Fracture | 8.3–8.4 | 3–4 (pr. 169–170) | `stressstrain` (3 curves) | 3 |
| `young-modulus` | Young's Modulus: The Stiffness Ledger | 8.5.1 | 4–6 (pr. 170–172) | `youngmod` (4 metals) | 3 |
| `shear-modulus` | Shear Modulus: Stiffness Against Shape Change | 8.5.2 | 6 (pr. 172) | `shearslab` (Ex 8.4) | 3 |
| `bulk-poisson-energy` | Bulk Modulus, Poisson's Ratio, Elastic Energy | 8.5.3–8.5.5 | 7–8 (pr. 173–174) | `bulkmod` (2 depths) | 3 |
| `applications` | Beams, Pillars, Cranes: Elasticity in Structures | 8.6 | 8–10 (pr. 174–176) | `ibeam` (3 sections) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 6 interactive labs (19 scenarios).

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 16 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **8.1 – 8.4** | Y ratio, curve slope + yield, curve comparison, true/false | ✅ Complete | Ratio/slope recomputation + figure reads |
| **8.5 – 8.11** | Composite wire, shear slide, pillar strain, strip strain, rope force, wire ratio, whirling stretch | ✅ Complete | Full arithmetic recomputation |
| **8.12 – 8.16** | Bulk modulus + air ratio, ocean density, glass compression, copper shrinkage, water squeeze | ✅ Complete | Full arithmetic recomputation |

**Total Exercises:** 16 / 16 (100% verified coverage, 45 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py keph201` (135.0 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
