# Curriculum & NCERT Coverage Audit: kebo115
**Chapter Title:** Body Fluids and Circulation  
**NCERT Reference:** Class 11 Biology, Chapter 15 (Reprint 2026-27, pp. 193–205)  
**Extraction Source:** PyMuPDF (`fitz` span dictionary, blocks, and 2x PNG zoom proofs)  

---

## 1. Chapter Architecture & Core Concepts
- **Total Pedagogical Concepts:** 7
- **Total Multi-tier Quizzes:** 21 (3 per concept: Foundation, Application, NEET-Challenger)
- **Total Custom Simulations:** 7 (100% interactive native SVG/Canvas, zero external CDN dependencies)

| Concept # | Title | Pages | Key Simulation |
|---|---|---|---|
| 01 | Hematological Constituents & Plasma Proteomics | 193–195 | `hematologycentrifugesim` |
| 02 | Blood Group Immunology, Erythroblastosis Foetalis & Coagulation Cascade | 195–197 | `bloodgroupcoagulationsim` |
| 03 | Lymphatic Microcirculation & Tissue Fluid Dynamics | 197–198 | `lymphaticdrainagesim` |
| 04 | Comparative Vertebrate Heart Evolution & Hemodynamics | 198–200 | `vertebrateheartevolutionsim` |
| 05 | The Human Cardiac Cycle, Nodal Pacemaker & Hemodynamics | 200–202 | `cardiaccycleengine` |
| 06 | Clinical Electrocardiography (ECG): Waves, Intervals & Axis | 202–203 | `ecgsimulator` |
| 07 | Systemic Circuits, Cardiac Regulation & Cardiovascular Disorders | 203–205 | `vascularpathologysim` |

---

## 2. 100% Rationalized NCERT End-of-Chapter Exercises Coverage (14/14)
All 14 exercises from the official 2026-27 reprint have been completely mapped, authored with exhaustive step-by-step reasoning, and integrated into the offline interactive viewer:

1. **Ex 1:** Components of formed elements and their major functions (Erythrocytes 5-5.5M gas transport, Leucocytes 6-8K immunity [granulocytes + agranulocytes], Platelets 1.5-3.5L hemostasis).
2. **Ex 2:** Importance of plasma proteins (Fibrinogen clotting, Globulins immunity, Albumins oncotic pressure balance ~25 mmHg, buffer capacity).
3. **Ex 3:** Column matching (Eosinophils -> resist infections; RBC -> gas transport; AB group -> universal recipient; Platelets -> coagulation; Systole -> contraction of heart).
4. **Ex 4:** Why blood is considered a connective tissue (mesodermal origin, cells + plasma matrix + fibrin fibers upon clotting, whole-body unifying transport).
5. **Ex 5:** Difference between lymph and blood (RBC/platelet absence, lower protein, colorless, specialized lymphocytes, fat transport).
6. **Ex 6:** Double circulation definition and significance (Pulmonary vs systemic circuits, zero mixing, high systemic pressure vs low pulmonary pressure, endothermic support).
7. **Ex 7:** Differences: (a) Blood vs Lymph, (b) Open vs Closed systems, (c) Systole vs Diastole, (d) P-wave vs T-wave.
8. **Ex 8:** Evolutionary changes in vertebrate hearts (2-chambered fish single circulation -> 3-chambered amphibian/reptile incomplete mixing -> 4-chambered crocodile/bird/mammal complete separation).
9. **Ex 9:** Why human heart is myogenic (auto-excitable nodal tissues SAN/AVN initiate action potentials independently of extrinsic nerves, overdrive suppression, transplant viability).
10. **Ex 10:** Why SAN is called the pacemaker (highest intrinsic auto-rhythmic frequency of 70-75 action potentials/min, sets cardiac cadence).
11. **Ex 11:** Significance of AV node and Bundle of His (conducts through fibrous atrioventricular ring, introduces essential 0.1s AV delay, rapid Purkinje distribution).
12. **Ex 12:** Definitions of cardiac cycle (0.8s) and cardiac output (CO = SV x HR = 70 mL x 72 bpm = ~5 L/min).
13. **Ex 13:** Heart sounds explained (First sound 'LUB' = AV valve closure at onset of ventricular systole; Second sound 'DUB' = semilunar valve closure at onset of ventricular diastole).
14. **Ex 14:** Standard ECG drawn and explained (P-wave atrial depolarization, QRS complex ventricular depolarization, T-wave ventricular repolarization, heart rate calculation from R-R interval).

---

## 3. Offline Budget & Security Constraints
- Strict single-file offline HTML compiled under 2.0 MB budget.
- Zero external CDN dependencies (fonts, styles, scripts).
- Zero eager iframes.
- Validated with headless browser rendering and assertion test suite.
