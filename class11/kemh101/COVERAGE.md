# COVERAGE — kemh101 Sets

**Source:** `books/originals/Class11-Maths_kemh101.pdf` (23 pdf pages, printed pp. 1–23, Reprint 2026–27).
**SHA-256:** `5e0c0b629e68222bc31fd35d952c5e6b19db23d835cff3cf1c1b7b780e55f798` (see `output/Class11/MATHS-SOURCE-MANIFEST.md`).
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh101.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| sets-rep | 1.1–1.2 | 1–5 | Complete; Example 4 stacked fractions zoom-verified p.4 |
| empty-finite | 1.3–1.4 | 5–7 | Complete |
| equal-sets | 1.5 | 7–8 | Complete; Example 8 ALLOY/LOYAL |
| subsets-intervals | 1.6–1.7 | 9–12 | Complete; interval notation from Fig 1.1 / §1.6.2 |
| venn-ops | 1.8–1.9 | 13–17 | Complete; ∪ ∩ − , no n(A∪B) counting |
| complement | 1.10 | 18–20 | Complete; De Morgan Example 22 |
| set-algebra | Miscellaneous | 21–23 | Complete |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 1 | {1, −2} |
| 2 | {1,2,3,4,5,6} for x²<40 |
| 4 | {x : x=n/(n+1), 1≤n≤6} stacked, zoom p.4 |
| 6 | (i){1,2} finite; (iii) φ finite; (iv) primes infinite |
| 8 | ALLOY=LOYAL as letter-sets; {n∈Z:n²≤4}≠{1,2} |
| 12 / 15 | ∪={2,4,6,8,10,12}, ∩={6,8} |
| 18 | A−B={1,3,5}, B−A={8} |
| 22 | (A∪B)′={1,6}=A′∩B′ |
| 24 | 8 subsets of {−1,0,1} |

## Exercises

- **Exercise 1.1** Q1–Q6 (pdf pp. 4–5)
- **Exercise 1.2** Q1–Q6 (pdf pp. 8–9)
- **Exercise 1.3** Q1–Q8 (pdf pp. 12–13)
- **Exercise 1.4** Q1–Q12 (pdf pp. 17–18)
- **Exercise 1.5** Q1–Q7 (pdf p. 20)
- **Miscellaneous Exercise** Q1–Q10 (pdf pp. 21–22)

All 49 items mapped with verbatim stems (this reprint) and independently computed answers.

## Edition note

Sections in this 23-page PDF run **1.1–1.10** then Miscellaneous Examples / Exercise / Summary / Historical Note.
There is **no §1.11 Practical problems on union and intersection**, **no Exercise 1.6**, and **no three-set counting formula** n(A∪B∪C) in the body. Misc. Ex 10 still asks for a pairwise-overlap / empty-triple *witness*, which is not the counting formula. Not invented.

## 2026-09-19 independent standard audit

Corrected Ex1.3 Q2(vi): both 2 and 4 divide 36; corrected the circles-through-origin proof; corrected Ex1.3 Q4 and Misc Q8 starting pages; expanded solutions; added all four Ex1.5 Q5 diagrams and exact Venn-region masks.

All source pages were read via PyMuPDF dict spans; stacked expressions and diagrams were checked in rendered page images. Browser QA: 149 checks, 0 failures, 0 console errors (1280, 390, 768px). Required video research is pending; fixture/mathematics assertions currently pass up to the mandatory video assertion, so **this chapter is not yet complete**. Shared-runtime migration across all14 chapters: 113 lesson/revision routes, no page errors.
