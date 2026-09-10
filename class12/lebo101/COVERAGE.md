# COVERAGE — lebo101 Sexual Reproduction in Flowering Plants

**Source:** `books/originals/Class12-Biology_lebo101.pdf` (25 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `039bad8cf195a93b90fa7857eda95f39bdd4fd278b3c8bced235f3b6cd71c25c` (in `/tmp/opencode/bio_maps.json`, key `lebo101`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo101.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo101.pdf

Honest note: in this reprint's body text the §1.4 POST-FERTILISATION heading (with the endosperm opener) prints on the same page before the §1.3 DOUBLE FERTILISATION text; the TOC order 1.3 then 1.4 is retained in the Concepts table below.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| flower-whorls | 1.1, 1.2 | 3–4 | Complete; whorls, floral primordium, androecium/gynoecium |
| stamen-pollen | 1.2.1 | 5–8 | Complete; dithecous anther, 4 wall layers, microsporogenesis, pollen wall/stages/viability |
| pistil-embryosac | 1.2.2 | 8–11 | Complete; ovule parts, MMC meiosis, monosporic 7-celled 8-nucleate sac |
| pollination | 1.2.3 | 11–17 | Complete; autogamy/geitonogamy/xenogamy, chasmogamy/cleistogamy, wind/water/animal agents, outbreeding devices, pollen–pistil interaction, emasculation + bagging |
| double-fertilisation | 1.3 (+tube path 1.2.3) | 16–18 | Complete; syngamy 2n + triple fusion 3n PEN, unique to angiosperms |
| post-fertilisation | 1.4–1.4.3 | 18–22 | Complete; free-nuclear/cellular endosperm, dicot vs grass embryo, seed/fruit fates, false vs parthenocarpic fruits |
| apomixis-polyembryony | 1.5 | 22–23 | Complete; apomixis routes, Citrus/mango polyembryony, hybrid-seed importance |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Anther | Dithecous, tetragonal | 4 microsporangia; wall layers 4 (epidermis, endothecium, middle, tapetum) |
| Pollen grain | Male gametophyte | 25–50 µm; exine sporopollenin + germ pores; intine cellulose/pectin |
| Shed stage | 2-celled vs 3-celled | 2-celled in >60% angiosperms; 3-celled carries 2 male gametes |
| Viability | Cereals vs others | Rice/wheat ~30 min; Rosaceae/Leguminosae/Solanaceae months; banks at −196 °C |
| Embryo sac | Monosporic, mature | 8-nucleate, 7-celled: egg apparatus (2 synergids + egg) + 3 antipodals + central cell (2 polar nuclei) |
| Ploidy line | MMC meiosis | Nucellus 2n, MMC 2n, functional megaspore n, sac n |
| Water pollination | Rare | ~30 genera, mostly monocots (Vallisneria surface; Zostera submerged ribbon pollen) |
| Outbreeding | Devices | Non-synchrony, separation, self-incompatibility, monoecy (castor/maize), dioecy (papaya) |
| Fusions | Double fertilisation | Syngamy n+n → zygote 2n; triple fusion n+n+n → PEN 3n |
| Endosperm | Order + coconut | Free-nuclear → cellular; coconut water = free-nuclear, kernel = cellular |
| Seed | Moisture, longevity | 10–15% moisture; Lupinus arcticus ~10,000 yr; date palm ~2,000 yr |
| Fates | Ovary/ovule/integument/nucellus | Fruit+pericarp / seed / testa / perisperm (black pepper, beet) |
| Fruits | False vs seedless | False: apple, strawberry, cashew (thalamus); parthenocarpic: banana |
| Apomixis | Clones + hybrids | Citrus/mango nucellar polyembryony; apomicts fix hybrid traits, no segregation |

## End-of-Chapter Exercises 1–18

All **18** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (Q1–6 on pdf p. 24; Q7–18 on pdf p. 25).

## Pedagogical Simulations (sims.js — separate script)

1. `flowerparts` — whorl toggles (androecium/gynoecium).
2. `pollenlab` — microsporogenesis stepper (sporogenous tissue → PMC → tetrad → pollen grain).
3. `embryosac` — 7-celled 8-nucleate labelled builder.
4. `pollination` — agent explorer (wind/water/insect) + chasmogamy/cleistogamy.
5. `fertilisation` — double-fertilisation stepper (syngamy + triple fusion).
6. `seedfruit` — seed/fruit fate mapper (ovary→fruit, ovule→seed, integuments→testa).
7. `apomixis` — apomixis vs polyembryony comparator.
