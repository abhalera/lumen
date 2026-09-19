# COVERAGE — lebo106 Evolution

**Source:** `books/originals/Class12-Biology_lebo106.pdf` (17 pdf pages, printed folio = pdf page + 109 (verified, see correction note below), Reprint 2026-27).

**Correction (2026-09-19):** an earlier pass wrongly recorded this chapter as folio-absent. Verified directly against the PDF: the printed folio appears as the first extracted text line on almost every page (only the chapter-opener page lacks one). Confirmed printed = 1-based PDF page + 109 across 3 independent anchor points with zero deviation. `printPage` on every exercise and `print` on every lesson now hold the real printed folio.
**SHA-256:** `d2a181994b3d2a060226f4bf1b45ad581c6da69a8dd2a01e448704d6ce868071` (in `/tmp/opencode/bio_maps.json`, key `lebo106`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo106.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo106.pdf

Honest notes: the page map resolves every section (6.1–6.9) only to pdf p. 1 and every exercise (1–10) to pdf p. 17, so lesson pdf/print ranges below are assigned from the extracted running text (headers on pp. 110–126), not from per-section map entries. No PNG zooms were made (disk full); all numbers are text-verified against `/tmp/opencode/bio_text/lebo106.txt`. Miller's temperature prints as `8000C` in the layer (read: 800 °C apparatus setting). The §6.4 figure order cites Figure 6.6 before Figure 6.5 in the running text; both are kept in this section.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| origin-miller | 6.1 | 1–3 | Complete; Big Bang 13.8 bya, earth 4.5 bya, reducing atmosphere, Pasteur, Oparin–Haldane, Miller 1953 CH4/H2/NH3/H2O → amino acids, cells ~2000 mya |
| theories-evidences | 6.2, 6.3 | 3–7 | Complete; special creation vs Darwin–Wallace fitness, fossils/dating, Haeckel vs von Baer, homologous vs analogous, breeding, moth melanism 1850s→1920, anthropogenic resistance |
| adaptive-radiation | 6.4 | 7–9 | Complete; Darwin's finches beak triad, marsupial radiation, placental wolf/Tasmanian wolf convergence |
| lamarck-darwin-mechanism | 6.5, 6.6 | 9–11 | Complete; Lamarck giraffe rejected, branching descent + selection, Malthus, bacteria A→B, de Vries saltation, Fig 6.8 trio |
| hardy-weinberg | 6.7 | 11–12 | Complete; p²+2pq+q²=1, 5 disturbers + founder effect, q²→q→2pq worked, Fig 6.8 readout |
| timeline-human | 6.8, 6.9 | 12–16 | Complete; 2000 mya cells → 65 mya dinosaur exit → mammals, hominid brains 650→900→1400cc, Bhimbetka/art/farming |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Universe/earth/life | Dates | 13.8 bya / 4.5 bya / ~4.0 bya (500 my gap) / cells ~2000 mya |
| Miller 1953 | Gases + product | CH4, H2, NH3, H2O vapour + discharge → amino acids (sugars, bases, pigments, fats in repeats) |
| Forelimb homology | Bone groups | 6 (humerus, radius, ulna, carpals, metacarpals, phalanges) |
| Moths | Reversal | 1850s white > dark → 1920 dark > white (industrial); rural stays low-melanic |
| Finches | Diets | 3 modes: seed-eating → insectivorous + vegetarian |
| Selection modes | Fig 6.8 | 3: stabilising (mean), directional (off-mean), disruptive (both ends) |
| H-W | Equation + example | p²+2pq+q²=1; q²=0.16 → q=0.4, p=0.6, 2pq=0.48; 5 disturbers |
| Vertebrates | Spine | cells 2000 → invertebrates 500 → jawless fish 350 → dinosaurs out 65 (mya) |
| Hominids | Brains | habilis 650–800 → erectus ~900 → Neanderthal 1400 (cc) |
| Sapiens | Milestones | Neanderthal 1,00,000–40,000 → ice age 75,000–10,000 → art 18,000 → farming 10,000; Bhimbetka, Raisen, MP |

## End-of-Chapter Exercises 1–10

All **10** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (all on pdf p. 17; printed folio = pdf page + 109 (verified, see correction note below); conceptIdx per lesson: Q1→L4, Q2→L2, Q3→L4, Q4–Q6→L6, Q7→L2, Q8→L3, Q9–Q10→L6).

## Pedagogical Simulations (sims.js — separate script)

1. `miller` — spark-discharge gas mixer → amino acids.
2. `evidences` — homologous vs analogous sorter (forelimbs, wings, eyes).
3. `finches` — beak adaptation radiation.
4. `selection` — directional/stabilising/disruptive curve shifter + moth melanism.
5. `hardyweinberg` — p/q slider with genotype frequencies + 5 disturbing factors.
6. `humanevolution` — timeline walker with brain sizes.
