# COVERAGE — lebo108 Microbes in Human Welfare

**Source:** `books/originals/Class12-Biology_lebo108.pdf` (12 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `e96d234eab38ed70616c77101aedeaf4efa7d92ea8aececeb046d383061f63b7` (in `/tmp/opencode/bio_maps.json`, key `lebo108`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo108.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (prose-quantitative chapter).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo108.pdf

Honest note: the TOC (pdf p. 1) lists §8.2 once as “Microbes in Industrial Products”, while the body text splits it into three in-text subsections — §8.2.1 Fermented Beverages, §8.2.2 Antibiotics and §8.2.3 Chemicals, Enzymes and other Bioactive Molecules. Lessons 2–3 follow the in-text split (§8.2.1+§8.2.2, then §8.2.3).

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| household-ferment | 8.1 | 3 | Complete; LAB curd + B12, idli/dosa CO2, baker's yeast, toddy, Swiss holes (P. sharmanii), Roquefort fungi |
| beverage-antibiotic | 8.2.1, 8.2.2 | 4–5 | Complete; fermentors, brewer's yeast, distillation rule, Fleming → Chain/Florey → 1945 Nobel, kali khansi/gal ghotu/kusht rog |
| chemical-enzyme | 8.2.3 | 5 | Complete; 4 acid producers, ethanol yeast, lipase/pectinase/streptokinase, cyclosporin-A (Trichoderma), statins (Monascus) |
| sewage-bod | 8.3 | 5–7 | Complete; primary physical vs secondary flocs, BOD definition, activated sludge loop, digesters, Ganga/Yamuna Action Plans |
| biogas-biocontrol | 8.4, 8.5 | 7–9 | Complete; methanogens/Methanobacterium, 10–15 ft KVIC plant (IARI), ladybird/dragonflies, Bt + Bt-cotton, Trichoderma, NPV |
| biofertiliser | 8.6 | 9–10 | Complete; Rhizobium/Azospirillum/Azotobacter, Glomus mycorrhiza (P), Anabaena/Nostoc/Oscillatoria in paddy |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Curd | LAB starter | Millions of LAB; acids coagulate + partly digest protein; vitamin B12 up |
| Dough | Gas | CO2 puffs idli/dosa (bacteria) and bread (S. cerevisiae) |
| Cheese | Holes vs flavour | Swiss holes: Propionibacterium sharmanii CO2; Roquefort: ripening fungi |
| Fermentation | Equation | C6H12O6 → 2C2H5OH + 2CO2; 180 g glucose → 92 g ethanol + 88 g CO2 |
| Distillation | Rule | Wine/beer: none; whisky/brandy/rum: distilled |
| Antibiotic | Chain | Fleming (Penicillium notatum) → Chain/Florey → WWII use → Nobel 1945 |
| Acids | Pairs | A. niger–citric; Acetobacter aceti–acetic; C. butylicum–butyric; Lactobacillus–lactic |
| Bioactives | Q12 | Cyclosporin A: Trichoderma polysporum; Statins: Monascus purpureus |
| BOD | Definition | O2 to oxidise all organics in 1 L; Q11: C 400 sewage, A 20 effluent, B 8 river; 95% cut |
| Sludge | Loop | Activated sludge: part back as inoculum; rest → digesters → CH4 + H2S + CO2 |
| Biogas | Plant | 10–15 ft tank; floating cover; pipe to houses; spent slurry fertiliser; IARI + KVIC |
| Biocontrol | Pairs | Ladybird–aphids; dragonfly–mosquitoes; Bt–caterpillars; Trichoderma–root pathogens; NPV (Nucleopolyhedrovirus) target-only |
| Biofertiliser | Q15 | Rhizobium/Azospirillum/Azotobacter (N); Glomus (P); Anabaena/Nostoc/Oscillatoria (paddy) |

## End-of-Chapter Exercises 1–15

All **15** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (Q1–11 on pdf p. 11; Q12–15 on pdf p. 12). Beyond-scope flags: Q4 (bhatura/dhokla standard examples), Q6 (second fungus Cephalosporium), Q13(a) SCP, Q14 (ranking is judgement-based).

## Pedagogical Simulations (sims.js — separate script)

1. `ferment` — curd/bread/beverage fermentor explorer (starter, temperature, CO2).
2. `antibiotic` — Fleming → Chain/Florey timeline plus source matcher.
3. `bioactive` — chemical-to-microbe matcher (citric/acetic/butyric/statin/cyclosporin).
4. `sewage` — primary vs secondary stepper plus BOD slider (8/20/400).
5. `biogas` — gobar-gas plant flow simulator (slurry → holder → fertiliser).
6. `biocontrol` — pest-to-agent matcher (companion to lesson 5).
7. `biofertiliser` — crop-to-microbe matcher including paddy cyanobacteria.
