# jemh109 Applications of Trigonometry pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh109.pdf`, 11 pdf pages, printed pp. 133–143, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + PNG zooms; Symbol PUA map proven on jemh108, ∠/Δ/° confirmed again on pp.3–9).

PNG zooms authored (all equation lines re-read off rendered pixels before authoring):
`zoom_ex1_p3` — tan 60° = AB/BC, √3 = AB/15, AB = 15√3 m · `zoom_ex2_p4a` — BD/BC = sin 60°, 3.7/BC = √3/2, BC = 3.7×2/√3 = 4.28 m · `zoom_ex2_p4b` — DC/BD = cot 60° = 1/√3, DC = 3.7/√3 = 2.14 m · `zoom_ex3_p5` — tan 45° = AE/DE, 1 = AE/28.5, AE = 28.5, AB = 30 m · `zoom_ex4_p6a` — tan 30° = 10/AP, AP = 10√3 ≈ 17.32 m · `zoom_ex4_p6b` — tan 45° = (10+x)/(10√3), x = 10(√3−1) = 7.32 m · `zoom_ex5_p7` — √3 = h/x (1), 1/√3 = h/(x+40) (2), 3x = x+40, x = 20, h = 20√3 m · `zoom_ex6_p8` — PD/BD = tan 30°, PC/AC = tan 45° = 1, PD = 8/(√3−1) = 4(√3+1), height = 4(3+√3) m · `zoom_ex7_p9` — 1/√3 = 3/AD, AD = 3√3, BD = 3, AB = 3(1+√3) m.

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 9.1 line of sight, angle of elevation (Figs. 9.1–9.2), angle of depression (Fig. 9.3), Qutub Minar/balcony intros | 1–2 | seeing-angles | implemented; elevation/depression toggle + observer sim |
| Minar recipe: 3 needs (DE, ∠BAC, AE), CD = CB + BD, tan/cot pick, Example 1 (15 m, 60° → 15√3) | 2–3 | one-triangle | implemented, PNG zoom cited |
| Example 2 ladder (BD = 3.7 m; sin 60° → 4.28 m; cot 60° → 2.14 m) | 4 | ladder-ratios, add-eye-height (segment adjust) | implemented, PNG zooms cited |
| Example 3 chimney (28.5 m, 45°, +1.5 m → 30 m) | 5 | add-eye-height | implemented, PNG zoom cited |
| Example 4 building + flagstaff (10 m, 30°/45° → AP = 10√3 ≈ 17.32, x = 10(√3−1) = 7.32) | 5–6 | two-triangles | implemented, PNG zooms cited |
| Example 5 shadows 60°/30°, 40 m gap (→ x = 20, h = 20√3) | 6–7 | two-triangles | implemented, PNG zoom cited |
| Example 6 two buildings, depressions 30°/45° → alternate ∠s, PD = 4(√3+1), height = 4(3+√3) | 7–8 | depression-flip | implemented, PNG zoom cited |
| Example 7 bridge/river, depressions 30°/45°, 3 m → 3(1+√3) | 8–9 | depression-flip | implemented, PNG zoom cited |
| Ex 9.1 Q1–15 (rope, tree, slides, tower, kite, boy-walk, tower-on-building, statue, building-vs-tower, poles, canal, cable tower, ships, balloon, car-time) | 9–11 | all | located in exerciseMap with per-question PDF pages; patterns in quizzes |
| 9.2 Summary (3 definitions + ratios determine heights) | 11 | seeing-angles, revision | implemented in revision strip |

Wow videos (all oEmbed-verified 2026-09-08; 1 wiki + 1 video per Wow, 40–70 words each):
seeing-angles Sja5rEqmpa4 (FuseSchool) · one-triangle TgQs7k5p2Ag (Khan Academy India - English) · add-eye-height IM5OLoMSZIE (Khan Academy India - English) · ladder-ratios fXuV2ZgvnAo (Khan Academy India - English) · two-triangles 1vamogV81Y8 (Khan Academy) · depression-flip l5VbdqRjTXc (Khan Academy). No pending videos.

Gaps (honest): full 15-item exercise bank is mapped, not fully solved in-page; Fig. 9.4–9.13 textbook diagrams are re-expressed as parametric SVG, not traced figures; browser matrix/teacher/learner review pending.
