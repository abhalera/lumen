# NCERT Coverage Audit: Class 11 Chemistry Chapter 6 (kech106)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 6: *Equilibrium*  
**Edition/Reprint:** 2026–27 (Rationalized Curricular Standard)  
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)  
**Status:** 100% Comprehensive Coverage

---

## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `physical-chemical-equilibrium` | Dynamic Nature, Physical Equilibria & Law of Mass Action | 6.1, 6.2, 6.3 | 1–7 | `dynamiceq` (Dynamic Equilibrium Lab) | 3 |
| `kp-kc-relationship` | Kp vs Kc Relation (Kp = Kc(RT)^Δng), Qc & Heterogeneous Equilibria | 6.4, 6.5, 6.6 | 7–15 | `kpconverter` (Kp vs Kc Converter) | 3 |
| `le-chatelier-principle` | Le Chatelier's Principle: Concentration, Pressure & Temp Shifts | 6.7, 6.8, 6.9 | 15–22 | `lechatelier` (Disturbance Responder) | 3 |
| `acid-base-theories` | Arrhenius, Brønsted-Lowry & Lewis Concepts, Water Kw | 6.10, 6.11.1 | 22–27 | `acidbasetheory` (Conjugate & Lewis Lab) | 3 |
| `ph-weak-acids-bases` | pH Scale, Weak Ionization (Ka, Kb), Ostwald Dilution & Ka·Kb = Kw | 6.11.2–6.11.4 | 27–34 | `phweakacid` (Weak Acid Ionization Lab) | 3 |
| `salt-hydrolysis-buffers` | Salt Hydrolysis pH Equations, Buffers & Henderson-Hasselbalch | 6.11.9, 6.12 | 34–42 | `buffersim` (Buffer Resistance Lab) | 3 |
| `solubility-product-ksp` | Solubility Product (Ksp), Common Ion Effect & Precipitation | 6.13 | 42–47 | `ksplab` (Ksp & Precipitation Lab) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 73 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **6.1 – 6.10** | Liquid-vapor volume doubling, SO2 oxidation Kc, Iodine dissociation Kp, Kc expressions, Kp to Kc conversion, reverse Kc, pure condensed phases, N2+O2 reaction, nitrosyl bromide, SO2 Kp to Kc | ✅ Complete | ICE tables & Law of Mass Action |
| **6.11 – 6.20** | HI decomposition Kp, Haber ammonia Qc direction, balanced equation from Kc, water-gas shift, HI equilibrium composition, ICl decomposition, ethane dehydrogenation, ethyl acetate esterification, PCl5 dissociation, FeO reduction | ✅ Complete | Quadratic algebra & Qc vs Kc |
| **6.21 – 6.30** | Haber Qc at 500 K, BrCl decomposition, Boudouard reaction Kp, NO oxidation ΔG° and K, volume increase effect, pressure increase effect, HBr decomposition, steam reforming of methane, Le Chatelier perturbations, PCl5 dissociation | ✅ Complete | Gibbs free energy & Le Chatelier |
| **6.31 – 6.40** | Halving Haber volume, conjugate acids & bases, amphoteric species, Lewis acids & bases, BCl3 & Co³⁺ coordinate bonds, halogen hydracid strengths, oxoacid strengths, 0.005 M H2SO4 pH (2.00), strong base pH, Ba(OH)2 pH (13.00) | ✅ Complete | Brønsted & Lewis principles |
| **6.41 – 6.50** | Soft drink pH, vinegar [H⁺], HF ionization & species, HOCl pH (4.35), propanoic acid Ka from pH, sodium nitrite hydrolysis, pyridinium chloride pH, chloroacetic acid α (15.1%), fluoroacetic acid pH (2.39), bromoacetic acid pKa | ✅ Complete | Weak acid/base quadratic solutions |
| **6.51 – 6.60** | Codeine Kb (1.59e-6), aniline α in water vs NaOH, propanoic acid in HCl, dimethylamine in NaOH, biological fluids [H⁺] (muscle 6.83, stomach 1.20, blood 7.38, saliva 6.40), milk/coffee/tomato/lemon/egg [H⁺], KOH pH (12.70), Sr(OH)2 pH (13.50), propanoate buffer pH, cyanic acid Ka | ✅ Complete | Logarithmic [H⁺] & common ion |
| **6.61 – 6.70** | Ammonia Kb (1.80e-5), NH4Cl + NH3 buffer pH (8.96), ammonium acetate pH (7.00), Ag2CrO4 solubility, CaF2 Ksp (4.14e-11), AgCl in water vs 0.1 M NaCl, BaSO4 precipitation test, Fe(OH)3 Ksp (2.7e-39), CaSO4 dissolution volume (2.44 L), silver benzoate in buffer | ✅ Complete | Henderson-Hasselbalch & Ksp |
| **6.71 – 6.73** | Selective precipitation of Ag⁺ vs Pb²⁺, Fe(OH)2 maximum [Fe²⁺] at pH 8.0 (8.0e-4 M), metal sulfide precipitation in acidic H2S (ZnS and CdS precipitate) | ✅ Complete | Precipitation threshold Qsp > Ksp |

---

## 3. Pedagogical Integrity & Verification Metrics
- **Strict Budget:** Compiled `index.html` size < 2.0 MB with zero external CDN dependencies.
- **Zero Iframe Policy:** No eager static iframes; all simulations implemented as native modular JavaScript SVG/Canvas labs.
- **Automated Regression:** Verified via `output/Class11/kech106/tests/verify.cjs` and the master suite `tests/verify-class11-chemistry.cjs`.
