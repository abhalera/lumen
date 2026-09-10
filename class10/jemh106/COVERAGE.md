# jemh106 Triangles pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh106.pdf`, 26 pdf pages, printed pp. 73–98, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + PNG zooms at 85dpi, all 26 pages rendered to `/tmp/opencode/jemh106_z/`; key proof/figure pages 7–10, 12, 15, 16, 18, 20–22, 25, 26 zoom-read).

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 6.1 Introduction (congruence vs similarity; Everest/moon indirect measurement) | 1–2 | same-shape Connect, pythagoras-note deeper | referenced (motivating examples, not assessed) |
| 6.2 Similar figures: circles/squares/equilateral; Taj Mahal prints 35→45/55mm; scale factor; Activity 1 shadow ABCD→A′B′C′D′ | 2–5 | same-shape | implemented |
| Square-vs-rectangle (Fig. 6.6), square-vs-rhombus (Fig. 6.7): one condition insufficient | 5–6 | same-shape worked/deeper | implemented, counterexamples shown |
| Ex 6.1 Q1–3 | 6 | same-shape, exerciseMap Q1–Q3 | located; fill-up patterns in quizzes |
| 6.2/6.3 similarity of triangles; Thales equiangular note; Activity 2 (AP=PQ=QD=DR=RB, AD/DB = AE/EC = 3/2, zoom-verified p.7) | 7 | bpt-proof | implemented |
| Theorem 6.1 proof via ar(ADE)/ar(BDE) = AD/DB, ar(ADE)/ar(DEC) = AE/EC, ar(BDE) = ar(DEC) (zoom-verified p.8) | 8 | bpt-proof | implemented, PNG zoom cited |
| Activity 3 (AB₁/B₁B = 1/4, AB₂/B₂B = 2/3 → parallels, zoom-verified p.9); Theorem 6.2 proof via DE′ + adding 1 (zoom-verified p.10) | 9–10 | converse-midpoint | implemented |
| Example 1 (AD/AB = AE/AC from BPT, zoom-verified p.10); Example 2 trapezium EF; Example 3 isosceles via Theorem 6.2 + corresponding angles | 10–12 | converse-midpoint deeper, exerciseMap | implemented |
| Ex 6.2 Q1 (1.5/3/1 → EC = 2; 7.2/1.8/5.4, zoom-verified p.12), Q2 (3.9/3 vs 3.6/2.4; 4/4.5 vs 8/9), Q3–Q10 | 12–13 | converse-midpoint quizzes/worked, map Q4–Q13 | implemented + located |
| 6.4 criteria intro: △ABC ~ △DEF conditions + correspondence warning (p.14) | 13–14 | aa-criterion deeper, sss-sas deeper | implemented |
| Activity 4 (BC = 3, EF = 5, ratio 0.6; 60°/40°, zoom-verified p.15); Theorem 6.3 AAA + AA remark + Fig. 6.24 DP/DQ proof | 15 | aa-criterion | implemented |
| Activity 5 (3-6-8 vs 4.5-9-12, ratio 2/3, zoom-verified p.16); Theorem 6.4 SSS + Fig. 6.26 | 16 | sss-sas | implemented |
| Activity 6 (2-4 vs 3-6, 50° included, zoom-verified p.18); Theorem 6.5 SAS + Fig. 6.28 | 17–18 | sss-sas | implemented |
| Example 4 (PQ∥RS → △POQ ~ △SOR AAA); Example 5 (3.8/7.6 = 6/12 = 3√3/6√3 = 1/2 → △ABC ~ △RQP, ∠P = 40°, zoom-verified p.20) | 19–20 | aa-criterion, sss-sas worked | implemented |
| Example 6 (OA·OB = OC·OD → △AOD ~ △COB SAS); Example 7 lamp-post (BD = 4.8, (4.8+x)/x = 4 → x = 1.6 m, zoom-verified p.20–21); Example 8 medians (△AMC ~ △PNR SAS → CM/RN = AB/PQ, p.21–22) | 20–22 | sss-sas, applications | implemented |
| Ex 6.3 Q1–16 (Fig. 6.34 pairs; 125°/70° chase; QR/QT; altitudes; parallelogram; right △ABC ~ △AMP; bisectors; CA² = CB·CD; pole 6/4 vs tower 28 → 42 m; median ratios) | 22–25 | exerciseMap Q14–Q29; Q2/Q4/Q13/Q15/Q16 patterns in quizzes/worked | located; key numeric patterns solved in-page |
| 6.5 Summary points 1–9 (similarity, BPT, converse, AAA/AA, SSS, SAS — zoom-verified p.25–26) | 25–26 | pythagoras-note | implemented |
| Note to the Reader: RHS similarity criterion (hyp + side proportional ⟹ similar; simplifies Ch.8 Ex.2) | 26 | pythagoras-note | implemented, cited as examinable note |

RATIONALISATION HONESTY: this 26-page PDF contains NO section on areas of similar triangles and NO Pythagoras theorem + converse section (contrast older syllabi). The p.1 promise ("simple proof of Pythagoras Theorem") has no matching section in-body; the Summary (points 1–9) confirms the examined scope. The `pythagoras-note` concept therefore previews the altitude-to-hypotenuse AA proof (AB² = AD·AC, BC² = CD·AC, sum = AC²) with a 3-4-5 worked check (1.8/3.2/2.4 splits) plus the `areaRatio k²` model hook — labelled preview, not examined content.

Videos (all oEmbed-verified 2026-09-08; no IDs invented): FPKIueFZxxQ Khan Academy India-English Similar Figures; TultCHDC3wI FuseSchool Similar Shapes; MlGOhzYn-QQ Khan Academy Applying similar triangles; BI-rtfZVXy0 Khan Academy Similar triangles; ip-xRWBa8M0 FuseSchool Similar & Congruent Shapes; bWTtHKSEcdI Khan Academy CA Geometry worked examples; w4Ovhsqdghg FuseSchool Pythagoras. BPT-specific reputable videos: Khan Academy hosts BPT/converse as site-embedded lessons (no public YouTube ID found after genuine search); plUzHrS0Iew oEmbed-resolves but channel is not on the reputable list — excluded per rule, covered by FuseSchool/Khan generality instead.

Gaps (honest): 29-item exercise bank is mapped, not fully solved in-page; Ex 6.3 Q1 Fig. 6.34 six-pair verdicts and Q7 four-similarity altitude chase need diagram-heavy solutions — pending. Browser matrix/teacher/learner review pending.
