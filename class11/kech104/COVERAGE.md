# NCERT Coverage Audit: Class 11 Chemistry Chapter 4 (kech104)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 4: *Chemical Bonding and Molecular Structure*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt1_kech104.pdf` (36 pdf pages, printed pp. 100–135)
**SHA-256:** `e24381616647f4f98fc4beddf03132f33b13b74384dd639cf2d70acae1fe1e9a` (in `output/Class11/SOURCE-MANIFEST-CHEMISTRY.json`)
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 655 checks pass (source-PDF hash fixture, packaging, lesson schema, 32 browser
  fixtures, 40 exercises with exact pages + source-wording checks, every quantitative answer recomputed
  from the book's givens — Born-Haber cycles, formal charges, bond orders, σ counts, Δχ ladder, dipole
  conversion — plus worked-example values and 7 video wire-ups).
- `browser_qa.cjs`: 206 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 32 lab scenarios).
- Videos: 7/7 wow cards wire the results file's oEmbed-verified first candidates
  (work/class11-chemistry-videos/results/kech104.json), each re-verified 200 OK with exact id/title/channel;
  `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  concepts→lessons, connect pairs→3 objects (1 wow + links + video), worked strings→objects,
  group/watch, quizzes level/type/solution/wrong, exercises q/title/given/steps/answer/takeaway/
  conceptIdx/conceptName/page/printPage (+99 offset), exerciseMap/exercisesNote.

## Honest fixes (verified against the PDF, not silently patched)

- **NF3 dipole 0.24 → 0.23 D** in 5 chapter spots + 3 sim spots (PDF dipole table: NH3/NF3/BF3 = 1.47/0.23/0).
- **PCl5 axial/equatorial 219/204 → 212/202 pm** in 5 spots (Adams & Bartell gas-phase electron
  diffraction: mean 2.061 Å with axial 0.104 Å longer gives eq 2.019, ax 2.123 Å).
- **Worked-example labels** corrected from in-text Problems to Exercises (the book has only Problems
  4.1–4.4: Lewis CO, nitrite ion, CO3²⁻ and CO2 structures); carbonate formal-charge worked reframed as
  supporting Exercises 4.4 & 4.11.
- **Born-Haber cycle kept as a labeled extension**: the rationalized NCERT omits it (zero hits in the PDF),
  so the worked title says "(extension)" and the sim derives every value from displayed modern inputs.
- **MgO lattice 3791 → 3844 kJ/mol** to match the sim's Born-Haber derivation (148 + 249 + 2188 + 657 −
  601.7); 3791/3795 are older-input variants — internal consistency with the shown derivation wins.
- **Van der Waals range normalized** to ≈2–10 kJ/mol (was 2–5 in one lesson spot, 2–10 in Q4.39).
- Figure-dependent questions (Q4.12 tautomer structures, Q4.20 acetic-acid skeleton) are solved with full
  textual structure descriptions, so no figure is required to follow the steps.

## Draft errors fixed against the PDF

- NF3/PCl5/worked-label/VdW/MgO fixes above; one broken `$$p><p>` tag (stray fragment) in Q4.22's solution;
  `$$` display spans collapsed and converted (nested-brace parser for frac/overset/vec/dot); lesson page
  spans corrected to true section locations; sims.js gained the zero-arg data-preset shim, prediction-marking
  aliases and presentation normalization (draw exports already present; no dead tail to remove).

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `kossel-lewis-octet` | Kössel-Lewis Approach & Octet Rule | 4.1, 4.2 | 1–7 (pr. 100–106) | `lewisdot` (Formal-charge ledger) | 3 |
| `ionic-bond-lattice` | Ionic Bonding & Lattice Energy | 4.2 | 7 (pr. 106) | `bornhaber` (Hess-cycle verifier) | 3 |
| `bond-parameters-dipole` | Bond Parameters, Resonance & Dipoles | 4.3 | 8–12 (pr. 107–111) | `dipolelab` (Vector addition) | 3 |
| `vsepr-theory` | VSEPR Shapes & Lone Pairs | 4.4 | 13–17 (pr. 112–116) | `vseprlab` (AB₂–AB₆ explorer) | 3 |
| `valence-bond-hybrid` | Valence Bond & Hybridization | 4.5, 4.6 | 18–25 (pr. 117–124) | `hybridsim` (sp/sp²/sp³ + σ/π) | 3 |
| `molecular-orbital-theory` | Molecular Orbital Theory | 4.7, 4.8 | 26–31 (pr. 125–130) | `mothelab` (BO & magnetism) | 3 |
| `hydrogen-bonding` | Hydrogen Bonding & Anomalies | 4.9 | 32–33 (pr. 131–132) | `hbondlab` (Ice/water/isomers) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 40 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **4.1 – 4.5** | Bond formation, Lewis dots/symbols, octet rule & limits | ✅ Complete | Source-wording + answer-statement checks |
| **4.6 – 4.13** | Ionic factors, VSEPR shapes, NH3/H2O angles, bond order/length, resonance | ✅ Complete | Steric-number, FC & BO recomputation |
| **4.14 – 4.20** | Electron transfer, dipole geometry, EN vs EG, polar bonds, ionic character, acetic acid | ✅ Complete | Δχ ladder (0/1.0/2.7/3.0); dipole values |
| **4.21 – 4.27** | CH4 shape, BeH2/NH3/NF3 dipoles, hybridization concept/Al/B changes, multiple bonds | ✅ Complete | Vector logic; sp(n) upgrade checks |
| **4.28 – 4.34** | σ/π counts, overlap rules, per-carbon hybridization, bp/lp, σ vs π, H2 VB curve, LCAO | ✅ Complete | Bond-count arithmetic (3/5/9 σ) |
| **4.35 – 4.40** | Be2 absence, O2-series stability/magnetism, orbital signs, PCl5, H-bond, bond orders | ✅ Complete | MO ladder (0/1.0/1.5/2.0/2.5/3.0) |

**Total Exercises:** 40 / 40 (100% verified coverage).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech104` (281.4 KB).
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
