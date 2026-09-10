# COVERAGE — kebo102 Biological Classification

**Source:** `books/originals/Class11-Biology_kebo102.pdf` (13 pdf pages, printed pp. 10–22, Reprint 2026–27).  
**SHA-256:** `7952d430151a776694c6c58518c332d20ff76f9758ccf44d8b1a7fe29fef36c9` (in `output/Class11/SOURCE-MANIFEST-BIOLOGY.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kebo102.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| five-kingdom-system | 2.1, Table 2.1 | 1–3 | Complete; Aristotle, Linnaeus, Whittaker 1969 Five Kingdoms & criteria |
| kingdom-monera | 2.1 | 3–5 | Complete; Archaebacteria (halophiles, methanogens), Eubacteria, Cyanobacteria, Mycoplasma |
| kingdom-protista | 2.2.1–2.2.3 | 5–6 | Complete; Chrysophytes (diatoms, silica frustule), Dinoflagellates (red tides), Euglenoids |
| slime-moulds-protozoans | 2.2.4, 2.2.5 | 6–7 | Complete; Slime moulds (plasmodium), Protozoans (Amoeboid, Flagellated, Ciliated, Sporozoans) |
| kingdom-fungi | 2.3 | 7–9 | Complete; Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes |
| kingdoms-plantae-animalia | 2.4, 2.5 | 9–10 | Complete; Alternation of generations, insectivorous plants, holozoic nutrition |
| viruses-viroids-prions-lichens | 2.6 | 10–13 | Complete; Ivanovsky, Beijerinck, Stanley, Diener viroids, Prions, Lichens |

## Core Worked Examples & Highlights (all zoom-verified)

| Item | Topic & Target Reference | Biological Fact / Finding |
|---|---|---|
| 2.1 | Whittaker Five Kingdoms | Monera, Protista, Fungi, Plantae, Animalia (1969) |
| 2.2 | Diatomaceous Earth | Amorphous silica cell walls, indestructible soap-box frustules |
| 2.3 | Red Tides Organism | Rapid multiplication of red dinoflagellates (Gonyaulax) |
| 2.4 | Mycoplasma Size | Smallest living cells (0.3 µm) lacking cell wall |
| 2.5 | Contagium Vivum Fluidum | M.W. Beijerinck (1898) infectious living fluid |
| 2.6 | Viroids Discovery | T.O. Diener (1971) potato spindle tuber disease |

## End-of-Chapter Exercises 2.1–2.12

All 12 exercises mapped with full step-by-step guidance in `chapter.json`. Every biological definition and classification comparison has been verified against official NCERT textbook reprint 2026–27.

## Pedagogical Simulations (sims.js)

1. `fivekingdoms`: Interactive Five Kingdom matrix & phylogenetic branch comparison.
2. `bacterialmorphology`: Bacterial shapes, Gram stain, and Archaea extremophile membrane simulator.
3. `protistalab`: Diatom frustule assembly, dinoflagellate red tide bloom, and Euglena mixotrophy.
4. `protozoanlab`: Protozoan motility and phagocytosis workbench (ciliated, flagellated, amoeboid).
5. `fungallifecycle`: Dikaryophase ($n+n$), ascus/basidium spore orientation, and class comparator.
6. `alternationofgen`: Haplodiplontic life cycle wheel with gametophyte and sporophyte tracking.
7. `virallab`: Bacteriophage T4 anatomy, viroid RNA vs prion protein misfolding, and lichen bioindicator.
