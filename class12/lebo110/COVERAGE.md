# COVERAGE — lebo110 Biotechnology and Its Applications

**Source:** `books/originals/Class12-Biology_lebo110.pdf` (11 pdf pages, printed folio = pdf page + 176 (verified, see correction note below), Reprint 2026-27).

**Correction (2026-09-19):** an earlier pass wrongly recorded this chapter as folio-absent. Verified directly against the PDF: the printed folio appears as the first extracted text line on almost every page (only the chapter-opener page lacks one). Confirmed printed = 1-based PDF page + 176 across 3 independent anchor points with zero deviation. `printPage` on every exercise and `print` on every lesson now hold the real printed folio.
**SHA-256:** `4da2923c699b97a1930ae6b1072bf75fb5b0429d724ead7ba06510f98730b826` (in `/tmp/opencode/bio_maps.json`, key `lebo110`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo110.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (prose-quantitative chapter: chain counts, cry-gene table, years, 2.4 g/L, percentages).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo110.pdf

Honest notes: (1) `bio_maps.json` section pages are coarse — §§10.1/10.2/10.3/10.4 all sit at pdf p. 1 (chapter-opener TOC level); only §§10.2.1 (p. 5), 10.2.2 and 10.2.3 (p. 6) are content-precise — so lessons below use actual content pdf pp. 2–9. (2) Exercises span pdf pp. 10–11 with the **SUMMARY box interrupting Exercise 4**: Q1–Q4 stems open on pdf p. 10 (printed folio = pdf page + 176 (verified, see correction note below)) while Q4 options (a)–(d) continue on pdf p. 11 (printed folio = pdf page + 176 (verified, see correction note below)) after the SUMMARY; Q5–Q13 are on pdf p. 11. Exercise pages in `chapter.json` follow the map (Q1–Q4 → 10, Q5–Q13 → 11). (3) Q9 stem keeps the textbook spelling “Digrammatically”. (4) The reprint names α-1-antitrypsin sheep without “Tracy”/1990 — that name/year is standard companion detail, flagged in the lesson. (5) Indian connects (Bt cotton belts, GM-mustard debate, turmeric/neem revocations) are beyond-text context grounded in the chapter's GEAC/biopiracy passages.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| tissue-culture | 10.1 | 2–3 | Complete; totipotency/explant, medium recipe, micropropagation/somaclones, meristem rescue (banana/sugarcane/potato), somatic hybridisation/pomato |
| bt-rnai | 10.1 | 3–4 | Complete; GMO benefits (i)–(v) + golden rice, Bt protoxin activation, cryIAc/cryIIAb (bollworm) / cryIAb (corn borer), RNAi vs Meloidegyne incognitia |
| insulin-genetherapy | 10.2.1, 10.2.2 | 5–6 | Complete; 30/12 therapeutics, A21/B30/C33, 1983 Eli Lilly E. coli assembly, 1990 ADA therapy (age 4, retroviral lymphocytes) |
| diagnosis-transgenic | 10.2.3, 10.3 | 6–8 | Complete; PCR/probe/ELISA, >95% mice, Tracy (companion) + Rosie 1997 2.4 g/L, polio-vaccine and toxicity testing |
| ethics-biopiracy | 10.4 | 8–9 | Complete; GEAC mandate, 200,000 rice / 27 Basmati / 1997 US patent, turmeric/neem, biopiracy definition, Patents Bill amendment |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Insulin | Chains (Fig. 10.3) | A 21 aa + B 30 aa = 51 mature; + C 33 = 84 proinsulin; disulphide-linked |
| Insulin | Manufacture | 1983 Eli Lilly; A-DNA + B-DNA in E. coli plasmids; separate chains joined |
| Therapy | Counts | ~30 recombinant therapeutics approved; 12 marketed in India |
| ADA | First gene therapy | 1990; 4-year-old girl; retroviral ADA cDNA into cultured lymphocytes (periodic) |
| Bt | Genes | cryIAc + cryIIAb → cotton bollworms; cryIAb → corn borer; alkaline-gut activation |
| RNAi | Nematode | Meloidegyne incognitia; Agrobacterium; sense + anti-sense → dsRNA → silencing |
| Transgenic | Share | >95% are mice; models: cancer, cystic fibrosis, rheumatoid arthritis, Alzheimer’s |
| Rosie | Cow 1997 | Human alpha-lactalbumin milk 2.4 g/L (600 mg per 250 mL glass) |
| Rice | Diversity | ~200,000 Indian varieties; 27 Basmati; US patent 1997 (functional equivalents) |
| Biopiracy | Definition | Bio-resource use without authorisation and without compensatory payment |

## End-of-Chapter Exercises 1–13

All **13** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (Q1–Q4 on pdf p. 10 with Q4 options continuing past the SUMMARY onto p. 11; Q5–Q13 on pdf p. 11). Beyond-scope flags: Q9 spelling kept verbatim; Q10 (no single key); Q11 (internet detail); Q13 (internet detail).

## Pedagogical Simulations (sims.js — separate script)

1. `tissueculture` — explant-to-plantlet stepper (media, meristem, somaclones).
2. `btcotton` — cry gene to pest-mortality explorer (bollworm, corn borer, nematode).
3. `insulin` — proinsulin-to-mature-insulin chain remover (A/B/C).
4. `genetherapy` — ADA lymphocyte timeline companion (1990 protocol steps).
5. `diagnosis` — PCR vs ELISA vs probe matcher companion.
6. `transgenic` — Rosie/Tracy trait explorer (2.4 g/L, α-1-antitrypsin).
7. `ethics` — biopiracy case sorter + GEAC approval explorer.
