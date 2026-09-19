# NCERT Coverage Audit: Class 11 Physics Chapter 11 (keph204)

**Textbook:** NCERT Class 11 Physics Part II, Chapter 11: *Thermodynamics*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Physics-Pt2_keph204.pdf` (18 pdf pages, printed pp. 226–243)
**SHA-256:** `00462650d55bda8843f5fbf4eba1a7996faf13d04a8858fa04061b1309e090ba` (fixture in `tests/verify.cjs`)
**Extraction Engine:** PyMuPDF plain-text read
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 429 checks pass (source-PDF hash + byte-count fixture, packaging, lesson schema,
  20 browser fixtures, 8 exercises with exact pages + draft-vs-PDF source-wording checks, all 8
  NCERT answers recomputed (geyser rate, N₂ heat, adiabatic factor, two-path work, power ledger,
  D–E–F area) plus boiling-water and Carnot spot values, worked examples, and 8 video wire-ups).
- `browser_qa.cjs`: 146 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 20 lab scenarios).
- Videos: self-researched (no agy delivery yet): 8 candidates, each oEmbed-verified 200 OK with
  exact title/channel match; results in work/class11-physics-videos/results/keph204.json with an
  additive lessons.json entry; `verify_videos.py keph204` passes 8/8. All 8 wow cards wire the
  first candidates; `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the leph201 standard (physics slug lesson ids kept): top-level
  code/title/book/edition/source/page span, connect pairs → 3 objects (1 wow + links + video),
  worked strings/dicts → titled objects with given/steps/answer, recall strings → 3-lists,
  quick 2 → 3, exercises +q/title/given/conceptName/takeaway, exerciseMap/exercisesNote,
  authored group/watch. No revision_summary (neither physics reference has one);
  extraction/provenance keys kept.

## Honest fixes (verified against the PDF, not silently patched)

- **Q11.8's text cites Fig. (11.13) but the labelled P–V figure is 11.11**: the exercise
  keeps the Fig. 11.11 read with D/E/F coordinates vector-verified from the PDF drawings,
  and the takeaway records the text's (11.13) label.
- **page_start/end corrected 226/243 → 1/18** (PDF pages, leph201 convention); chapterNumber → '11'.
- **sims.js gained the shared QA-compat blocks**: data-preset shim, prediction
  is-answer/is-wrong aliases, watch-text + wow normalizer (native mount/draw protocol untouched).

## Draft errors fixed against the PDF

- Lesson spans verified correct as drafted ([1,3]…[12,14]); 6 lessons gained a third quick
  bullet, all 8 lessons gained given-carrying worked objects and 3-item recall lists, and
  the 3 given-less exercises (11.3, 11.6, 11.7) gained givens. The dimensionless Ex 11.4
  quiz now carries unit "×".

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `thermal-eq-zeroth` | If A and B each match C, they match each other… | 11.1–11.3 | 1–3 (pr. 226–228) | `zeroth` (3 walls) | 3 |
| `heat-u-work` | U is a state; heat and work are two ways of… | 11.4 | 4–5 (pr. 229–230) | `heatwork` (3 modes) | 3 |
| `first-law` | ΔQ = ΔU + ΔW is energy conservation with the… | 11.5 | 5–6 (pr. 230–231) | `firstlaw` (3 ledgers) | 3 |
| `specific-heat` | Heat capacity depends on the process: Cp − Cv… | 11.6 | 6–7 (pr. 231–232) | `cpcv` (2 pistons) | 3 |
| `state-vars-quasi` | Equilibrium states live on a P–V–T surface… | 11.7–11.8.1 | 8–9 (pr. 233–234) | `quasistatic` (2 runs) | 3 |
| `pv-processes` | Four named paths on the P–V plane — and the… | 11.8.2–11.8.6 | 9–11 (pr. 234–236) | `pvdiag` (3 curves) | 3 |
| `second-law-rev` | The First Law allows a 100 % heat engine; the… | 11.9–11.10 | 11–12 (pr. 236–237) | `secondlaw` (2 bans) | 3 |
| `carnot` | Two isotherms and two adiabats: η = 1 − T₂/T₁… | 11.11 | 12–14 (pr. 237–239) | `carnot` (3 engines) | 3 |

**Totals:** 8 core pedagogical concepts, 24 multi-tier practice questions, 8 interactive labs (20 scenarios).

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 8 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **11.1 – 11.3** | Geyser fuel rate, N₂ heat at constant p, mean-T/coolant/tyre/harbour explainers | ✅ Complete | Full arithmetic recomputation |
| **11.4 – 11.6** | Adiabatic compression factor, two-path first law, free expansion | ✅ Complete | Full arithmetic recomputation |
| **11.7 – 11.8** | Heater power ledger, D–E–F work from Fig. 11.11 | ✅ Complete | Full arithmetic recomputation |

**Total Exercises:** 8 / 8 (100% verified coverage, 24 solution steps).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py keph204` (147.6 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
