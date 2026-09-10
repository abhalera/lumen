# NCERT Coverage Audit: Class 11 Chemistry Chapter 9 (kech203)

**Textbook:** NCERT Class 11 Chemistry Part II, Chapter 9: *Hydrocarbons*  
**Edition/Reprint:** 2026–27 (Rationalized Curricular Standard)  
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)  
**Status:** 100% Comprehensive Coverage

---

## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `c1` | Classification of Hydrocarbons, Alkanes & Conformations | 9.1, 9.2 | 1–6 | `conformationlab` (Ethane & Butane Newman / Sawhorse Rotator) | 3 |
| `c2` | Reactions of Alkanes & Free-Radical Halogenation Mechanism | 9.2.4 | 6–12 | `freeradicalsim` (Free-Radical Chain Halogenation & Cracking Simulator) | 3 |
| `c3` | Alkenes: Structure, Nomenclature & Geometrical (cis-trans) Isomerism | 9.3.1–9.3.3 | 12–18 | `cistranslab` (Geometrical Isomerism & Dipole Moment Chamber) | 3 |
| `c4` | Electrophilic Addition to Alkenes: Markovnikov & Peroxide Effects | 9.3.5 | 18–24 | `markovnikovsim` (Carbocation vs Peroxide Addition & Ozonolysis Lab) | 3 |
| `c5` | Alkynes: Structure, Acidic Character & Addition Reactions | 9.4 | 24–30 | `alkynelab` (Terminal Alkyne Acidity & Hydration Reactor) | 3 |
| `c6` | Aromatic Hydrocarbons: Benzene Structure, Resonance & Hückel's Rule | 9.5.1–9.5.3 | 30–36 | `aromaticitytester` (Hückel (4n+2)π Rule & Ring Planarity Analyzer) | 3 |
| `c7` | Electrophilic Aromatic Substitution (EAS) & Directive Influence | 9.5.4–9.5.6 | 36–42 | `easmechanism` (EAS Mechanism & Directive Influence Engine) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 25 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **9.1 – 9.5** | Free-radical termination forming trace ethane during chlorination; IUPAC systematic names of 7 hydrocarbons; C4H8 alkene isomers (but-1-ene, cis/trans-but-2-ene, 2-methylpropene) and C5H8 alkyne isomers (pent-1-yne, pent-2-yne, 3-methylbut-1-yne); ozonolysis products of pent-2-ene, 3,4-dimethylhept-3-ene, 2-ethylbut-1-ene, 1-phenylbut-1-ene; deduction of 3-ethylpent-2-ene from ethanal and pentan-3-one | ✅ Complete | Free radical kinetics & ozonolysis cleavage logic |
| **9.6 – 9.10** | Deduction of but-2-ene from bond counts (3 C–C σ, 8 C–H σ, 1 C–C π) and aldehyde molar mass (44 u); deduction of 3-ethylhex-3-ene from propanal and pentan-3-one; balanced combustion equations for butane, pentene, hexyne, toluene; cis vs trans hex-2-ene dipole moments and boiling points; benzene resonance energy (150.5 kJ/mol) and extraordinary stability | ✅ Complete | Structural stoichiometry & molecular orbital thermodynamics |
| **9.11 – 9.15** | Necessary conditions for aromaticity (cyclic, planar, conjugated, (4n+2)π); non-aromaticity of methylenecyclohexadiene, 1,3-cyclopentadiene, cyclooctatetraene; synthesis of p-nitrobromobenzene, m-nitrochlorobenzene, p-nitrotoluene, acetophenone from benzene; 1°, 2°, 3°, 4° carbon and hydrogen counting in branched alkane (5 1°, 2 2°, 1 3°, 1 4°); alkane branching effect on surface area and boiling point | ✅ Complete | Hückel orbital analysis & electrophilic directing rules |
| **9.16 – 9.20** | Addition of HBr to propene: Markovnikov 2° carbocation vs Kharasch 2° radical mechanisms; ozonolysis of o-xylene yielding glyoxal, methylglyoxal, dimethylglyoxal in 3:2:1 ratio confirming Kekulé resonance; acidity order ethyne > benzene > hexane via sp > sp² > sp³ electronegativity; benzene preference for EAS over NAS; conversions of ethyne, ethene, hexane to benzene | ✅ Complete | Reaction mechanics & orbital hybridization theory |
| **9.21 – 9.25** | Precursor alkenes yielding 2-methylbutane on hydrogenation (2-methylbut-1-ene, 2-methylbut-2-ene, 3-methylbut-1-ene); relative EAS reactivity orders of chlorobenzenes and toluenes; ease of nitration comparison (toluene > benzene > m-dinitrobenzene); alternative Lewis acid catalysts (FeCl₃, BF₃); failure of Wurtz reaction for odd-carbon alkanes | ✅ Complete | Synthetic retrosynthesis & electrophilic reactivity scale |

---

## 3. Pedagogical Integrity & Verification Metrics
- **Strict Budget:** Compiled `index.html` size < 2.0 MB with zero external CDN dependencies.
- **Zero Iframe Policy:** No eager static iframes; all simulations implemented as native modular JavaScript SVG/Canvas labs.
- **Automated Regression:** Verified via `output/Class11/kech203/tests/verify.cjs` and the master suite `tests/verify-class11-chemistry.cjs`.
