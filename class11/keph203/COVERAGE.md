# NCERT Coverage Audit: Class 11 Physics Chapter 10 (keph203)

**Textbook:** NCERT Class 11 Physics Part II, Chapter 10: *Thermal Properties of Matter*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Physics-Pt2_keph203.pdf` (24 pdf pages, printed pp. 202–225)
**SHA-256:** `b062894aea80298f8df2f83e34dc11f5f96577bfe08d0ad35e2e647a8446854e` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF plain-text read
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 515 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  19 browser fixtures, 20 exercises with exact pages + draft-vs-PDF source-wording checks, all 20
  NCERT answers recomputed (scales, thermometry, expansion, calorimetry, conduction, cooling),
  worked examples, and 8 video wire-ups).
- `browser_qa.cjs`: 143 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 19 lab scenarios).
- Videos: self-researched (no agy delivery yet): 8 candidates, each oEmbed-verified 200 OK with
  exact title/channel match; results in work/class11-physics-videos/results/keph203.json with an
  additive lessons.json entry; `verify_videos.py keph203` passes 8/8. All 8 wow cards wire the
  first candidates; `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the leph201 standard (physics slug lesson ids kept): top-level
  code/title/book/edition/source/page span, connect pairs → 3 objects (1 wow + links + video),
  worked strings/dicts → titled objects with given/steps/answer, recall strings → 3-lists,
  quick 2 → 3, exercises +q/title/given/conceptName/takeaway, exerciseMap/exercisesNote,
  authored group/watch. No revision_summary (neither physics reference has one);
  extraction/provenance keys kept.

## Honest fixes (verified against the PDF, not silently patched)

- **Q10.20 uses the integrated (log) form**: 10 min, with the draft's own note that the
  average-rate shortcut's ~9 min is the wrong tool for a 30 °C drop.
- **Q10.4(d) identified as the Rankine triple point** 491.69 °R (steps show the 9/5 factor).
- **Radiation sim presets were textually identical** (mode flag never used in draw): readout
  now shows the law (Wien λ_mT vs Stefan eσAT⁴) and the verdict branches per preset.
- **page_start/end corrected 202/225 → 1/24** (PDF pages, leph201 convention); chapterNumber → '10'.
- **sims.js gained the shared QA-compat blocks**: data-preset shim, prediction
  is-answer/is-wrong aliases, watch-text + wow normalizer (native mount/draw protocol untouched).

## Draft errors fixed against the PDF

- Lesson spans verified correct as drafted ([1,2]…[18,20]); all 8 lesson `given` fields and
  all 20 exercise givens authored (none existed).

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `temp-heat` | Heat is energy in transit because of a temperature… | 10.1–10.3 | 1–2 (pr. 202–203) | `scales` (2 converters) | 3 |
| `ideal-gas-abs` | PV = μRT, and the zero of kelvin is −273.15 °C. | 10.4 | 2–3 (pr. 203–204) | `scales` (2 converters) | 3 |
| `thermal-expansion` | Δℓ/ℓ = αΔT, α_V = 3α, and rails will buckle… | 10.5 | 4–6 (pr. 205–207) | `expansion` (3 demos) | 3 |
| `calorimetry` | s = ΔQ/mΔT; water's 4186 J/kg/K is why… | 10.6–10.7 | 7–9 (pr. 208–210) | `calorimetry` (3 mixes) | 3 |
| `change-of-state` | Temperature holds still while ice melts or water… | 10.8 | 9–13 (pr. 210–214) | `calorimetry` (3 mixes) | 3 |
| `conduction` | H = KAΔT/L in the steady state — steel vs copper… | 10.9.1 | 13–16 (pr. 214–217) | `conduction` (2 slabs) | 3 |
| `convection-radiation` | Fluids carry heat by flowing; vacuum still radiates… | 10.9.2–10.9.4 | 16–18 (pr. 217–219) | `radiation` (2 laws) | 3 |
| `newton-cooling` | −dQ/dt ∝ (T − T_s) for small excess… | 10.10 | 18–20 (pr. 219–221) | `cooling` (2 cools) | 3 |

**Totals:** 8 core pedagogical concepts, 24 multi-tier practice questions, 6 interactive labs (19 scenarios).

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 20 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **10.1 – 10.5** | Triple-point scales, scale relation, resistance thermometer, fixed points, gas thermometers | ✅ Complete | Full arithmetic recomputation |
| **10.6 – 10.11** | Hot tape, shrink fit, hole growth, clamped tension, composite bar, density change | ✅ Complete | Full arithmetic recomputation |
| **10.12 – 10.16** | Drill heating, ice melt, calorimeter s, molar heats, sweat rate | ✅ Complete | Full arithmetic recomputation |
| **10.17 – 10.20** | Icebox survivor, boiler temperature, 5-principle explainers, Newton cooling | ✅ Complete | Arithmetic + principle checks |

**Total Exercises:** 20 / 20 (100% verified coverage, 63 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py keph203` (145.2 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
