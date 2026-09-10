# Coverage — Life Processes (jesc105)

Source: [jesc105.pdf](https://ncert.nic.in/textbook/pdf/jesc105.pdf) · Edition 2026–27 · File: `output/Class10/jesc105/index.html`

Concepts (7): `life-nutrition-modes`, `photosynthesis`, `digestion`, `respiration`, `circulation`, `plant-transport`, `excretion`
Practice: 21 questions (3 per concept: Easy/Medium/Hard). Sims: nutrition selector; iodine-test bench; digestion stepper; energy-path+breathing stepper; heartbeat stepper; pipeline lab; nephron stepper.

## Map (NCERT item → concept ID + status)

| NCERT item | Concept ID | Status |
|---|---|---|
| 5.1 What are life processes? + in-text Q p.80 | `life-nutrition-modes` | covered: Learn + 3 Qs |
| 5.2.1 Autotrophic nutrition + Activities 5.1/5.2 (pp.81–83) | `photosynthesis` | covered: Learn + iodine-test sim + 3 Qs |
| 5.2.2 Heterotrophic types (p.83) | `life-nutrition-modes` | covered: Learn + organism selector |
| 5.2.3 Organism nutrition: Amoeba/Paramoecium (p.84) | `life-nutrition-modes` | covered: Learn + Amoeba sim option + Q |
| 5.2.4 Human digestion + Activity 5.3 + caries box (pp.84–86) | `digestion` | covered: Learn + 6-step sim + 3 Qs (Ex.5/6 themes) |
| In-text Q p.86–87 (auto vs hetero; raw materials; acid; enzymes; villi) | `photosynthesis/digestion` | covered: digestion deeper + Qs; raw materials in photosynthesis Learn |
| 5.3 Respiration + Activities 5.4/5.5/5.6 + ATP/tobacco boxes (pp.87–90) | `respiration` | covered: Learn + 6-step sim + 3 Qs |
| In-text Q p.90 (land vs water O2; glucose paths; transport; lung design) | `respiration` | covered: deeper + sim + Qs |
| 5.4.1 Human transport + Activity 5.7 + BP box (pp.91–93) | `circulation` | covered: Learn + heartbeat stepper + 3 Qs (Ex.11 theme) |
| In-text Q p.96 (components; separation; plant pipes; water; food) | `circulation/plant-transport` | covered: Learn + sims |
| 5.4.2 Plant transport + Activity 5.8 (pp.94–95) | `plant-transport` | covered: Learn + pipeline sim + 3 Qs (Ex.2/12 themes) |
| 5.5.1 Human excretion + dialysis box (pp.96–97) | `excretion` | covered: Learn + nephron stepper + 3 Qs |
| 5.5.2 Plant excretion + organ-donation box (p.98) | `excretion` | covered: Learn + stepper step 4 |
| In-text Q p.98 (nephron; plant methods; urine regulation) | `excretion` | covered: Learn + recall |
| Ex.1 kidneys | `excretion` | quizzed (Easy Q) |
| Ex.2 xylem | `plant-transport` | quizzed (Easy Q) |
| Ex.3 autotrophy needs | `life-nutrition-modes` | quizzed (Easy Q) |
| Ex.4 pyruvate in mitochondria | `respiration` | quizzed (Easy Q) |
| Ex.5 fat digestion | `digestion` | quizzed (Medium Q: bile role) |
| Ex.6 saliva role | `digestion` | quizzed (Easy Q) |
| Ex.7 autotrophic conditions/products | `photosynthesis` | mapped: Learn + sim + Medium Q |
| Ex.8 aerobic vs anaerobic | `respiration` | mapped: Learn + stepper; learner writes |
| Ex.9 alveoli design | `respiration` | mapped: deeper + sim step 5/6 |
| Ex.10 haemoglobin lack | `respiration` | mapped: deeper (fatigue) |
| Ex.11 double circulation | `circulation` | mapped: Learn + ordering Q |
| Ex.12 xylem vs phloem | `plant-transport` | quizzed (Hard Q theme) |
| Ex.13 alveoli vs nephrons | `excretion` | quizzed (Hard Q) |
| GAP: no live lab (lime-water blowing, pig’s heart visit) | `—` | GAP: home/teacher demos described, not simulated wet-lab |

## Honest gaps
- No wet-lab simulation (lime-water blowing, starch boiling, health-centre visit) — home/teacher demos described.
- Exact gut/heart/kidney anatomy simplified to schematics; use book Figs. 5.6/5.10/5.14 for exams.
- BMI/diet personal advice out of scope — no health recommendations.

## 2026-09-07 fixes
- ATP wording: "one ATP → 30.5 kJ/mol" fixed to "one mole of ATP → 30.5 kJ/mol" (molar unit consistent with More-to-Know p.88).
- O2 origin made explicit to source: light splits water releasing O2; released O2 comes from water photolysis, not from CO2 (photosynthesis Learn).
- Dialysis precision fixed to source: blood through semi-permeable tubing in dialysing fluid matching plasma except nitrogenous wastes; wastes diffuse out; no selective reabsorption as in nephron tubule (Learn + Connect ward card).
- Slang "say no" removed → "NCERT advises avoiding tobacco" (respiration Learn).
- Verified node --check PASS (both script blocks), page-range PASS (PDF 1–21), file <2MB, no "no —" residue, Hards are diagnose/justify/interpret.

Q-number policy: only real NCERT numbers above are cited; all quiz questions are labelled `Original practice` except where the map tag names an NCERT item.

## 2026-09-07 Wow trivia cards (jesc109-pilot mirror)
- Added ONE `Wow — …` connect card as last card in every concept (7/7): 2 core cards kept verbatim, Wow is 3rd. Each Wow 40–70 words, original wording, real place/device + why + school-model vs measured split. No dosage (ORS/antacid: packet/doctor direction only, no amounts), no unsafe home chemistry.
- Cards: `life-nutrition-modes` Meghalaya pitcher plant (47w); `photosynthesis` wheat/paddy yield (48w); `digestion` antacid neutralisation (54w); `respiration` marathon oxygen debt (47w); `circulation` clinic ECG (49w); `plant-transport` Maharashtra drip irrigation (52w); `excretion` ORS + kidneys (51w). Max 2 https links per Wow (Wikipedia + FAO home / pmksy.gov.in / who.int homepages, no deep-URL invention); all HEAD 200 verified (Wikipedia 429s re-checked 200 after backoff).
- Renderer + CSS mirror `jesc109/pilot`: `connect-card wow` + `wow-badge` (WOW · REAL WORLD) + `ext-links` + `offline-note`; `connectTag` unchanged (no rebrand).
- Verify: file 134,635 B <2MB; `node --check` PASS both scripts; every lesson 3 connect cards, last-is-Wow; `tests/verify-course.cjs` PASS.
