# jemh112 Surface Areas and Volumes pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh112.pdf`, 10 pdf pages, printed pp. 161–170, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + PNG zooms; Symbol PUA map as on jemh108; π shown as Symbol U+F070, stacked fractions/E6–E8/F6–F8 pieces — all numbers re-read off rendered pixels before authoring).

PNG zooms authored (every equation line re-read off rendered pixels before authoring numbers):
`zoom_ex1_p3` — TSA = CSA hemi + CSA cone; hemi = ½(4πr²) = 2πr² · `zoom_ex1b_p4` — cone h = (5−3.5/2) = 3.25 cm; l = √(r²+h²) = 3.7 cm approx; CSA cone = πrl; TSA = 2πr² + πrl = (22/7)×(3.5/2)×(3.5+3.7) = 39.6 cm² approx · `zoom_ex2_p4` — cube TSA 150 cm²; surface = TSA − πr² + 2πr² = 150 + πr² = 150 + 13.86 = 163.86 cm² (r = 2.1 cm) · `zoom_ex3_p5` — r = 2.5, h = 6, r′ = 1.5, h′ = 20; l = √(2.5²+6²) = 6.5; orange = πrl + πr² − πr′² = π[20.25] = 63.585; yellow = 2πr′h′ + πr′² = πr′(2h′+r′) = 195.465 · `zoom_ex4_p6` — TSA = 2πrh + 2πr² = 2πr(h+r) = 2×(22/7)×30×(145+30) = 33000 cm² = 3.3 m² · `zoom_ex5_p7` — shed cuboid 15×7×8; half-cylinder d = 7, length 15 · `zoom_ex5b_p8` — volume = [15×7×8 + ½×(22/7)×(7/2)×(7/2)×15] = 1128.75 m³; air = 1128.75 − (300 + 1.6) = 827.15 m³ · `zoom_ex6_p8` — apparent πr²h = 196.25; less by ⅔πr³ = 32.71; actual = 163.54 cm³ · `zoom_ex7_p9` — toy = ⅔πr³ + ⅓πr²h = 25.12 cm³ (r = h = 2); box = 3.14×2²×4 = 50.24; diff = 25.12 cm³.

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 12.1 Introduction (cuboid/cone/cylinder/sphere; tanker Fig. 12.2, test tube Fig. 12.3) | 1–2 | visible-hidden Connect + recall | implemented; capsule rule motivated |
| 12.2 Tanker rule: TSA new = CSA + CSA + CSA; hidden faces (Fig. 12.4) | 2 | visible-hidden | implemented, zoom cited |
| 12.2 Toy rule: cone + hemisphere, equal radii (Fig. 12.5) | 3 | visible-hidden, top-and-block | implemented, zoom cited |
| Example 1 lattu (d 3.5 cm, total 5 cm → 39.6 cm²) | 3–4 | top-and-block | implemented, PNG zooms cited |
| Example 2 cube + hemisphere (5 cm, d 4.2 cm → 163.86 cm²) | 4 | top-and-block | implemented, PNG zoom cited |
| Example 3 rocket (unequal radii ring; 63.585 + 195.465 cm²) | 5 | ring-and-cavity | implemented, PNG zoom cited |
| Example 4 bird-bath (hollow adds; 33000 cm² = 3.3 m²) | 6 | ring-and-cavity | implemented, PNG zoom cited |
| Ex 12.1 Q1–9 (cuboid 160; vessel; toy; dome; depression; capsule 220 mm²; tent 44 m² + ₹22000; hollow ≈ 18–19; scooped 374) | 6–7 | ring-and-cavity, pattern-bank | located in exerciseMap with per-question PDF pages; capsule/tent/hollow/scooped numbers in content |
| 12.3 Volumes add (joined = sum; §12.3 para) | 7 | volumes-add | implemented, zoom cited |
| Example 5 shed (1128.75 m³; air 827.15 m³) | 7–8 | volumes-add | implemented, PNG zooms cited |
| Example 6 glass (196.25 − 32.71 = 163.54 cm³) | 8 | capacity-occupies | implemented, PNG zoom cited |
| Example 7 toy + circumscribing cylinder (25.12 / 50.24 / 25.12 cm³) | 9 | capacity-occupies | implemented, PNG zoom cited |
| Ex 12.2 Q1–8 (π; 66; jamun ≈ 1127/syrup ≈ 338; stand ≈ 523.53; 100 shots; pole ≈ 892.26 kg; water left; vessel ≈ 346.51) | 9–10 | pattern-bank, capacity-occupies, volumes-add | located in exerciseMap with per-question PDF pages; all seven bank numbers in content + tests |
| 12.4 Summary (surface combos; volume combos) | 10 | revision strip | implemented in revision strip |

Wow videos (all oEmbed-verified 2026-09-08; 1 wiki + 1 video per Wow, 40–70 words each):
visible-hidden QDQw66_TeaE (Khan Academy India - English: Surface area of combination of solids) · top-and-block 3CGBz05r1r4 (Khan Academy India - English: Problems: surface area of combinations of solids) · ring-and-cavity 9w6qYXatwkM (Khan Academy: Surface area of a cone) · volumes-add ANc85RET5Fk (Khan Academy India - English: Volume of combination of solids) · capacity-occupies feiSEqpPmAA (Khan Academy India - English: Problems: volume of combination of solids) · pattern-bank gL3HxBQyeg0 (Khan Academy: Cylinder volume and surface area). No pending videos.

Gaps (honest): full 17-item exercise bank is mapped, not fully solved in-page (bank numbers in content + tests, step-by-step for all Qs pending); Fig. 12.1–12.16 textbook diagrams are re-expressed as parametric SVG schematics, not traced figures; this reprint chapter carries NO frustum section — frustum helpers exist in model.js only as a geometry-family reference and are labelled as such in-page; Q8 hollow rounding (≈18 vs 19.14) depends on when l is rounded — lesson states the convention; browser matrix/teacher/learner review pending.
