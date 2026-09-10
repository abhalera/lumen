# Curriculum & NCERT Coverage Audit: kebo114
**Chapter Title:** Breathing and Exchange of Gases  
**NCERT Reference:** Class 11 Biology, Chapter 14 (Reprint 2026-27, pp. 183–195)  
**Extraction Source:** PyMuPDF (`fitz` span dictionary, blocks, and 2x PNG zoom proofs)  

---

## 1. Chapter Architecture & Core Concepts
- **Total Pedagogical Concepts:** 7
- **Total Multi-tier Quizzes:** 21 (3 per concept: Foundation, Application, NEET-Challenger)
- **Total Custom Simulations:** 7 (100% interactive native SVG/Canvas, zero external CDN dependencies)

| Concept # | Title | Pages | Key Simulation |
|---|---|---|---|
| 01 | Anatomical Architecture of Respiratory Tract & Thoracic Cage | 183–186 | `respiratorytractsim` |
| 02 | Mechanics of Pulmonary Ventilation & Pressure Gradients | 186–187 | `ventilationmechanicssim` |
| 03 | Pulmonary Spirometry: Lung Volumes & Functional Capacities | 187–188 | `spirometryvolumesim` |
| 04 | Alveolar-Capillary Gas Exchange & Diffusion Dynamics | 188–190 | `gasexchangediffusionsim` |
| 05 | Oxygen Transport & The Oxyhemoglobin Dissociation Curve | 190–191 | `oxydissociationcurvesim` |
| 06 | Carbon Dioxide Transport, Carbonic Anhydrase & Chloride Shift | 191–192 | `co2transportsystemsim` |
| 07 | Neural & Chemical Regulation, Hypoxia & Respiratory Disorders | 192–194 | `neuralregulationsim` |

---

## 2. 100% Rationalized NCERT End-of-Chapter Exercises Coverage (14/14)
All 14 exercises from the official 2026-27 reprint have been completely mapped, authored with exhaustive step-by-step reasoning, and integrated into the offline interactive viewer:

1. **Ex 1:** Define vital capacity. What is its significance? ($VC = ERV + TV + IRV$, 3500–4500 mL, restrictive vs obstructive diagnostics).
2. **Ex 2:** State the volume of air remaining in the lungs after normal breathing (Functional Residual Capacity, $FRC = ERV + RV = 2100	ext{--}2300\,\text{mL}$).
3. **Ex 3:** Diffusion of gases occurs in the alveolar region only and not in other parts. Why? (Thin squamous barrier < 0.5 µm vs thick conducting zone, 100 m² surface area, dense capillaries).
4. **Ex 4:** Major transport mechanisms for CO2 (70% as $HCO_3^-$ with carbonic anhydrase and chloride shift, 20-25% carbamino-Hb, 7% dissolved in plasma).
5. **Ex 5:** pO2 and pCO2 in atmospheric air compared to alveolar air (ii: pO2 higher [159 vs 104 mmHg], pCO2 lesser [0.3 vs 40 mmHg]).
6. **Ex 6:** Explain inspiration under normal conditions (diaphragm and external intercostal contraction, thoracic volume expansion, negative intrapulmonary pressure gradient).
7. **Ex 7:** How is respiration regulated? (Medullary rhythm center, pontine pneumotaxic switch, central chemosensitive area for CO2/H+, peripheral aortic/carotid bodies, negligible O2 role).
8. **Ex 8:** Effect of pCO2 on oxygen transport (Bohr effect: high pCO2/H+ in tissues shifts ODC right, unloading O2; low pCO2 in lungs shifts left, loading O2).
9. **Ex 9:** What happens to respiratory process in a man going up a hill? (High altitude hypobaric hypoxia, hyperventilation, respiratory alkalosis, acclimatization via erythropoietin, polycythemia, 2,3-BPG).
10. **Ex 10:** Site of gaseous exchange in an insect (Tracheal system: spiracles, tracheae, and fluid-filled microscopic tracheoles).
11. **Ex 11:** Define oxygen dissociation curve and explain sigmoidal pattern (Positive cooperativity and allosteric T-to-R transition among 4 hemoglobin subunits).
12. **Ex 12:** Hypoxia in-depth report (Hypoxic, anemic, stagnant/ischemic, and histotoxic hypoxia with clinical manifestations).
13. **Ex 13:** Distinctions: (a) IRV vs ERV, (b) IC vs EC, (c) VC vs TLC.
14. **Ex 14:** Tidal volume and hourly ventilation calculation ($500\,\text{mL} \times (12	ext{--}16) \times 60 = 360{,}000	ext{ to }480{,}000\,\text{mL/hour} = 360	ext{ to }480\,\text{L/h}$).

---

## 3. Offline Budget & Security Constraints
- Strict single-file offline HTML compiled under 2.0 MB budget.
- Zero external CDN dependencies (fonts, styles, scripts).
- Zero eager iframes.
- Validated with headless browser rendering and assertion test suite.
