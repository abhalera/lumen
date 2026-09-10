# NCERT Coverage Audit: Class 11 Chemistry Chapter 4 (kech104)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 4: *Chemical Bonding and Molecular Structure*  
**Edition/Reprint:** 2026–27 (Rationalized Curricular Standard)  
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)  
**Status:** 100% Comprehensive Coverage

---

## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `kossel-lewis-octet` | Kössel-Lewis Approach, Formal Charge & Octet Limitations | 4.1 | 1–5 | `lewisdot` (Lewis Dot & Formal Charge) | 3 |
| `ionic-bond-lattice` | Ionic Bonding, Lattice Enthalpy & Born-Haber Cycle | 4.2 | 5–8 | `bornhaber` (Born-Haber Cycle Lab) | 3 |
| `bond-parameters-dipole` | Bond Parameters, Resonance & Dipole Moments: NH₃ vs NF₃ | 4.3 | 8–14 | `dipolelab` (3D Dipole Vector Lab) | 3 |
| `vsepr-theory` | VSEPR Theory: Electron Repulsion & Molecular Geometry | 4.4 | 14–20 | `vseprlab` (3D VSEPR Distortion Lab) | 3 |
| `valence-bond-hybrid` | Valence Bond Theory, Orbital Overlap & Hybridization | 4.5, 4.6 | 20–28 | `hybridsim` (Orbital Overlap & Hybrid Lab) | 3 |
| `molecular-orbital-theory` | Molecular Orbital Theory & Paramagnetism of Oxygen | 4.7 | 28–34 | `mothelab` (MO Energy Diagram Lab) | 3 |
| `hydrogen-bonding` | Hydrogen Bonding: Inter/Intramolecular & Water Anomalies | 4.8 | 34–36 | `hbondlab` (H-Bond Dynamic Cage Lab) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 40 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **4.1 – 4.5** | Chemical bond formation, Lewis dot symbols, Lewis ions, structures (H2S, SiCl4, BeF2, CO3²⁻, HCOOH), Octet rule significance & 5 limitations | ✅ Complete | Formal charge & Lewis octet analysis |
| **4.6 – 4.8** | Favourable factors for ionic bonds, VSEPR shapes (BeCl2, BCl3, SiCl4, AsF5, H2S, PH3), NH3 vs H2O bond angle compression | ✅ Complete | Born-Haber energetics & VSEPR lp-lp repulsion |
| **4.9 – 4.12** | Bond strength vs bond order, bond length definition, CO3²⁻ resonance aspects, H3PO3 tautomerism vs resonance rule | ✅ Complete | MO bond order & nuclear coordinate invariance |
| **4.13 – 4.16** | Resonance of SO3, NO2, NO3⁻, electron transfer Lewis symbols (K/S, Ca/O, Al/N), CO2 (linear 0 D) vs H2O (bent 1.85 D), dipole moment applications | ✅ Complete | Canonical formal charges & vector summation |
| **4.17 – 4.20** | Electronegativity vs Δ_eg H, polar covalent bonds, ionic character order (N2 < ClF3 ≤ SO2 < K2O < LiF), acetic acid correct Lewis structure | ✅ Complete | Pauling electronegativity & valence counts |
| **4.21 – 4.23** | CH4 tetrahedral vs square planar (109.5° vs 90° repulsion), BeH2 zero dipole moment, NH3 (1.47 D) vs NF3 (0.24 D) dipole explanation | ✅ Complete | VSEPR steric energy & dipole vector algebra |
| **4.24 – 4.26** | Hybridization definition (sp, sp², sp³ shapes), AlCl3 + Cl⁻ → AlCl4⁻ (sp² to sp³), BF3 + NH3 → F3B·NH3 (B: sp²→sp³, N: sp³) | ✅ Complete | Steric number & coordinate dative bond tracking |
| **4.27 – 4.30** | Double & triple bond orbital diagrams (C2H4, C2H2), σ and π bond counts (C2H2: 3σ, 2π; C2H4: 5σ, 1π), x-axis overlap (2py-2py forms π), carbon hybridization | ✅ Complete | Axial vs lateral overlap geometry |
| **4.31 – 4.34** | Bond pair vs lone pair illustrations, σ vs π comparison table, H2 formation via Heitler-London VBT curve (74 pm, 435.8 kJ/mol), LCAO 3 conditions | ✅ Complete | Quantum mechanics & Heitler-London potential well |
| **4.35 – 4.37** | MOT proof of Be2 non-existence (BO = 0), O2/O2⁺/O2⁻/O2²⁻ stability & magnetism, orbital wave function (+)/(-) phase significance | ✅ Complete | Molecular orbital configuration & unpaired spins |
| **4.38 – 4.40** | PCl5 sp³d hybridization & axial bond elongation (219 pm vs 204 pm), Hydrogen bond definition & vdW comparison, Bond order calculation (N2=3, O2=2, O2⁺=2.5, O2⁻=1.5) | ✅ Complete | Steric 90° repulsions & (Nb - Na)/2 derivations |

---

## 3. Pedagogical Integrity & Verification Metrics
- **Strict Budget:** Compiled `index.html` size < 2.0 MB with zero external CDN dependencies.
- **Zero Iframe Policy:** No eager static iframes; all simulations implemented as native modular JavaScript SVG/Canvas labs.
- **Automated Regression:** Verified via `output/Class11/kech104/tests/verify.cjs` and the master suite `tests/verify-class11-chemistry.cjs`.
