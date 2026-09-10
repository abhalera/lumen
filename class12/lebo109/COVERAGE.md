# COVERAGE — lebo109 Biotechnology: Principles and Processes

**Source:** `books/originals/Class12-Biology_lebo109.pdf` (16 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `c30b908dca8e7166e9830ca48c376a4f0b21d63a8e05bf601a150da031c13122` (in `/tmp/opencode/bio_maps.json`, key `lebo109`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo109.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (prose-quantitative chapter).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo109.pdf

Honest note: §9.3.4's heading (“Insertion of Recombinant DNA into the Host Cell/Organism”) is split across two lines on pdf p. 13, so a line-start section survey misses it — but the full passage (competent uptake, ampicillin selection, micro-injection, gene gun, disarmed vectors) is present in the text layer and is covered in lesson 5. Second note: the pBR322 size “4361 bp” is not printed in the extracted text layer (it lives in the Figure 9.4 artwork / standard vector data); it is stated as textbook-map fact in lesson 3 and the verify fixture, consistent with the chapter spec.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| principles-first-rdna | 9.1 | 3–5 | Complete; EFB definition, two cores, ori rule, three steps, 1972 Cohen–Boyer |
| restriction-enzymes | 9.2.1 | 5–8 | Complete; 1963 enzymes, Hind II 6 bp, 900+/230+, EcoRI naming, GAATTC, sticky ends, same-enzyme rule |
| vectors-pbr322 | 9.2.2 | 8–10 | Complete; ori/marker/sites, pBR322 map (7 sites, ampR/tetR, rop), replica plating, blue-white, Ti/retrovirus |
| isolation-cutting-gel | 9.3.1, 9.3.2 | 11–12 | Complete; lysozyme/cellulase/chitinase, spooling, agarose/anode, EtBr-orange, elution, ligation |
| pcr-host-insertion | 9.3.3, 9.3.4 | 12–13 | Complete; 3 PCR steps, Taq/Thermus aquaticus, 2^30 ≈ 10^9, Ca2+ heat shock, gene gun, micro-injection |
| bioreactor-downstream | 9.3.5, 9.3.6 | 13–14 | Complete; recombinant protein, continuous culture, 100–1000 L stirred/sparged tanks, downstream chain |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| First rDNA | Cohen & Boyer, 1972 | Antibiotic-resistance gene + Salmonella typhimurium plasmid, ligase, cloned in E. coli |
| Restriction | Counts | Hind II first (6-bp site); 900+ enzymes from 230+ bacterial strains |
| EcoRI | Site | 5′-GAATTC-3′ palindrome; sticky ends; same-enzyme rule for recombinants |
| pBR322 | Map (Fig 9.4) | Hind III, EcoR I, BamH I, Sal I, Pvu II, Pst I, Cla I; ori; ampR + tetR; rop |
| Selection | Insertional inactivation | BamH I insert in tetR: amp growth, tet death; blue (intact) vs white (insert) |
| Isolation | Enzymes | Lysozyme–bacteria, cellulase–plants, chitinase–fungi; chilled ethanol ⇒ spooling |
| Gel | Rule | DNA (−) → anode; agarose (sea weeds); small ⇒ farther; EtBr + UV ⇒ orange; elution |
| PCR | Copies | N = 2^n; Taq from Thermus aquaticus; 2^30 = 1,073,741,824 ≈ 10^9 |
| Competence | Chain | Ca2+ → ice + DNA → 42 °C shock → ice; ampicillin selection |
| Bioreactor | Scale | 100–1000 L stirred-tank; sparged variant bubbles sterile air; foam/temp/pH controls |
| Downstream | Chain | Separate → purify → formulate → clinical trials → strict QC (product-specific) |

## End-of-Chapter Exercises 1–12

All **12** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (Q1–9 on pdf p. 15; Q10–12 on pdf p. 16). Computations verified: Q4 (6.6×10^9 bp × 660 Da ⇒ ≈ 7.2 pg per cell ⇒ ≈ 10^-2 M in base pairs at ~1 pL cell volume); Q7 (GAATTC, GGATCC, AAGCTT, GTCGAC, CTGCAG each equal their reverse complement). Beyond-scope flags: Q1 (ten recombinant therapeutics — internet research per NCERT), Q8 (meiosis pachytene — prior knowledge).

## Pedagogical Simulations (sims.js — separate script)

1. `rdna` — 1972 Boyer–Cohen experiment stepper (gene → plasmid → ligase → E. coli clone).
2. `restriction` — palindrome finder + EcoRI cutter (sites to fragment counts).
3. `pbr322` — vector map explorer (ori, ampR, tetR, rop, seven sites, selection logic).
4. `gel` — electrophoresis band separator (size to distance, EtBr bands, elution).
5. `pcr` — thermal cycler (denature/anneal/extend; cycles to copies by 2^n).
6. `bioreactor` — stirred-tank vs sparged tank + downstream flow (separate → QC).
