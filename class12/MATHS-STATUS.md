# Class 12 Mathematics status

**Last updated:** 2026-09-11  
**Current track:** Mathematics · all 13 NCERT chapters  
**Current state:** Uniform Lumen rebuild complete; per-chapter tests and browser QA green; subject review next

## Build evidence

- Source extraction uses PyMuPDF (pymupdf) page text, dict spans, blocks, and selected PNG renders. pdftotext was not used.
- All 13 chapters rebuilt with the shared compiler (`scripts/build_chapter.py`) on the uniform Lumen app/styles; the old maths-specific shell is retired.
- One tailored lab per lesson (`sims.js`), stable `data-preset` ids, validated offline and in browser QA.
- 742 NCERT exercises normalized to the physics schema (`given`/`steps`/`answer`/`takeaway`/`conceptName` + `exerciseMap`; print offsets proved in tests).
- 180 quizzes (Easy/Medium/Hard per lesson), 37 redrawn exercise figures (`figures.js`), 60 wow videos — all oEmbed-verified (HTTP 200 + exact title/channel).
- Per-chapter `tests/verify.cjs` + `tests/expect.json`; course runner `tests/verify-class12-maths.cjs` → **13/13 PASS**.
- Browser QA (`scripts/chapter_tools/browser_qa.cjs`) on all 13: **1,647 checks, 0 failures, 0 console errors**.

| Code | Chapter | PDF pages | Lessons | Exercises | Quizzes | Labs | Figures | Videos | State |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| lemh101 | Relations and Functions | 17 | 4 | 35 | 12 | 4 | 0 | 4 | complete; uniform build + tests |
| lemh102 | Inverse Trigonometric Functions | 16 | 4 | 43 | 12 | 4 | 0 | 4 | complete; uniform build + tests |
| lemh103 | Matrices | 42 | 5 | 56 | 15 | 5 | 0 | 5 | complete; uniform build + tests |
| lemh104 | Determinants | 28 | 5 | 61 | 15 | 5 | 0 | 5 | complete; uniform build + tests |
| lemh105 | Continuity and Differentiability | 43 | 5 | 137 | 15 | 5 | 0 | 5 | complete; uniform build + tests |
| lemh106 | Application of Derivatives | 40 | 5 | 82 | 15 | 5 | 6 | 5 | complete; uniform build + tests |
| lemh201 | Integrals | 67 | 5 | 51 | 15 | 5 | 0 | 5 | complete; uniform build + tests |
| lemh202 | Application of Integrals | 8 | 4 | 9 | 12 | 4 | 9 | 4 | complete; uniform build + tests |
| lemh203 | Differential Equations | 38 | 5 | 98 | 15 | 5 | 2 | 5 | complete; uniform build + tests |
| lemh204 | Vector Algebra | 39 | 5 | 73 | 15 | 5 | 2 | 5 | complete; uniform build + tests |
| lemh205 | Three Dimensional Geometry | 17 | 4 | 25 | 12 | 4 | 7 | 4 | complete; uniform build + tests |
| lemh206 | Linear Programming | 12 | 4 | 10 | 12 | 4 | 10 | 4 | complete; uniform build + tests |
| lemh207 | Probability | 33 | 5 | 62 | 15 | 5 | 1 | 5 | complete; uniform build + tests |
| **Total** | 13 chapters | | **60** | **742** | **180** | **60** | **37** | **60** | |

## Review next

Check equations, signs, domains, and source page references against the selected PNG renders. Test keyboard input, reduced motion, and 360px, 768px, 1280px, and 1440px layouts.

See MATHS-SOURCE-MANIFEST.md and each chapter PLAN.md for the source and review trail.
