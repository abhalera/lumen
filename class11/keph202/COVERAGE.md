# NCERT Coverage Audit: Class 11 Physics Chapter 9 (keph202)

**Textbook:** NCERT Class 11 Physics Part II, Chapter 9: *Mechanical Properties of Fluids*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Physics-Pt2_keph202.pdf` (22 pdf pages, printed pp. 180–201)
**SHA-256:** `3ff64c89dcbfaf99ecec307d753b0bd2d3f731f17e2f16875d74749840d223b6` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF plain-text read
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 463 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  17 browser fixtures, 20 exercises with exact pages + draft-vs-PDF source-wording checks, all
  numerical answers recomputed (Q9.5–9.10, Q9.13–9.14, Q9.16–9.20 incl. Reynolds laminar check),
  worked examples, and 7 video wire-ups).
- `browser_qa.cjs`: 128 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 17 lab scenarios).
- Videos: self-researched (agy-imported redirected to 203–204): 7 candidates, each oEmbed-verified
  200 OK with exact title/channel match; results in work/class11-physics-videos/results/keph202.json
  with an additive lessons.json entry; `verify_videos.py keph202` passes 7/7. All 7 wow cards wire
  the first candidates; `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the leph201 standard (physics slug lesson ids kept): top-level
  code/title/book/edition/source/page span, connect pairs → 3 objects (1 wow + links + video),
  worked strings/dicts → titled objects with given/steps/answer, recall strings → 3-lists,
  quick 2 → 3, exercises +q/title/given/conceptName/takeaway (no draft givens existed),
  exerciseMap/exercisesNote, authored group/watch. No revision_summary (neither physics
  reference has one); extraction/provenance keys kept.

## Honest fixes (verified against the PDF, not silently patched)

- **Stokes rain mode flagged Re ≫ 1**: the sim displayed v_t = 483 m/s for a 2 mm drop with no
  comment; the verdict now shows Re ≈ 1.3e+5 and states Stokes overestimates (real drops ≈ 6 m/s).
- **Book spellings kept verbatim**: "Toricelli's", "off-shore", "disolved".
- **Q9.15/Q9.18 figure readings stated in steps** (high-P-at-throat wrong; same 2Sl → same weight).
- **Q9.20's submerged bubble uses the soap solution's RD 1.20** (1.057×10⁵ Pa).
- **page_start/end corrected 180/201 → 1/22** (PDF pages, leph201 convention); chapterNumber → '09'.
- **sims.js gained the shared QA-compat blocks**: data-preset shim, prediction
  is-answer/is-wrong aliases, watch-text + wow normalizer (native mount/draw protocol untouched).

## Draft errors fixed against the PDF

- Lesson spans verified correct as drafted ([1,3]…[13,18]); hydraulic worked expanded to 3 steps
  (energy-honesty closer); all 20 exercise givens authored (none existed).

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `pressure` | Fluids flow; pressure is the normal force per unit area… | 9.1–9.2 | 1–3 (pr. 180–182) | `pressuredepth` (3 cases) | 3 |
| `pascal-depth` | P = P_a + ρgh — same height, same pressure… | 9.2.1–9.2.3 | 3–6 (pr. 182–185) | `pressuredepth` (3 cases) | 3 |
| `hydraulic` | A change in pressure is transmitted undiminished… | 9.2.4 | 6–7 (pr. 185–186) | `pascal` (2 machines) | 3 |
| `streamline` | Steady flow draws a stationary map; Av = constant… | 9.3 | 7–8 (pr. 186–187) | `continuity` (pipe) | 3 |
| `bernoulli` | P + ½ρv² + ρgh = constant along a streamline. | 9.4 | 8–11 (pr. 187–190) | `bernoulli` (3 demos) | 3 |
| `viscosity-stokes` | η = shear stress / strain rate; F = 6πηav… | 9.5 | 11–13 (pr. 190–192) | `stokes` (2 falls) | 3 |
| `surface-tension` | S is energy per area and force per length… | 9.6 | 13–18 (pr. 192–197) | `capillary` (3 tubes) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 6 interactive labs (17 scenarios).

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 20 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **9.1 – 9.4** | Blood pressure/atmosphere/scalar, wetting, fill-in-blanks, Bernoulli daily life | ✅ Complete | Source-wording + statement checks |
| **9.5 – 9.10** | Heel pressure, wine barometer, off-shore check, lift pressure, U-tube, Hg levels | ✅ Complete | Full arithmetic recomputation |
| **9.11 – 9.16** | Rapids, gauge vs absolute, Poiseuille + Re, wing lift, figure check, spray pump | ✅ Complete | Arithmetic + principle checks |
| **9.17 – 9.20** | Soap-film S, three-frame weights, mercury drop, soap + submerged bubbles | ✅ Complete | Full arithmetic recomputation |

**Total Exercises:** 20 / 20 (100% verified coverage, 58 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py keph202` (135.8 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
