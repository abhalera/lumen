# NCERT Coverage Audit: Class 11 Chemistry Chapter 8 (kech202)

**Textbook:** NCERT Class 11 Chemistry Part II, Chapter 8: *Organic Chemistry: Some Basic Principles and Techniques*  
**Edition/Reprint:** 2026–27 (Rationalized Curricular Standard)  
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)  
**Status:** 100% Comprehensive Coverage

---

## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `c1` | Tetravalency of Carbon, Hybridization and Molecular Representations | 8.1, 8.2 | 1–5 | `hybridviewer` (Carbon Hybridization & Bond-Line Orbitals Lab) | 3 |
| `c2` | IUPAC Nomenclature of Organic Compounds | 8.3, 8.4 | 5–12 | `iupacbuilder` (Interactive IUPAC Nomenclature Engine) | 3 |
| `c3` | Isomerism in Organic Compounds: Structural and Stereoisomerism | 8.5 | 12–15 | `isomersim` (Structural & Geometrical Isomerism Chamber) | 3 |
| `c4` | Fundamental Concepts in Organic Reaction Mechanisms: Cleavage & Intermediates | 8.6, 8.7 | 15–18 | `arrowpusher` (Curved-Arrow Reaction Mechanism & Intermediate Analyzer) | 3 |
| `c5` | Electronic Displacement Effects: Inductive, Electromeric, Resonance and Hyperconjugation | 8.7 | 18–24 | `hyperlab` (Electronic Displacement & Hyperconjugation Lab) | 3 |
| `c6` | Methods of Purification of Organic Compounds | 8.8 | 24–30 | `purificationlab` (Fractional & Steam Distillation / Chromatography Simulator) | 3 |
| `c7` | Qualitative and Quantitative Elemental Analysis of Organic Compounds | 8.9, 8.10 | 30–37 | `elementalanalysis` (Kjeldahl & Carius Quantitative Analysis Calculator) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 40 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **8.1 – 8.8** | Hybridization states of carbon in 5 molecules; sigma and pi bond counts in 6 compounds; bond-line representations of isopropyl alcohol, 2,3-dimethylbutanal, heptan-4-one; IUPAC nomenclature of 6 structures; identifying correct IUPAC names with locant rules; first 5 members of homologous series; functional group identification | ✅ Complete | Hybridization geometry & IUPAC gold-standard rules |
| **8.9 – 8.16** | Relative stability of 2-nitroethoxide vs ethoxide anion; electron donor behavior of alkyl groups attached to pi systems (hyperconjugation); resonance structures of carboxylate, nitrobenzene, benzaldehyde; resonance structures of phenol and phenoxide ion; curved arrow electron movement representations; homolytic vs heterolytic cleavage with electrophile/nucleophile classifications | ✅ Complete | Curved-arrow formalism & electronic displacement rules |
| **8.17 – 8.24** | Classification of 4 reactions as substitution, addition, elimination, rearrangement; relationships between structural isomer pairs; resonance hybrid stability and octet rule satisfaction; drawing resonance structures with formal charges; identifying nucleophiles and electrophiles; electronic displacement effects in functional groups | ✅ Complete | Organic reaction mechanism taxonomy & orbital theory |
| **8.25 – 8.32** | Principle of fractional distillation with boiling point differences; chromatography mobile and stationary phase mechanics; separation of calcium sulfate and camphor by sublimation; steam distillation vapor pressure law; unreactivity of CCl4 with AgNO3; role of KOH bulbs in Liebig combustion; acetic acid vs sulfuric acid in lead acetate test; combustion stoichiometry for CO2 and H2O mass | ✅ Complete | Physical organic purification & stoichiometric principles |
| **8.33 – 8.40** | Kjeldahl nitrogen determination (%N = 56.0%); Carius chlorine determination (%Cl = 37.57%); Carius sulfur determination (%S = 19.61%); hybrid orbital identification in hex-1-en-5-yne; Prussian blue formula in Lassaigne test; most stable carbocation selection ((CH3)3C+); modern chromatography separation classification; ethyl iodide + KOH substitution classification | ✅ Complete | Quantitative analytical stoichiometry & multi-choice validation |

---

## 3. Pedagogical Integrity & Verification Metrics
- **Strict Budget:** Compiled `index.html` size < 2.0 MB with zero external CDN dependencies.
- **Zero Iframe Policy:** No eager static iframes; all simulations implemented as native modular JavaScript SVG/Canvas labs.
- **Automated Regression:** Verified via `output/Class11/kech202/tests/verify.cjs` and the master suite `tests/verify-class11-chemistry.cjs`.
