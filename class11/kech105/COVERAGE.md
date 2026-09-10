# NCERT Coverage Audit: Class 11 Chemistry Chapter 5 (kech105)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 5: *Chemical Thermodynamics*  
**Edition/Reprint:** 2026–27 (Rationalized Curricular Standard)  
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)  
**Status:** 100% Comprehensive Coverage

---

## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `thermo-systems-state` | Thermodynamic Systems, Boundaries, State Functions & Properties | 5.1 | 1–5 | `systemtypes` (System & Boundary Lab) | 3 |
| `first-law-work` | First Law of Thermodynamics, PV-Work & Reversible Expansion | 5.2, 5.3 | 5–10 | `pvworklab` (Piston Compression & Work) | 3 |
| `enthalpy-calorimetry` | Enthalpy, Heat Capacities (Cp − Cv = R) & Calorimetry | 5.4, 5.5 | 10–16 | `calorimeter` (Bomb vs Coffee-cup Lab) | 3 |
| `thermochemistry-hess` | Thermochemical Equations, Hess's Law & Bond Enthalpies | 5.6, 5.7 | 16–22 | `hesscycle` (Hess Cycle Builder) | 3 |
| `entropy-second-law` | Spontaneity, Entropy & the Second Law of Thermodynamics | 5.8 | 22–27 | `entropylab` (Molecular Disorder & Expansion) | 3 |
| `gibbs-spontaneity` | Gibbs Free Energy & Temperature-Dependent Spontaneity | 5.9 | 27–31 | `gibbslab` (Gibbs Spontaneity Phase Lab) | 3 |
| `free-energy-equilibrium` | Free Energy, Equilibrium Constant (ΔG° = −RT ln K) & Third Law | 5.10, 5.11 | 31–36 | `thirdlawsim` (Equilibrium & Third Law Lab) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 22 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **5.1 – 5.3** | State function definition (path independent), Adiabatic condition (q = 0), Standard enthalpy of elements (zero) | ✅ Complete | Conceptual analysis |
| **5.4 – 5.6** | Methane combustion ΔH° vs ΔU° (Δn_g = −2), Enthalpy of formation of CH₄ (−74.8 kJ/mol), Spontaneity of exothermic reaction with ΔS > 0 | ✅ Complete | Thermodynamic derivations |
| **5.7 – 5.9** | First Law calculation (q = +701 J, w = −394 J → ΔU = +307 J), Cyanamide bomb calorimeter ΔH (−741.5 kJ/mol), Aluminium heat capacity (1.067 kJ) | ✅ Complete | Exact numerical calculations |
| **5.10 – 5.12** | Supercooled water freezing enthalpy (−7.151 kJ/mol), Carbon combustion heat for 35.2 g CO₂ (314.8 kJ), N2O4 + 3 CO reaction enthalpy (−777.7 kJ/mol) | ✅ Complete | Multi-step thermochemical cycles |
| **5.13 – 5.15** | Formation of NH₃ (−46.2 kJ/mol), Formation of CH₃OH(l) via Hess (−239 kJ/mol), CCl₄ atomization (1304 kJ/mol) and mean C–Cl bond enthalpy (326.0 kJ/mol) | ✅ Complete | Hess's Law & bond enthalpy |
| **5.16 – 5.18** | Isolated system ΔS (≥ 0), Temperature threshold for 2A + B → C (T > 2000 K), Cl atom dimerization signs (ΔH < 0, ΔS < 0) | ✅ Complete | Second Law & Gibbs criteria |
| **5.19 – 5.22** | 2A + B → 2D spontaneity (ΔG° = +164 J, non-spontaneous), Equilibrium constant K = 10 (ΔG° = −5.744 kJ/mol), NO(g) thermodynamic stability (+90 kJ/mol), Surroundings entropy for water synthesis (+959.7 J K⁻¹ mol⁻¹) | ✅ Complete | Gibbs-Helmholtz & ΔS_surr derivations |

---

## 3. Pedagogical Integrity & Verification Metrics
- **Strict Budget:** Compiled `index.html` size < 2.0 MB with zero external CDN dependencies.
- **Zero Iframe Policy:** No eager static iframes; all simulations implemented as native modular JavaScript SVG/Canvas labs.
- **Automated Regression:** Verified via `output/Class11/kech105/tests/verify.cjs` and the master suite `tests/verify-class11-chemistry.cjs`.
