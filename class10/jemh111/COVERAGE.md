# jemh111 Areas Related to Circles pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh111.pdf`, 7 pdf pages, printed pp. 154–160, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + raw text) plus full-page PNG renders at 2x (`/tmp/opencode/jemh111_work/zooms/p2–p7.png`), read as images before authoring.

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 11.1 sector/segment definitions, minor/major, major angle 360°−∠AOB, Remark minor-by-default | 1 | sector-minor-major | implemented |
| Unitary derivation: sector = θ/360 × πr² (360 → 1 → θ) | 2 | why-sector-fraction | implemented, PNG zoom cited |
| Arc length = θ/360 × 2πr; Summary point 1 (p.7) | 2, 7 | arc-length | implemented, PNG zoom cited |
| Segment = sector − triangle; major = πr² − minor (Note) | 3 | segment-minus-triangle | implemented, PNG zoom cited |
| Example 1: r = 4, θ = 30°, sector 12.56/3 = 4.19, major 46.05/46.1, alternative (360−θ) form | 3 | why-sector-fraction worked | implemented, PNG zoom cited |
| Example 2 setup: r = 21, ∠AOB = 120°, sector 462; OM ⊥ AB, RHS, halves 60°; OM = 21/2, AM = 21√3/2, AB = 21√3 | 4 | segment-trig-120 quick/formula | implemented, PNG zooms cited |
| Triangle area 441√3/4; segment (462 − 441√3/4) = 21(88 − 21√3)/4 | 5 | segment-trig-120 deeper/worked | implemented, PNG zoom cited |
| Ex 11.1 Q1–14 (all: sectors, quadrants, hands, chords, horse, brooch, umbrella, wipers, lighthouse, table cover, MCQ) | 5–6 | combinations-exercise + exerciseMap | all 14 located in exerciseMap; Q-patterns worked (Ex.3/4/5/8/10/11/12 numbers verified in model tests) |
| 11.2 Summary points 1–3 | 7 | arc-length / revision grid | implemented |

Videos (all oEmbed-verified 2026-09-08, Khan Academy; 1 wiki + 1 video per Wow, none invented):
- sector-minor-major: u8JFdwmBvvQ — Area of a sector given a central angle | Circles | Geometry | Khan Academy
- why-sector-fraction: J_B5vbvIMnU — Area of sector | Mensuration | MH Grade 10 | Math | Khan Academy
- arc-length: jX4K2blhN0U — Word problems: Area of a sector 1/2 | Area related to circles | Math | Khan Academy
- segment-minus-triangle: nmWaV11hz18 — Area of segment of a circle | Areas related to Circle | Class 10 | Maths | Khan Academy
- segment-trig-120: clBI4iowCug — Area of a segment of a circle (2/2) | Areas related to circles | Math | Khan Academy
- combinations-exercise: jX4K2blhN0U (reuse, word-problem fit) — same oEmbed record as above

Gaps (honest): full 14-item exercise bank is mapped, not fully solved in-page (each preset/quiz covers the pattern, not every sub-part); Ex. 9 wire-length arithmetic and Ex. 13 cost arithmetic are located but left as application-bench exploration. Browser matrix/teacher/learner review pending.
