# Class 12 interactive-textbook status

**Last updated:** 2026-09-09  
**Current chapter:** Class 12 Physics (14/14), Chemistry (10/10), Mathematics (13/13), Biology (13/13)  
**Current state:** Physics, Chemistry, Mathematics and Biology implementation complete; review next

## Working rule

Class 12 source extraction and page inspection use PyMuPDF (`pymupdf`) 1.28.2 through `scripts/extract_class12.py`. Page text is paired with layout spans and optional PNG renders so equations, symbols, diagrams, and superscripts can be checked before authoring.

## Progress

| Area | Status | Evidence |
|---|---|---|
| Class 12 source inventory | complete | 50 PDFs found, page-counted, and SHA-256 hashed |
| Physics source maps | complete | All 14 Physics books mapped to 337 PDF pages and 173 exercise entries |
| Chapter-specific interactions | complete | 14 simulations covering electrostatics, circuits, magnetism, waves, nuclei, and semiconductors |
| Interactive implementation | complete for Physics, Chemistry, Mathematics, Biology | All 50 chapters have Learn/Play/Connect/Practice/Revise pages |
| Class 12 review | pending | Review after the first slice is runnable |

## Queue

| Code | Subject | Volume | Title | PDF pages | State |
|---|---|---|---|---:|---|
| `leph101` | Physics | Part 1 | Electric Charges and Fields | 44 | complete; review next |
| `leph102` | Physics | Part 1 | Electrostatic Potential and Capacitance | 36 | complete; review next |
| `leph103` | Physics | Part 1 | Current Electricity | 26 | complete; review next |
| `leph104` | Physics | Part 1 | Moving Charges and Magnetism | 29 | complete; review next |
| `leph105` | Physics | Part 1 | Magnetism and Matter | 18 | complete; review next |
| `leph106` | Physics | Part 1 | Electromagnetic Induction | 23 | complete; review next |
| `leph107` | Physics | Part 1 | Alternating Current | 24 | complete; review next |
| `leph108` | Physics | Part 1 | Electromagnetic Waves | 14 | complete; review next |
| `leph201` | Physics | Part 2 | Ray Optics and Optical Instruments | 34 | complete; review next |
| `leph202` | Physics | Part 2 | Wave Optics | 19 | complete; review next |
| `leph203` | Physics | Part 2 | Dual Nature of Radiation and Matter | 16 | complete; review next |
| `leph204` | Physics | Part 2 | Atoms | 16 | complete; review next |
| `leph205` | Physics | Part 2 | Nuclei | 17 | complete; review next |
| `leph206` | Physics | Part 2 | Semiconductor Electronics: Materials, Devices and Simple Circuits | 21 | complete; review next |
| `lech101` | Chemistry | Part 1 | Solutions | 30 | queued |
| `lech102` | Chemistry | Part 1 | Electrochemistry | 30 | queued |
| `lech103` | Chemistry | Part 1 | Chemical Kinetics | 28 | queued |
| `lech104` | Chemistry | Part 1 | d- and f-Block Elements | 29 | queued |
| `lech105` | Chemistry | Part 1 | Coordination Compounds | 23 | queued |
| `lech201` | Chemistry | Part 2 | Haloalkanes and Haloarenes | 34 | queued |
| `lech202` | Chemistry | Part 2 | Alcohols, Phenols and Ethers | 34 | queued |
| `lech203` | Chemistry | Part 2 | Aldehydes, Ketones and Carboxylic Acids | 32 | queued |
| `lech204` | Chemistry | Part 2 | Amines | 22 | queued |
| `lech205` | Chemistry | Part 2 | Biomolecules | 22 | queued |
| `lemh101` | Mathematics | Part 1 | Relations and Functions | 17 | complete; review next |
| `lemh102` | Mathematics | Part 1 | Inverse Trigonometric Functions | 16 | complete; review next |
| `lemh103` | Mathematics | Part 1 | Matrices | 42 | complete; review next |
| `lemh104` | Mathematics | Part 1 | Determinants | 28 | complete; review next |
| `lemh105` | Mathematics | Part 1 | Continuity and Differentiability | 43 | complete; review next |
| `lemh106` | Mathematics | Part 1 | Application of Derivatives | 40 | complete; review next |
| `lemh201` | Mathematics | Part 2 | Integrals | 67 | complete; review next |
| `lemh202` | Mathematics | Part 2 | Application of Integrals | 8 | complete; review next |
| `lemh203` | Mathematics | Part 2 | Differential Equations | 38 | complete; review next |
| `lemh204` | Mathematics | Part 2 | Vector Algebra | 39 | complete; review next |
| `lemh205` | Mathematics | Part 2 | Three Dimensional Geometry | 17 | complete; review next |
| `lemh206` | Mathematics | Part 2 | Linear Programming | 12 | complete; review next |
| `lemh207` | Mathematics | Part 2 | Probability | 33 | complete; review next |
| `lebo101` | Biology | Single volume | Sexual Reproduction in Flowering Plants | 25 | complete; review next |
| `lebo102` | Biology | Single volume | Human Reproduction | 15 | complete; review next |
| `lebo103` | Biology | Single volume | Reproductive Health | 10 | complete; review next |
| `lebo104` | Biology | Single volume | Principles of Inheritance and Variation | 28 | complete; review next |
| `lebo105` | Biology | Single volume | Molecular Basis of Inheritance | 31 | complete; review next |
| `lebo106` | Biology | Single volume | Evolution | 17 | complete; review next |
| `lebo107` | Biology | Single volume | Human Health and Disease | 22 | complete; review next |
| `lebo108` | Biology | Single volume | Microbes in Human Welfare | 12 | complete; review next |
| `lebo109` | Biology | Single volume | Biotechnology: Principles and Processes | 16 | complete; review next |
| `lebo110` | Biology | Single volume | Biotechnology and Its Applications | 11 | complete; review next |
| `lebo111` | Biology | Single volume | Organisms and Populations | 17 | complete; review next |
| `lebo112` | Biology | Single volume | Ecosystem | 11 | complete; review next |
| `lebo113` | Biology | Single volume | Biodiversity and Conservation | 13 | complete; review next |

## Next exact action

Review the 50 Class 12 chapters against the source pages, then collect classroom feedback and refine the simulations. All four subjects are implemented; review is next.

## Mathematics track

All 13 Mathematics chapters are implemented with PyMuPDF source maps, chapter-specific simulations, and mapped NCERT exercise entries. See MATHS-STATUS.md and MATHS-SOURCE-MANIFEST.md.

## Biology track

All 13 Biology chapters are implemented (81 lessons, 243 practice Qs, 179 mapped exercises) from the PyMuPDF text layer with section/exercise page maps. See BIOLOGY-STATUS.md and BIO-SOURCE-MANIFEST.md.
