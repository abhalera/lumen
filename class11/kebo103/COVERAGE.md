# COVERAGE — kebo103 Plant Kingdom

**Source:** `books/originals/Class11-Biology_kebo103.pdf` (14 pdf pages, printed pp. 23–36, Reprint 2026–27).  
**SHA-256:** `fefd9d98cd6dc4155aa8b7706f0db887c8f2017dd9cef26bcb049a085c871e9b` (in `output/Class11/SOURCE-MANIFEST-BIOLOGY.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kebo103.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| algae-classification | 3.1, Table 3.1 | 1–4 | Complete; Chlorophyceae, Phaeophyceae, Rhodophyceae, Table 3.1 matrix |
| bryophytes-liverworts-mosses | 3.2 | 4–7 | Complete; Amphibians of plant kingdom, Marchantia gemma cups, Funaria/Sphagnum |
| pteridophytes-vascular-pioneers | 3.3 | 7–9 | Complete; First vascular cryptogams, sporophyte dominant, microphylls vs macrophylls, prothallus |
| heterospory-seed-habit | 3.3 | 8–9 | Complete; Selaginella/Salvinia, microspores vs megaspores, precursor to seed habit |
| gymnosperms-naked-seeds | 3.4 | 9–11 | Complete; Naked seeds, Sequoia, Pinus mycorrhiza, Cycas coralloid roots, cones |
| angiosperms-double-fertilization | 3.5 | 11–13 | Complete; Flowers, enclosed ovules, syngamy + triple fusion, 3n PEN, 7-celled 8-nucleate sac |
| plant-lifecycles-alternation | 3.6 | 13–14 | Complete; Haplontic (Volvox), Diplontic (Fucus, seed plants), Haplodiplontic (bryophytes/pteridophytes) |

## Core Worked Examples & Highlights (all zoom-verified)

| Item | Topic & Target Reference | Biological Fact / Finding |
|---|---|---|
| 3.1 | Algae Table 3.1 | Pigments, stored food, cell wall & flagella for 3 algal classes |
| 3.2 | Gemma Cup | Asexual multicellular green buds on dorsal Marchantia thallus |
| 3.3 | Heterospory Genera | Selaginella and Salvinia produce microspores and megaspores |
| 3.4 | Gymnosperm Symbionts | Pinus mycorrhiza; Cycas coralloid roots with N₂-fixing cyanobacteria |
| 3.5 | Double Fertilization | Syngamy (zygote 2n) + Triple Fusion (PEN 3n) unique to angiosperms |
| 3.6 | Algal Lifecycle Exceptions | Fucus is diplontic; Ectocarpus and Polysiphonia are haplodiplontic |

## End-of-Chapter Exercises 3.1–3.11

All 11 exercises mapped with full step-by-step guidance in `chapter.json`. Every plant division comparison, ploidy deduction, and life cycle transition has been independently verified against official NCERT textbook reprint 2026–27.

## Pedagogical Simulations (sims.js)

1. `algaepigmentlab`: Pigment spectra, flagellar insertion, and hydrocolloid yield analyzer for 3 algal classes.
2. `bryophytelifecycle`: Bryophyte gametophyte-sporophyte connection and gemma cup splash cup simulator.
3. `pteridophytestele`: Pteridophyte vascular stele and prothallus fertilization water-drop simulation.
4. `heterosporylab`: Homospory vs heterospory evolutionary transition & seed habit retention workbench.
5. `gymnospermcone`: Gymnosperm male/female cone anatomy, Pinus needle, and anemophilous pollination.
6. `angiospermdoublefert`: 7-celled 8-nucleate embryo sac, syngamy, and triple fusion animation.
7. `lifecyclesim`: Comparative Haplontic, Diplontic, and Haplodiplontic life cycle wheel with ploidy tracker.
