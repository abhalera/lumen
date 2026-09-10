# COVERAGE — kebo101 The Living World

**Source:** `books/originals/Class11-Biology_kebo101.pdf` (9 pdf pages, printed pp. 1–9, Reprint 2026–27).  
**SHA-256:** `e6b49c5eb878864ef1bd714799588fbf2f55afb30d72cac25e08bc5eab7778fd` (in `output/Class11/SOURCE-MANIFEST-BIOLOGY.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/kebo101.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| living-diversity-biodiversity | 1.1 | 1–4 | Complete; 1.7–1.8M biodiversity, Ernst Mayr, biological species concept |
| binomial-nomenclature | 1.1 | 4–5 | Complete; Linnaeus, ICBN, ICZN, Latinization, italicization, author citation |
| taxonomy-systematics | 1.1 | 5–6 | Complete; Taxa, 4 processes of taxonomy, systematics, Systema Naturae, phylogeny |
| species-genus | 1.2.1, 1.2.2 | 6–7 | Complete; Fundamental unit, Panthera (leo, tigris, pardus), Solanum (tuberosum, nigrum, melongena) |
| family-order | 1.2.3, 1.2.4 | 7–8 | Complete; Solanaceae & Convolvulaceae in Polymoniales; Felidae & Canidae in Carnivora |
| class-phylum-kingdom | 1.2.5–1.2.7 | 7–8 | Complete; Mammalia, Chordata vs Division, Animalia, decreasing traits with ascending rank |
| taxonomic-hierarchy-table | 1.2, Table 1.1 | 8–9 | Complete; Man, Housefly, Mango, Wheat comprehensive taxonomic lineages |

## Core Worked Examples & Highlights (all zoom-verified)

| Item | Topic & Target Reference | Biological Fact / Finding |
|---|---|---|
| 1.1 | Ernst Mayr Triple Crown | Balzan (1983), International Prize (1994), Crafoord (1999) |
| 1.2 | Described Species Count | 1.7 to 1.8 million species described to date |
| 1.3 | Binomial Case Rule | Genus capitalized, specific epithet strictly lowercase (*Mangifera indica*) |
| 1.4 | Table 1.1 Housefly | Musca domestica, Muscidae, Diptera, Insecta, Arthropoda |
| 1.5 | Table 1.1 Mango | Mangifera indica, Anacardiaceae, Sapindales, Dicotyledonae, Angiospermae |
| 1.6 | Table 1.1 Wheat | Triticum aestivum, Poaceae, Poales, Monocotyledonae, Angiospermae |

## End-of-Chapter Exercises 1.1–1.10

All 10 exercises mapped with full step-by-step guidance in `chapter.json`. Every biological definition and taxonomic lineage has been independently verified against the official NCERT textbook reprint 2026–27.

## Pedagogical Simulations (sims.js)

1. `biodiversitymap`: Interactive latitudinal diversity gradient & species catalog explorer with biome richness curves.
2. `binomialnamer`: Linnaean nomenclature editor, case and italicization validator, and author citation formatter.
3. `taxasorter`: Multi-level Taxon sorting workbench with nested Venn diagram and rank category mapper.
4. `speciesconcept`: Speciation and reproductive isolation simulator with geographic barrier and gene flow controls.
5. `familyorderlab`: Floral & anatomical trait comparison matrix for Solanaceae/Convolvulaceae and Felidae/Canidae.
6. `taxonomichierarchy`: 7-rank inverted pyramid simulator modeling character specificity vs generality trends.
7. `tableexplorer`: Master NCERT Table 1.1 comparator with side-by-side lineage breakdown for Man, Housefly, Mango, and Wheat.
