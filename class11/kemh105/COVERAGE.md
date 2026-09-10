# COVERAGE — kemh105 Linear Inequalities

**Source:** `books/originals/Class11-Maths_kemh105.pdf` (11 pdf pages, printed pp. 89–99, Reprint 2026–27).  
**SHA-256:** `fb49d11c1f59ca25c9b0a9489cf808fe25ecd871aabf07a3c7142c9e896bd3d1` (in `output/Class11/MATHS-SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kemh105.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| intro-inequalities | 5.1–5.2 | 1–2 | Complete; Ravi 30x&lt;200, Reshma 40x+20y≤120 |
| types-linear | 5.2 (5)–(14) | 2 | Complete; strict/slack, 1-var/2-var, quadratic named and dropped |
| solution-rules | 5.3 Rules 1–2 | 3–4 | Complete; reverse on negative multiplier; 3&gt;2 vs −3&lt;−2 |
| algebra-onevar | Examples 1–4 | 4–5 | Complete; Example 4 fraction zoom-verified p.5 |
| numberline | Examples 5–6, Figs 5.1–5.2 | 5–6 | Complete; open vs dark circle |
| word-problems | Examples 7–8, Ex 5.1 Q21–26 | 6–8 | Complete; x≥70; four odd pairs |
| double-systems | Examples 9–11, Fig 5.3 | 8–9 | Complete; −11/3 ≤ x ≤ 5; 2≤x&lt;6 |
| applications | Examples 12–13, Misc 11–14 | 9–11 | Complete; 86&lt;F&lt;95; 120&lt;x&lt;300; IQ 9.6–16.8 |

## Worked examples (all zoom-verified)

| Item | Result |
|---|---|
| Ex 1 | 30x&lt;200 ⇒ x&lt;20/3; ℕ: {1..6}; ℤ: {…,6} |
| Ex 2 | x&lt;2; integers {…,1}; reals (−∞,2) |
| Ex 3 | x&gt;−2; (−2,∞) |
| Ex 4 | (5−2x)/3 ≤ x/6 − 5 ⇒ x≥8; [8,∞) |
| Ex 5 / Fig 5.1 | x&lt;3, open circle |
| Ex 6 / Fig 5.2 | x≥1, dark circle |
| Ex 7 | x≥70 marks |
| Ex 8 | (11,13),(13,15),(15,17),(17,19) |
| Ex 9 | −1≤x&lt;2 |
| Ex 10 | −11/3 ≤ x ≤ 5 |
| Ex 11 / Fig 5.3 | 2≤x&lt;6 |
| Ex 12 | 86&lt;F&lt;95 |
| Ex 13 | 120&lt;x&lt;300 L |

## Exercises

- **Exercise 5.1** Q1–26 — all mapped.
- **Miscellaneous Exercise** Q1–14 — all mapped.

Q14 of Ex 5.1 is **≥** (zoom p.7), not the linear-text `>`.

## Edition note

The opening paragraph still promises linear inequalities in two variables. After §5.2 the 11-page reprint never graphs half-planes; graphical work is one-variable number lines only. Two-variable content is not invented.

## Pedagogical simulations (sims.js)

1. `rice-market` — Ravi packets vs UPI daily cap.
2. `ineq-types` — strict/slack/linear/quadratic classifier.
3. `reverse-rule` — 3&gt;2 vs −3&lt;−2 number-line flip.
4. `algebra-lab` — Examples 2–4 solution rays.
5. `numberline-graph` — Figs 5.1–5.3.
6. `marks-upi` — average ≥ 60 / Sunita / consecutive odds.
7. `double-ineq` — Examples 9–11 overlap.
8. `mixture-temp` — acid %, C↔F, IQ band.
