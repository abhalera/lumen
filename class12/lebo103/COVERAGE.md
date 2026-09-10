# COVERAGE — lebo103 Reproductive Health

**Source:** `books/originals/Class12-Biology_lebo103.pdf` (10 pdf pages, printed folio absent in source, Reprint 2026–27).
**SHA-256:** `ef03cc524d286eb3ffc225a00422ce28f3fe18ab8e622424f0b1c748b45bf9f3` (in `/tmp/opencode/bio_maps.json` key `lebo103`).
**Extraction:** PyMuPDF text layer `/tmp/opencode/bio_text/lebo103.txt` + section/exercise map `/tmp/opencode/bio_maps.json`. **pdftotext was not used.** No PNG zooms (disk nearly full).
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo103.pdf

Clinical, textbook-faithful tone. Family-planning/RCH facts as in the book. No efficacy percentages are invented — the book gives none, so all contraceptive comparisons stay qualitative.

## Honest heading notes (TOC vs in-text)

| Section | Contents page (pdf p. 1) | In-text heading | Used here |
|---|---|---|---|
| 3.1 | Reproductive Health – Problems and Strategies | REPRODUCTIVE HEALTH – PROBLEMS AND STRATEGIES | 3.1, same |
| 3.2 | Population Explosion and Birth Control | POPULATION STABILISATION AND BIRTH CONTROL (p. 43) | In-text title primary; TOC variant recorded |
| 3.3 | Medical Termination of Pregnancy | MEDICAL TERMINATION OF PREGNANCY (MTP) (pdf p. 6) | Same topic; acronym as printed |
| 3.4 | Sexually Transmitted Diseases | SEXUALLY TRANSMITTED INFECTIONS (STIs) (p. 47) | In-text title primary; TOC variant recorded; VD/RTI synonyms kept |
| 3.5 | Infertility | INFERTILITY (p. 47) | Same |

Map limits: `bio_maps.json` gives every lebo103 section as pdf p. 1 and every exercise as pdf p. 10. Lesson pdf ranges below are therefore read from the text itself (pdf p. 10 ; printed folio absent in source, where EXERCISES sit). Exercise `page`/`printPage` use the map value 10.

## Concepts

| ID | Section | PDF pp (printed) | Status |
|---|---|---|---|
| repro-health-strategies | 3.1 | 1–3 (41–43) | Complete; WHO definition, 1951 family planning → RCH, sex education, amniocentesis ban, improvement indicators |
| population-contraception | 3.2 | 3–6 (43–46) | Complete; 2B→6B→7.2B / 350M→1.2B, <2% (20/1000/yr), 18F/21M, Hum Do Hamare Do, ideal criteria, all 7 method groups, Figs. 3.1–3.4 |
| mtp | 3.3 | 6–7 (46–47) | Complete; 1971 legalisation, 45–50M (~1/5), 12-week safety, quacks, amniocentesis misuse, 2017 box (1 vs 2 RMPs, grounds i–ii) |
| stis | 3.4 | 7 (47) | Complete; 8 named STIs, curability exception (HIV/hepatitis-B/genital herpes), routes, PID etc. complications, 15–24 peak, prevention triad |
| infertility-art | 3.5 | 7–8 (47–48) | Complete; causes incl. male partner, IVF-ET/ZIFT (≤8) / IUT (>8) / GIFT / ICSI / AI-IUI, test-tube name, precision/cost limits, adoption |

Summary (pdf p. 9; printed folio absent in source) and EXERCISES (pdf p. 10; printed folio absent in source) cross-checked for the 2-year infertility threshold and all 12 stems.

## Core numbers (as printed, no invention)

| Item | Value |
|---|---|
| Family planning start | 1951, India amongst the first |
| Marriageable age | Female 18 yr, Male 21 yr |
| World population | ~2B (1900) → ~6B (2000) → 7.2B (2011) |
| India population | ~350M (independence) → ~1B (2000) → 1.2B (May 2011) |
| Growth rate 2011 | <2% = 20/1000/year |
| Fertile period | Day 10–17 |
| Lactational amenorrhoea | Effective only up to 6 months, full breast-feeding |
| Pills | 21 days from first 5 days + 7-day gap; Saheli once a week, non-steroidal (CDRI Lucknow) |
| Emergency | Within 72 hours |
| MTP scale | 45–50M/year ≈ 1/5 of conceptions; legalised 1971 |
| MTP safety/box | Relatively safe to 12 weeks; ≤12 wk one RMP; >12–<24 wk two RMPs; grounds (i)–(ii) |
| STI peak | 15–24 years |
| ART rule | ZIFT ≤8 blastomeres to tube; IUT >8 to uterus |
| Infertility | No conception after 2 years unprotected cohabitation (summary) |

## End-of-Chapter Exercises 1–12

All **12** exercises (pdf p. 10; printed folio absent in source) with verbatim stems and textbook-faithful steps in `chapter.json`: significance (1), aspects (2), sex education (3), 50-year improvement (4), explosion reasons (5), contraceptives justified (6), gonads (7), amniocentesis ban (8), ART assist (9), STD prevention (10), True/False a–d (11), corrections a–d (12).

## Pedagogical Simulations (planned keys; sims.js NOT written by this script)

1. `rch` — RCH strategy explorer: awareness · care · infrastructure (ban, immunisation, Saheli/CDRI).
2. `contraception` — method comparator: type/mechanism/book facts only, no invented percentages.
3. `mtp` — legal-window explainer: 12-week safety and 2017 one-vs-two-RMP rules with grounds.
4. `sti` — preventable/curable classifier: curable-if-early set vs HIV/hepatitis-B/genital herpes.
5. `art` — ART matcher: IVF-ET/ZIFT/IUT/GIFT/ICSI/AI-IUI by donor, count and destination.
