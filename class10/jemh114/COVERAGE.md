# jemh114 Probability pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh114.pdf`, 16 pdf pages, printed pp. 202–217, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + PNG zooms).

PNG zooms authored (all equation lines re-read off rendered pixels before authoring):
`zoom_ex1_p3` — P(head) = favourable/total = 1/2; P(tail) = 1/2 (Why?) · `zoom_remarks_p5` — P(E)+P(F) = 1/2+1/2 = 1 (coin), = 1/3+2/3 = 1 (die >4/≤4); P(Ē) = 1−P(E); P(getting 8) = 0/6 = 0 · `zoom_ex9_p9` — two coins (H,H),(H,T),(T,H),(T,T); P(at least one head) = 3/4, also 1−1/4 = 3/4 · `zoom_ex13_p12` — 36 ordered pairs Fig. 14.3; sum 8: (2,6),(3,5),(4,4),(5,3),(6,2) → 5/36; sum 13: 0/36 = 0; sum ≤ 12: 36/36 = 1. Supporting spans: Ex2 balls 1/3 (p.4), Ex3 die 2/6=1/3 + 4/6=2/3 (p.4), Ex4 ace 4/52=1/13 + not-ace 48/52=12/13 (pp.6–7), Ex5 tennis 1−0.62=0.38 (p.7), Ex6 birthdays 364/365 + 1/365 (p.7), Ex7 class 25/40=5/8 + 15/40=3/8 (p.8), Ex8 marbles 2/9 + 3/9 + 4/9 = 1 (p.8), Ex12 shirts 88/100=0.88 + 96/100=0.96 (p.11).

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 14.1 fair coin / unbiased / random toss / equally likely; die faces; 4R+1B counterexample | 1–2 | equally-likely | implemented; outcome-explorer coin+balls presets |
| Classical (Laplace 1795) definition; empirical P(E) = happened/trials; satellite/earthquake limits | 2 | classical-def | implemented, PNG zoom cited (Ex1) |
| History box (Cardan, Bernoulli, de Moivre, Laplace) | 3 | classical-def Connect (Wow) | referenced |
| Example 1 coin 1/2 + 1/2; Example 2 three balls 1/3 each | 3–4 | equally-likely, classical-def | implemented, PNG zooms cited |
| Elementary events; P-sum remark (1 and 1) | 4 | elementary-sum | implemented, PNG zoom cited |
| Example 3 die >4: 2/6=1/3; ≤4: 4/6=2/3 | 4 | classical-def, complement | implemented, PNG zoom cited |
| Remarks (1)(2): complements P(E)+P(Ē)=1; impossible 8 (0/6=0); sure <7 (6/6=1); 0≤P≤1 | 5–6 | complement | implemented, PNG zoom cited |
| Deck facts (52, 4 suits × 13, face = K/Q/J); Example 4 ace 1/13 + not-ace 12/13 | 6–7 | complement | implemented, PNG zoom cited |
| Example 5 tennis 0.38; Example 6 birthdays 364/365 + 1/365 | 7 | complement | implemented, spans cited |
| Example 7 class 5/8 + 3/8; Example 8 marbles 2/9 + 1/3 + 4/9 = 1 | 8 | elementary-sum | implemented, spans cited |
| Example 9 two coins 3/4 (+ complement note); finite-outcome remark; Ex 10–11 geometric (starred, non-exam) | 9–11 | compound-listing | implemented (Ex9 PNG zoom); Ex10–11 noted as non-exam, out of scope |
| Example 12 shirts 0.88/0.96; Example 13 two dice 5/36, 0, 1 | 11–12 | compound-listing | implemented, PNG zoom cited (Ex13) |
| Ex 14.1 Q1–25 | 13–16 | all | located in exerciseMap with per-question PDF pages; patterns in quizzes |
| Note to Reader (trials → theory); Q22 sum table + 1/11 fallacy; Q25 1/3 fallacy + odd/even 1/2 | 16 | frequency-theory | implemented |
| 14.2 Summary (6 points) | 16 | revision strip | implemented in revision strip |

Wow videos (all oEmbed-verified 2026-09-08; 1 wiki + 1 video per Wow, 40–70 words each):
equally-likely KzfWUEJjG18 (mathantics) · classical-def QfKk3sxgOOY (FuseSchool - Global Education) · elementary-sum y0YQKrBWM-c (Khan Academy India - English) · complement B1v9OeCTlu0 (jbstatistics) · compound-listing UX489ku79hU (FuseSchool - Global Education) · frequency-theory 8Efz2ficNa0 (Mr. Ace Math). No pending videos.

Gaps (honest): full 25-item exercise bank is mapped, not fully solved in-page; starred geometric-probability Examples 10–11 (musical chairs, helicopter) are non-exam per NCERT and excluded from sims; Fig. 14.3 textbook table is re-expressed as a computed 36-cell listing, not a traced figure; browser matrix/teacher/learner review pending.
