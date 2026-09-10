# jemh110 Circles pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh110.pdf`, 10 pdf pages, printed pp. 144–153, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (dict spans + raw text; Symbol PUA ∠/Δ decoded; fraction/formula lines PNG-zoomed at 3× before authoring).

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 10.1 Introduction: 3 positions, secant/tangent definitions, Fig. 10.1 | 1 | secant-tangent | implemented |
| Pulley ropes (Fig. 10.2); only 3 positions | 2 | secant-tangent Connect, deeper | referenced (motivating examples) |
| 10.2 Activity 1: rotating wire, one tangent at a point, tangent = secant with coinciding chord ends | 2 | secant-tangent deeper | implemented |
| Activity 2: sliding parallels, ≤ 2 parallel tangents; point of contact; wheel/ground (Fig. 10.4) | 3 | secant-tangent, radius-perp Connect | implemented |
| Theorem 10.1 + proof: tangent ⊥ radius via OQ > OP, shortest distance, Theorem A1.7 (zoom-verified p.4) | 3–4 | radius-perp | implemented, PNG zoom cited |
| Remarks: unique tangent at a point; normal. Ex 10.1 Q1–Q4 (Q3: r 5, OQ 12 → √119) | 4 | radius-perp deeper, measure-lengths quiz, exerciseMap | located; Q3 pattern in quiz |
| 10.3 Activity 3 / Cases 1–3: 0/1/2 tangents; tangent length defined (Fig. 10.6) | 4–5 | how-many | implemented |
| Theorem 10.2 + RHS/CPCT proof + Pythagoras remark + OP bisects angle (zoom-verified p.6) | 6 | equal-tangents | implemented, PNG zoom cited |
| Example 1: concentric circles, chord bisected (OP ⊥ AB + centre bisects chord) | 6–7 | measure-lengths Connect | proof chain in Connect + quiz path |
| Example 2: ∠PTQ = 2∠OPQ angle chase with θ (zoom-verified p.7) | 7 | tangent-angles | implemented, chase shown |
| Example 3: chord 8, r 5 → PR 4, OR 3, TP = 20/3 via similarity + Pythagoras pair (zoom-verified p.7–8) | 7–8 | measure-lengths | implemented, both routes |
| Ex 10.2 Q1 (24/25 → r 7), Q2 (110° → 70°), Q3 (80° → ∠POA 50°) (zoom-verified p.8) | 8 | measure-lengths + tangent-angles quizzes | located; patterns in quizzes |
| Ex 10.2 Q4–Q13 (diameter parallels, contact-perpendicular, radii 5/3 chord, ABCD, ∠AOB = 90°, supplementary pair, rhombus, triangle 8/6/r4, supplementary opposite sides) | 9 | all | located in exerciseMap; proof templates in deeper/worked |
| 10.4 Summary (3 points) | 10 | chapter revision | implemented |

Videos (all oEmbed-verified 2026-09-08; titles/channels copied from oEmbed JSON, never invented): secant-tangent Bxxl_cujLbY FuseSchool; radius-perp KjQ1KN5GgoE Khan Academy; how-many Yafd2uAlPoQ Khan Academy India - English; equal-tangents pJABplruJIU Khan Academy; tangent-angles G8fQ4fvS8Dw Problems Solved; measure-lengths zDStwRlrR8A Khan Academy India - English. Note: tangent-angles video is a small Indian board-prep channel (not the preferred Khan/FuseSchool tier) — it was the only oEmbed-verified topical proof of Ex 10.2 Q10 found; upgrade if a reputable-edu version surfaces.

Gaps (honest): 17-item exercise bank is mapped, not fully solved in-page; Ex 10.2 Q8–Q13 diagram-heavy proofs (ABCD, ∠AOB = 90°, rhombus, triangle sides, supplementary opposite sides) have templates/pointers, not full step-throughs — pending. Course index + VIDEO-MANIFEST updates pending (registry files untouched per task). Browser matrix/teacher/learner review pending.
