# NCERT Coverage Audit: Class 11 Chemistry Chapter 2 (kech102)

**Textbook:** NCERT Class 11 Chemistry Part I, Chapter 2: *Structure of Atom*
**Edition/Reprint:** 2026–27
**Source PDF:** `books/originals/Class11-Chemistry-Pt1_kech102.pdf` (45 pdf pages, printed pp. 29–73)
**SHA-256:** `3498491c7dddaf6f9145245a2a62de70059af2f9514396b8f088a7dd65a82319` (in `output/Class11/SOURCE-MANIFEST-CHEMISTRY.json`)
**Extraction Engine:** PyMuPDF (`fitz` span dictionary + 2× PNG zoom proofs, no pdftotext)
**Status:** 100% Comprehensive Coverage

## Verification status (2026-09-19, muse-textbooks)

- `tests/verify.cjs`: 884 checks pass (source-PDF hash fixture, packaging, lesson schema, 25 browser
  fixtures, 67 exercises with exact pages + source-wording checks, every quantitative answer recomputed
  from the book's givens, worked-example values, 7 video wire-ups).
- `browser_qa.cjs`: 170 checks, 0 failures, 0 console errors (1280px + 390px + 768px, all 25 lab scenarios).
- Videos: 7/7 wow cards wire agy-imported's oEmbed-verified first candidates
  (work/class11-chemistry-videos/results/kech102.json); `verify_videos.py kech102` passes with 0 problems
  on an independent re-run, and `tests/verify.cjs` cross-checks every wired id/title/channel exactly.
- Shape migrated to the lech101 standard: top-level code/title/book/edition/source/page span,
  concepts→lessons, connect pairs→3 objects (1 wow + links + video), worked strings→objects,
  group/watch, quizzes level/type/solution/wrong, exercises q/title/given/steps/answer/takeaway/
  conceptIdx/conceptName/page/printPage (+28 offset), exerciseMap/exercisesNote.

## Honest print quirks (handled in the steps, not silently patched)

- **Q2.49** as printed gives no frequency, so only the photon rate (1.25×10²⁴ s⁻¹) is computable; the
  draft's "typical visible 500 nm" aside was removed as invented data.
- **Q2.52**'s table header "v × 10⁻⁵ (cm s⁻¹)" must read v in units of 10⁵ m s⁻¹ (else h comes out
  ~10⁻³⁷); endpoint-pair fit gives h = 6.71×10⁻³⁴ J s, λ₀ = 540 nm with consistent constants.
- **Q2.58** asks for the velocity matching 800 pm (v ≈ 495 m s⁻¹); the draft answered the inverse
  question and was rewritten.

## Draft errors fixed against the PDF

- Q2.3 question wrote inverted symbols (⁶₁₃C); Q2.30 swapped parts (b)/(c); Q2.35 hedged 20 cm with 2.4 cm;
  Q2.37 said 1.6 mm for 1.6 cm (answer was 10× off); Q2.39 answered a 3-charge version instead of the
  printed single charge (8 electrons); Q2.53 used 256 nm for 256.7 nm (W₀ = 4.48 eV, not 4.50);
  Q2.56 truncated 434.2 nm to 434.1; all "Problem 2.N" worked labels corrected to Exercise numbers;
  Rutherford experiment year 1911→1909; Millikan 1909→1906–14; eV-scale sim bugs fixed (see sims.js).

---
## 1. Pedagogical Concept Mapping

| Concept ID | Title | NCERT Section | Textbook Pages | Simulation Lab | Practice Quizzes |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `subatomic-particles` | Discovery of Subatomic Particles & e/m | 2.1 | 2–4 (pr. 30–32) | `cathoderay` (Thomson e/m tube) | 3 |
| `atomic-models` | Rutherford Alpha Scattering & Nuclear Model | 2.2 | 4–9 (pr. 32–37) | `alphascatter` (Gold foil scatter) | 3 |
| `dual-nature-light` | Planck Quantum & Photoelectric Effect | 2.3 | 9–18 (pr. 37–46) | `photoelectric` (Phototube lab) | 3 |
| `bohr-model` | Bohr Model of Hydrogen & Emission Spectra | 2.4 | 18–21 (pr. 46–49) | `bohrmodel` (Transitions & series) | 3 |
| `matter-waves` | de Broglie Waves & Heisenberg Uncertainty | 2.5 | 21–25 (pr. 49–53) | `uncertainty` (Standing wave & slit) | 3 |
| `quantum-model` | Quantum Mechanical Model & Orbitals | 2.6–2.6.3 | 25–33 (pr. 53–61) | `orbitalviewer` (3D probability & nodes) | 3 |
| `electronic-config` | Aufbau, Pauli Exclusion & Hund's Rule | 2.6.4–2.6.6 | 33–40 (pr. 61–68) | `electronconfig` (Aufbau orbital filler) | 3 |

**Totals:** 7 core pedagogical concepts, 21 multi-tier practice questions, 7 interactive canvas/SVG simulations.

---

## 2. NCERT End-of-Chapter Exercises Mapping (All 67 Covered)

| Exercise Range | Topics Covered | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **2.1 – 2.4** | Electron mass/charge, methane electrons, neutrons in ¹⁴C/NH₃, isotopic notation | ✅ Complete | Exact numerical evaluation & molar mass checks |
| **2.5 – 2.12** | Wave relations, photon energy, 1 J photon count, photoelectric work function & stopping potential | ✅ Complete | Planck-Einstein energy balance checks |
| **2.13 – 2.19** | Bohr orbits, Balmer emission wavelength, H ionization from n=5, emission lines | ✅ Complete | Rydberg formula & energy level verification |
| **2.20 – 2.22** | de Broglie wavelengths of electron & macroscopic bodies, isoelectronic species | ✅ Complete | Momentum & matter wave assertions |
| **2.23 – 2.31** | Quantum numbers n, l, ml, ms, permissible orbital sets, orbital capacities | ✅ Complete | Quantum selection rules audit |
| **2.32 – 2.34** | 2πr = nλ standing wave proof, He⁺ vs H transitions, He⁺ ionization | ✅ Complete | Bohr-de Broglie resonance proof |
| **2.35 – 2.44** | Atomic scales, Millikan charge quantization, Rutherford foil, nuclide algebra (⁸¹Br, ³⁷Cl⁻, ⁵⁶Fe³⁺) | ✅ Complete | Stoichiometric & algebraic validation |
| **2.45 – 2.54** | EM spectrum order, lasers, neon lamp, caesium work function, X-ray inner binding energy | ✅ Complete | Photoelectric & photon rate validation |
| **2.55 – 2.61** | Paschen IR series, Balmer transition, TEM/neutron de Broglie, Heisenberg uncertainty | ✅ Complete | Uncertainty relation & matter wave audit |
| **2.62 – 2.67** | (n+l) energy ordering, effective nuclear charge (Z_eff), unpaired spins, n=4 subshells | ✅ Complete | Hund's rule & Aufbau configuration checks |

**Total Exercises:** 67 / 67 (100% verified coverage).

---

## 3. Offline Budget & Zero-CDN Compliance

- Single standalone HTML bundle compiled via `scripts/class11/build_chapter.py kech102`.
- Strict budget: < 2.0 MB (zero external CDN links, zero unauthenticated external scripts).
- Math and typography rendered via native SVG and accessible modern CSS tokens.
