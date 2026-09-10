# COVERAGE — lebo112 Ecosystem

**Source:** `books/originals/Class12-Biology_lebo112.pdf` (11 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `6d73b01f7ad5492d08a67b695ae8c05230631f20b1b40c791ab7435b39d0e59e` (in `/tmp/opencode/bio_maps.json`, key `lebo112`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo112.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (disk full).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo112.pdf

Honest notes: (1) the task brief's SHA-256 (`6d73b01f...45bf9f3`, 54 hex chars) is truncated — the full 64-char hash in `bio_maps.json` is used above. (2) The chapter TOC prints section 12.2 with a trailing dot (`12.2. Productivity`, PDF p. 1) while §§12.1/12.3–12.5 print without one. (3) Exercise Q1 (fill in the blanks a–e) spans pdf pp. 10–11: stems (a)–(b) print on p. 10 with the limitations box, stems (c)–(e) on p. 11; it is mapped to p. 10 per `bio_maps.json`. (4) `bio_maps.json` section pages are coarse (§§12.3–12.5 all recorded as pdf p. 1), so lesson page ranges below were derived from the text layer instead.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| pond-structure | 12.1 | 1–2 | Complete; functional unit, terrestrial/aquatic/man-made, species composition, stratification, 4 aspects, pond components |
| productivity | 12.2 | 2–3 | Complete; production vs productivity, GPP − R = NPP, secondary productivity, factors, 170/55 biosphere figures |
| decomposition | 12.3 | 3–4 | Complete; detritus, 5 steps simultaneous (Fig 12.1), humus, mineralisation, lignin/chitin vs nitrogen/sugar, warm-moist vs cold-anaerobic |
| energy-flow | 12.4 | 5–7 | Complete; PAR <50%, 2–10% capture, GFC (Grass→Goat→Man) vs DFC, food web, trophic levels, standing crop, 10% law (Figs 12.2–12.3) |
| pyramids | 12.5 | 7–9 | Complete; number/biomass/energy (Fig 12.4 a–d), upright vs inverted (tree insects, sea fishes), energy always upright, 4 limitations |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Structure | Features + aspects | Species composition + stratification; productivity, decomposition, energy flow, nutrient cycling |
| Pond | 4 components | Abiotic (water + bottom soil) + phytoplankton/algae/marginal plants + zooplankton/swimmers/bottom dwellers + fungi/bacteria/flagellates at bottom |
| Productivity | Identity + units | NPP = GPP − R; g m⁻² / kcal m⁻², rates per yr |
| Biosphere | NPP split | 170 billion tons total ≈ 55 oceans + 115 land (dry weight); oceans ~70% of surface |
| Decomposition | 5 steps | Fragmentation → leaching → catabolism → humification → mineralisation, simultaneous |
| Humus | Reservoir | Dark, amorphous, colloidal, resists microbes; mineralisation releases inorganic nutrients |
| PAR | Capture | <50% of incident is PAR; plants capture 2–10% of PAR; ~1% of sunlight → NPP (Fig 12.4d) |
| 10% law | Chain math | 10 000 → 1 000 → 100 → 10 across T1–T4 (Fig 12.3) |
| Grassland | Numbers | Nearly 6 million plants support 3 top-carnivores (Fig 12.4a) |
| Inversions | Exceptions | Number: tree → insects → birds; biomass: sea fishes > phytoplankton; energy never inverts (heat loss) |

## End-of-Chapter Exercises 1–11

All **11** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (Q1 on pdf p. 10; Q2–11 on pdf p. 11; see honest note on Q1 spanning pp. 10–11).

## Pedagogical Simulations (sims.js — separate script)

1. `pond` — stratification explorer (abiotic + producers + consumers + decomposers).
2. `productivity` — GPP − R = NPP slider lab.
3. `decomposition` — 5-step stepper with products (detritus → humus → inorganic nutrients).
4. `energyflow` — 10% law chain visualiser.
5. `pyramids` — number/biomass/energy builder with upright–inverted toggle.
