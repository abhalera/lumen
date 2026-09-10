# Class 12 Biology status

**Implementation state:** complete for all 13 NCERT Biology chapters
**Source method:** PyMuPDF 1.28.2 text layer (`scripts/dump_bio_text.py`; full dumps in `/tmp/opencode/bio_text/`, maps in `/tmp/opencode/bio_maps.json`). `pdftotext` was not used. Disk was nearly full (1.7G free), so no PNG zooms were rendered — equations/figures were verified against the text layer.
**Source coverage:** 228 PDF pages and 179 mapped exercise entries
**Review state:** ready for human source-fidelity and classroom review

Each chapter has a standalone index.html, source-linked Learn blocks, a chapter-specific Play simulation, Connect examples, formative Practice questions with hints and solutions, a Revise block, a chapter plan (COVERAGE.md), and authoring scripts in `scripts/class12-bio/generate_lebo*.py`.

| Code | Chapter | Lessons | Practice Qs | Exercises | State |
|---|---|---:|---:|---:|---|
| lebo101 | Sexual Reproduction in Flowering Plants | 7 | 21 | 18 | complete |
| lebo102 | Human Reproduction | 7 | 21 | 21 | complete |
| lebo103 | Reproductive Health | 5 | 15 | 12 | complete |
| lebo104 | Principles of Inheritance and Variation | 8 | 24 | 16 | complete |
| lebo105 | Molecular Basis of Inheritance | 8 | 24 | 14 | complete |
| lebo106 | Evolution | 6 | 18 | 10 | complete |
| lebo107 | Human Health and Disease | 7 | 21 | 17 | complete |
| lebo108 | Microbes in Human Welfare | 6 | 18 | 15 | complete |
| lebo109 | Biotechnology: Principles and Processes | 6 | 18 | 12 | complete |
| lebo110 | Biotechnology and Its Applications | 5 | 15 | 13 | complete |
| lebo111 | Organisms and Populations | 6 | 18 | 10 | complete |
| lebo112 | Ecosystem | 5 | 15 | 11 | complete |
| lebo113 | Biodiversity and Conservation | 5 | 15 | 10 | complete |

## Totals

13/13 live · 81 lessons · 243 practice Qs · 179 mapped exercises.
Course: `node tests/verify-class12-biology.cjs` PASS.

## Compiler

`python3 scripts/class12-bio/build_chapter.py all`
Schema: `scripts/class12-bio/CHAPTER-SCHEMA.md`

## Honest edition notes (see each `COVERAGE.md`)

- lebo101: §1.4.1 heading prints before the §1.3 text in the body; TOC order 1.3→1.4 retained.
- lebo102: spermatogenesis/oogenesis are unnumbered under §2.3; diagram Qs answered descriptively (no image upload).
- lebo103: §3.2 in-text heading is "Population Stabilisation and Birth Control" (TOC says "Explosion"); §3.4 in-text is "Infections" (TOC says "Diseases").
- lebo104: in-text numbering (§4.1–4.8) differs from the compressed TOC (§4.1–4.6); TOC-vs-text mapping recorded.
- lebo105: Q1 prints as a bare "1" without trailing dot; counted explicitly.
- lebo108: §8.2 is split into 8.2.1–8.2.3 in-text vs a single TOC entry.
- lebo109: §9.3.4 heading splits across lines on print p.173 (line-start surveys miss it); passage present and covered.
- lebo110: exercises span pp 10–11 with the SUMMARY box sitting mid-exercise.
- lebo111: §11.1 is the sole top-level section; Table 11.1 (+/−/0) is prime sim data.
- lebo112: TOC prints "12.2." with a trailing dot; Ex Q1 spans pp 10–11.
- lebo113: §13.1.1 heading line-wraps across pages; exercises span pp 11–12.

## Pending (not claimed)

Real-browser matrix, screen-reader pass, teacher/learner tryout, Wow-video facades (none added — click-to-play YouTube requires oEmbed-verified IDs; omitted rather than invented).
