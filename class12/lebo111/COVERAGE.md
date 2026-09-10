# COVERAGE — lebo111 Organisms and Populations

**Source:** `books/originals/Class12-Biology_lebo111.pdf` (17 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `5b483a3ee69f88ae67b43daa8095e5e5ba6278bb1f288fb1cdcd3b02f461276f` (in `/tmp/opencode/bio_maps.json`, key `lebo111`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo111.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (disk nearly full; prose-quantitative chapter: per-capita rates, r values, Nt=N0e^rt, logistic K, Table 11.1 signs).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo111.pdf

Honest notes: (1) §11.1 Populations is the **sole top-level section** of this reprint chapter — §§11.1.1–11.1.4 are its only subdivisions (map: 11.1 → pdf p. 3; 11.1.1 → p. 4; 11.1.2 → p. 5; 11.1.3 → p. 9; 11.1.4 → p. 9), so all six lessons below sit under §11.1 by design. (2) **Table 11.1 (pdf p. 10; printed folio absent in source) is the prime sim data** — its six +/−/0 rows anchor the `interactions` sorter and recur in the `predation` and `defenses` sims. (3) The logistic equation is line-broken in extraction (dN/dt = rN(K−N)/K); the form here is reconstructed from the standard Verhulst-Pearl reading of that box. (4) Amensalism's Penicillium/Staphylococcus row follows the Table 11.1 −/0 specification. (5) Indian connects (Keoladeo/Kaziranga census, Project Tiger K, Himalayan lichens) are beyond-text context grounded in the chapter's census/density passages.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| population-attributes | 11.1, 11.1.1 | 3–5 | Complete; population definition, per-capita birth/death (lotus 0.4, fruitfly 0.1), sex ratio, Fig 11.1 pyramids, density N (cranes <10, Chlamydomonas millions, Parthenium/banyan, pug marks) |
| exponential-growth | 11.1.2 | 6–7 | Complete; Nt+1 equation, B/I/D/E, dN/dt = rN, Nt = N0e^rt, r values (rat 0.015, beetle 0.12, India 1981 0.0205), J-curve, chessboard/Paramecium |
| logistic-lifehistory | 11.1.2, 11.1.3 | 8–9 | Complete; Verhulst-Pearl dN/dt = rN(K−N)/K, sigmoid phases to K asymptote, Darwinian fitness, salmon/bamboo vs birds/mammals, oysters vs birds |
| mutualism-competition | 11.1.4 | 9–12 | Complete; Table 11.1 +/+ and −/−, lichen/mycorrhiza/fig–wasp/Ophrys, Gause, tortoise–goats, Balanus/Chathamalus, warbler partitioning |
| predation-parasitism | 11.1.4 | 10–13 | Complete; Pisaster 10 extinctions, Opuntia millions of ha + moth biocontrol, ecto/endo/brood (lice, Cuscuta, fluke, koel/crow) |
| commensalism-defenses | 11.1.4 | 11–14 | Complete; orchid/mango, barnacles/whale, egret/cattle, anemone/clownfish (+/0); Penicillium/Staphylococcus (−/0); camouflage/Monarch/thorns/Calotropis/alkaloids |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Birth rate | 20 lotus + 8 new | 0.4 per lotus per year |
| Death rate | 4 of 40 fruitflies/week | 0.1 per fruitfly per week |
| r values | Norway rat / flour beetle / India 1981 | 0.015 / 0.12 / 0.0205 |
| Doubling | Exercise 2, double in 3 yr | r = ln2/3 = 0.231 per year |
| Exponential | N0 = 100, r = 0.231, t = 6 | Nt = 400 (two doublings) |
| Logistic | r = 0.2, N = 50, K = 100 | dN/dt = 5 per year; 0 at K; max at K/2 |
| Pisaster | Starfish removal, Pacific intertidal | 10+ invertebrate extinctions within a year |
| Opuntia | Prickly pear, Australia 1920s | millions of ha; moth biocontrol |
| Table 11.1 | Six rows | +/+, −/−, +/−, +/−, +/0, −/0 |
| Ex 9 | Parasitism MCQ | (d) benefited + affected |

## End-of-Chapter Exercises 1–10

All **10** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (all on pdf p. 17; printed folio absent in source). Exercise 2 recomputes r = 0.231/yr; Exercise 8 describes the sigmoid with lag/acceleration/deceleration/K; Exercise 9 resolves to (d); Exercise 4 resolves to commensalism (+/0).

## Pedagogical Simulations (sims.js — separate script)

1. `agepyramid` — expanding/stable/declining builder (Figure 11.1 shapes).
2. `exponential` — r slider with Nt = N0e^rt curve (rat/beetle/India presets).
3. `logistic` — K slider, sigmoid and asymptote (Verhulst-Pearl).
4. `interactions` — Table 11.1 +/−/0 sorter (all six rows).
5. `predation` — keystone/biocontrol stepper (Pisaster to prickly pear moth).
6. `defenses` — camouflage/mimicry/thorn/poison matcher (Monarch, Acacia, Calotropis).
