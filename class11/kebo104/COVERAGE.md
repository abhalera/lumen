# COVERAGE — kebo104 Animal Kingdom

**Source:** `books/originals/Class11-Biology_kebo104.pdf` (18 pdf pages, printed pp. 37–54, Reprint 2026–27).  
**SHA-256:** `5eed592711d3c76a97310f410ce9b8b98db904afcc4ab9b8a38f37022c96a78a` (in `output/Class11/SOURCE-MANIFEST-BIOLOGY.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kebo104.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| basis-of-classification | 4.1 | 1–4 | Complete; Levels of organisation, symmetry, germ layers, coelom types, metamerism |
| porifera-cnidaria-ctenophora | 4.2.1–4.2.3 | 4–7 | Complete; Water canal system, choanocytes, cnidocytes, metagenesis in Obelia, comb plates |
| helminths-flat-and-round | 4.2.4, 4.2.5 | 7–9 | Complete; Acoelomate Platyhelminthes, flame cells, Pseudocoelomate Aschelminthes |
| annelida-arthropoda-mollusca | 4.2.6–4.2.8 | 9–12 | Complete; Annelid metamerism, Arthropod chitin & >2/3 species, Molluscan radula |
| echinodermata-hemichordata | 4.2.9, 4.2.10 | 12–14 | Complete; Echinoderm water vascular system, Hemichordate proboscis gland & stomochord |
| chordata-and-vertebrata | 4.2.11 | 14–16 | Complete; 4 chordate hallmarks, Uro/Cephalo/Vertebrata, Cyclostomata |
| gnathostomata-classes | 4.2.11.1–4.2.11.7 | 16–18 | Complete; Chondrichthyes vs Osteichthyes, Amphibia, Reptilia, Aves, Mammalia |

## Core Worked Examples & Highlights (all zoom-verified)

| Item | Topic & Target Reference | Biological Fact / Finding |
|---|---|---|
| 4.1 | Coelom Classification | Acoelomates (Flatworms), Pseudocoelomates (Roundworms), Coelomates (Annelids+) |
| 4.2 | Metagenesis | Obelia: Polyp produces medusae asexually; Medusae form polyps sexually |
| 4.3 | Arthropod Dominance | >2/3 of all described species on Earth belong to Arthropoda |
| 4.4 | Chordates vs Vertebrates | All vertebrates are chordates, but all chordates are not vertebrates |
| 4.5 | Fish Air Bladder | Absent in Chondrichthyes (must swim); present in Osteichthyes (buoyancy) |
| 4.6 | Crocodile Heart | Unique 4-chambered heart in Reptilia |

## End-of-Chapter Exercises 4.1–4.15

All 15 exercises mapped with full step-by-step guidance in `chapter.json`. Every phylum characteristic, anatomical feature, and vertebrate diagnostic has been verified against official NCERT textbook reprint 2026–27.

## Pedagogical Simulations (sims.js)

1. `bodyplanexplorer`: 3D body plan analyzer (symmetry, diploblastic/triploblastic, coelom cross-sections).
2. `poriferacanal`: Sponge water canal current & cnidocyte stinging thread discharge simulator.
3. `coelomclassifier`: Helminth coelom architecture, flame cell osmoregulation & parasitic adaptations.
4. `arthropodaseg`: Arthropod tagmatization, chitinous exoskeleton, and molluscan radula simulator.
5. `watervascular`: Echinoderm water vascular ambulacral hydraulic system & tube foot stepping.
6. `chordateclado`: Canonical 4-chordate-hallmark anatomical explorer & Vertebrata cladogram.
7. `vertebrateheart`: Comparative vertebrate heart circulation (2, 3, and 4 chambers) & swim bladder dial.
