# COVERAGE — kemh104 Complex Numbers and Quadratic Equations

**Source:** `books/originals/Class11-Maths_kemh104.pdf` (13 pdf pages, printed pp. 76–88, Reprint 2026–27).
**SHA-256:** `a1c0708f4588b85d75254bd1825c4248598c1dc0da482056225d411d40a638e2`.
**Extraction:** PyMuPDF dict spans + 1.6× PNG zooms. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh104.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| intro-i | 4.1–4.2 | 1–2 | Complete; Example 1 stacked 3/4, 33/4 zoom p.2 |
| algebra | 4.3.1–4.3.4 | 2–4 | Complete; inverse stacked fraction zoom p.3 |
| powers-i | 4.3.5–4.3.6 | 4–5 | Complete; √a√b warning |
| binomial | 4.3.7 | 5–6 | Complete |
| modulus | 4.4 | 6–8 | Complete; Example 5 inverse zoom p.7 |
| argand | 4.5 | 8–10 | Complete as written; polar form **not in the body** |

## Exercises

- **Exercise 4.1** Q1–Q14 (pdf pp. 7–8), including inverses Q11–13 and the stacked-fraction quotient Q14, all zoom-verified on p.7–8.
- **Miscellaneous Exercise** Q1–Q14 (pdf pp. 10–11).

All 28 items mapped with independently computed answers (powers of i, cubes, moduli, m=4, zero non-zero-integral solutions, …).

## Edition note

The **printed title** is still “COMPLEX NUMBERS AND QUADRATIC EQUATIONS”.
§4.1 names D=b²−4ac<0 as the reason to enlarge R.
The body then runs **4.2 Complex Numbers, 4.3 Algebra (through 4.3.7 identities), 4.4 Modulus and conjugate, 4.5 Argand Plane and Polar Representation**.

Honest gaps in this 13-page PDF:
- **No quadratic-formula section** (no solving ax²+bx+c=0 for D<0, no square-root-of-a-complex-number algorithm beyond √(−a)=√a i).
- **§4.5’s polar representation is in the heading only.** After Fig 4.3 (conjugate as a mirror) the text jumps to Miscellaneous Examples. There is no z=r(cos θ+i sin θ), no argument, no Euler/De Moivre paragraph.

Not invented.

## Standard audit (kemh104)

- Read and audited all 13 PDF pages of `books/originals/Class11-Maths_kemh104.pdf`, printed pages 76–88 (offset +75), including the source exercise and miscellaneous answer stems.
- Added source fixtures for all 28 exercises with exact question, page, and answer fields; expanded each solution to auditable multi-step guidance and added lesson worked-example objects.
- Independent verifier: `node tests/verify.cjs` (source, mathematics, structure and packaging assertions).
- Browser QA: `NODE_PATH=... node scripts/chapter_tools/browser_qa.cjs output/Class11/kemh104` — 96 checks, 0 failures, 0 console errors.
- All six lessons include their assigned agy-imported oEmbed video metadata.
