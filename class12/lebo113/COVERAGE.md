# COVERAGE — lebo113 Biodiversity and Conservation

**Source:** `books/originals/Class12-Biology_lebo113.pdf` (13 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `d4587f07dd122d19493a66fb2aae6f11ae02ef9124dea92634b524f078f20faa` (in `/tmp/opencode/bio_maps.json`, key `lebo113`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo113.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (prose-quantitative chapter).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo113.pdf

Honest notes: the §13.1.1 heading (“How Many Species are there on Earth and How Many in India?”) line-wraps across two text lines on pdf p. 2; lessons keep the TOC section label. Exercises span two pages — Q1–2 on pdf p. 11 (printed folio absent in source), Q3–10 on pdf p. 12 (printed folio absent in source) — and the `page` field records the pdf page of each stem.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| levels-counts | 13.1, 13.1.1 | 1–4 | Complete; Wilson term, 3 levels (Rauwolfia/rice/mango, W. Ghats amphibians, India vs Norway), IUCN 1.5M, May ~7M, 70% insects, 2.4%/8.1%, 45,000 + 2× animals |
| patterns-diversity | 13.1.2 | 4–5 | Complete; latitudinal gradient (Colombia 1,400 / NY 105 / Greenland 56; Amazon counts), 3 tropic hypotheses, Humboldt, log S = log C + Z log A, Z 0.1–0.2 / 0.6–1.2 (1.15) |
| loss-evil-quartet | 13.1.3, 13.1.4 | 5–8 | Complete; Tilman plots, rivet-popper Ehrlich, 784 = 338 + 359 + 87, dodo/quagga/thylacine/sea cow/tiger subspecies, 100–1,000× Sixth Extinction, Evil Quartet with Indian weeds + catfish |
| why-conserve | 13.2.1 | 8–9 | Complete; narrow (>25% drugs, 25,000 traditional, bioprospecting), broad (Amazon 20% O₂, pollinators, bulbul), ethical (intrinsic value, future generations) |
| how-conserve | 13.2.2 | 9–11 | Complete; in situ vs ex situ, 25 + 9 = 34 hotspots (3 in India), 14/90/448 + sacred groves (4 belts), cryo/IVF/tissue-culture/seed banks, Rio 1992 + Johannesburg 2002 → 2010 |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Levels | Three | Genetic (Rauwolfia reserpine; 50,000 rice; 1,000 mango), species (W. Ghats amphibians), ecological (India biomes vs Norway) |
| Described | IUCN 2004 | Slightly more than 1.5 million; extremes 20–50M; May ~7M (≈22% recorded) |
| Split | Animals vs plants | >70% animals; plants ≤22%; insects >70% of animals (7 in 10); fungi > fishes + amphibians + reptiles + mammals |
| India | Share | 2.4% land → 8.1% species; 12 mega-diversity; 45,000 plants + 2× animals; >1,00,000 plants + >3,00,000 animals undiscovered |
| Latitude | Birds | Colombia ~1,400; New York 105; Greenland 56; India >1,200; Ecuador 10× Midwest USA |
| Amazon | Counts | 40,000 plants; 3,000 fishes; 1,300 birds; 427 mammals; 427 amphibians; 378 reptiles; >1,25,000 invertebrates; ≥2M insects waiting |
| Area | Equation | log S = log C + Z log A; Z 0.1–0.2 local; 0.6–1.2 continental; 1.15 frugivores; doubling → 2^Z (≈2.22 vs ≈1.11) |
| Function | Tilman + Ehrlich | Less biomass variation + higher productivity; rivet-popper (wings vs seats) |
| Toll | Red List 2004 | 784 = 338 vertebrates + 359 invertebrates + 87 plants; dodo/quagga/thylacine/sea cow/Bali-Javan-Caspian tiger; 27 in 20 yrs |
| Threat | Shares | >15,500 threatened (>650 India per Summary); 12% birds, 23% mammals, 32% amphibians, 31% gymnosperms |
| Rate | Sixth Extinction | 100–1,000× pre-human; ~50% of species in 100 years at current trends |
| Quartet | Causes | Habitat loss/fragmentation (14%→6%; 1,000 ha/chapter; Amazon lungs) + over-exploitation + alien invasion (Nile perch 200+ cichlids; Parthenium/Lantana/Eichhornia; Clarias) + co-extinction |
| Why | Numbers | >25% drugs from plants; 25,000 traditional-medicine species; Amazon 20% O₂ |
| How | Estate | 14 biosphere reserves, 90 national parks, 448 sanctuaries (>450 per Summary); groves: Khasi–Jaintia, Aravalli, W. Ghats, Sarguja–Chanda–Bastar |
| Summits | Timeline | Rio Earth Summit 1992 (CBD) → Johannesburg 2002 (190 countries) → 2010 reduction pledge |

## End-of-Chapter Exercises 1–10

All **10** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (Q1–2 on pdf p. 11; Q3–10 on pdf p. 12). Exercise 10 (deliberate extinction) is judgement-based; the solution follows the chapter's own narrowly-utilitarian + human-ethical framing.

## Pedagogical Simulations (sims.js — separate script)

1. `diversity` — 3-level explorer (Rauwolfia/rice/mango, Ghats amphibians, biomes) + species counters (70%, 2.4%/8.1%, 1.5M→7M).
2. `speciesarea` — log S curve with Z slider 0.1–1.2 (local vs continental presets, 2^Z doubling readout).
3. `evilquartet` — 4-threat sorter with Indian examples (Parthenium/Lantana/Eichhornia, Clarias, tiger subspecies).
4. `whyconserve` — 3-reason value explorer (drugs/oxygen/pollination/bulbul pricing).
5. `conserve` — in situ vs ex situ matcher + hotspot map (34, 3 in India) + summit timeline (1992 → 2002 → 2010).
