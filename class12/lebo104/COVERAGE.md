# COVERAGE — lebo104 Principles of Inheritance and Variation

**Source:** `books/originals/Class12-Biology_lebo104.pdf` (28 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `d5f14fc2248860c029ab10aec2687165ed84d54917c10cd44057574f1c4bb456` (in `/tmp/opencode/bio_maps.json`, key `lebo104`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo104.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo104.pdf

Honest note (TOC vs in-text numbering): the chapter-opening contents panel (pdf p. 3) lists only six entries — 4.1 Mendel's Laws, 4.2 One Gene, 4.3 Two Genes, 4.4 Sex Determination, 4.5 Mutation, 4.6 Genetic Disorders. The body text instead numbers the middle matter as 4.4 Polygenic Inheritance, 4.5 Pleiotropy and 4.6 Sex Determination (with 4.6.1 humans, 4.6.2 honey bee), then 4.7 Mutation and 4.8 Genetic Disorders (4.8.1 pedigree, 4.8.2 Mendelian, 4.8.3 chromosomal), with 4.2.1/4.2.2 (dominance/segregation, incl. incomplete dominance and co-dominance boxes) and 4.3.1/4.3.2/4.3.3 (independent assortment, chromosomal theory, linkage/recombination). The Concepts table below follows the in-text numbering; the `/tmp/opencode/bio_maps.json` section map records the same fine-grained in-text sections.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| mendel-one-gene | 4.1, 4.2, 4.2.1, 4.2.2 (+boxes) | 4–11 | Complete; 1856-1863, 14 lines, 7 traits, 3:1/1:2:1, Punnett, test cross 1:1, snapdragon 1:2:1, ABO 6 genotypes |
| two-genes | 4.3, 4.3.1 | 12–14 | Complete; RRYY x rryy, 4 gametes at 1/4, 9:3:3:1 = (3:1)x(3:1), 9 genotype classes |
| chromosomal-linkage | 4.3.2, 4.3.3 | 14–18 | Complete; 1865/1900/de Vries-Correns-Tschermak, Sutton-Boveri 1902, Morgan Drosophila 1.3%/37.2%, Sturtevant maps |
| polygenic-pleiotropy | 4.4, 4.5 | 19 | Complete; A/B/C additive 0-6 doses, AABBCC/aabbcc endpoints; phenylketonuria triad |
| sex-determination | 4.6, 4.6.1, 4.6.2 | 19–21 | Complete; Henking 1891 X body; XO/XY/ZW; human 22+XX/XY 50/50; bee 32/16 mitosis |
| mutation | 4.7 | 22 | Complete; point GAG->GUG, frame-shift indels, UV mutagen, aneuploidy/polyploidy preview |
| pedigree-mendelian | 4.8, 4.8.1, 4.8.2 | 22–25 | Complete; pedigree symbols; haemophilia/colour-blindness X-linked; sickle/thalassemia/PKU autosomal; GAG->GUG, HBA1/HBA2 chr16, HBB chr11 |
| chromosomal-disorders | 4.8.3 | 25–26 | Complete; 46 baseline; Down 47 trisomy 21; Turner 45 XO; Klinefelter 47 XXY |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Mendel | Programme | 1856-1863, 14 true-breeding lines, 7 trait pairs, statistics + successive generations |
| Monohybrid | Ratios | F1 all Tt tall; F2 3:1 phenotype, 1:2:1 genotype = (1/2T+1/2t) squared |
| Test cross | 1:1 rule | Tt x tt -> 1:1; TT x tt -> all dominant (Fig. 4.5 violet V x white v) |
| Non-Mendelian | Variants | Snapdragon Rr pink, F2 1:2:1; ABO IA/IB/i, 6 genotypes, 4 phenotypes; starch-grain relativity |
| Dihybrid | 9:3:3:1 | RRYY x rryy -> RrYy; gametes RY/Ry/rY/ry at 1/4; 9 genotype classes |
| Theory | Chromosomes | 1865/1900 rediscovery; Sutton-Boveri 1902; Morgan Drosophila verification (2-week cycle) |
| Linkage | Morgan % | White-yellow 1.3% (tight) vs white-miniature 37.2% (loose); Sturtevant distance = frequency |
| Polygenic | Skin colour | AABBCC darkest, aabbcc lightest, AaBbCc x AaBbCc -> 1/64 extremes; 2^3 = 8 gametes |
| Pleiotropy | One->many | Phenylalanine hydroxylase loss -> retardation + light hair/skin |
| Sex | Systems | XO grasshopper; XY man/Drosophila (male heterogamety); ZW birds (female heterogamety); bee 32/16 haplodiploid |
| Mutation | Scales | Point GAG->GUG Glu->Val codon 6; indel frame-shift; UV mutagen; cancer-cell aberrations |
| Mendelian | Disorders | Colour blindness 8% M / 0.4% F, son of carrier 50%; haemophilia carrier->son, Queen Victoria; HbSHbS only |
| Thalassemia | Genes | Alpha HBA1/HBA2 chr16 (four genes); beta HBB chr11; quantitative vs sickle qualitative |
| Counts | Karyotypes | Normal 46 (22 pairs + XX/XY); Down 47 (+21); Turner 45 (XO); Klinefelter 47 (XXY) |

## End-of-Chapter Exercises 1–16

All **16** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (all on pdf p. 28; printed folio absent in source).

## Pedagogical Simulations (sims.js — separate script)

1. `punnett1` — monohybrid Punnett: choose parental genotypes (TT/Tt/tt).
2. `punnett2` — dihybrid 9:3:3:1 grid (RrYy x RrYy).
3. `linkage` — parental vs recombinant % explorer (1.3% vs 37.2%).
4. `polygenic` — bell-curve skin-colour dose adder (A/B/C).
5. `pedigree` — symbol builder + autosomal/X-linked classifier.
6. `sexdetermination` — XX-XY / haplodiploidy / ZW switcher.
7. `karyotype` — Down/Turner/Klinefelter chromosome counter (47/45/47).
8. `bloodgroup` — ABO cross solver for Ex 12 (IA/IB/i).
