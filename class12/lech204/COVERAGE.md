# COVERAGE — lech204 Amines

**Source:** `books/originals/Class12-Chemistry-Pt2_lech204.pdf` (22 pdf pages, printed pp. 259–280, Reprint 2026–27).  
**SHA-256:** `a267ffea998fb68174c2abc87f79a71e646e93460efa73bbe15796a995cea29a` (`output/Class12/CHEM-SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/lech204.pdf

Unit 9 of Chemistry Part II. Polymers and Chemistry in Everyday Life are **not** in this rationalised book and were not restored.

## Lessons (7)

| ID | Section | Print pp | PDF pp | Sim | Status |
|---|---|---|---|---|---|
| structure-class-nomen | 9.1–9.3 | 259–261 | 1–3 | `amineclass` | Complete; Fig. 9.1 108°; Table 9.1; Intext 9.1 structures |
| preparation | 9.4 | 262–264 | 4–6 | `preplab` | Complete; Hoffmann equation (4 NaOH); Gabriel aryl-X block; Ex 9.1–9.2 |
| physical | 9.5 | 265–266 | 7–8 | `hbondbp` | Complete; Table 9.2 b.p. 350.8 / 329.3 / 310.5 / 300.8 / 390.3 K |
| basicity | 9.6.1 | 266–270 | 8–12 | `aminebasicity` | Complete; Table 9.3 pK_b; aqueous methyl/ethyl orders; aniline 5 vs 2 forms |
| tests-hinsberg | 9.6.2–9.6.6 | 270–272 | 12–14 | `hinsberg` | Complete; carbylamine; HNO₂; Hinsberg alkali rule; TsCl note |
| eas-aniline | 9.6.7 | 272–273 | 14–15 | `anilineeas` | Complete; Br₂ tribromo; nitration **51% p / 47% m / 2% o**; no Friedel–Crafts |
| diazonium | 9.7–9.10 | 274–277 | 16–19 | `diazocoupling` | Complete; 273–278 K; Sandmeyer vs Gatterman; orange/yellow coupling dyes |

## Zoom-verified numbers

| Item | Value | Zoom |
|---|---|---|
| Me₃N ∠C–N–C | 108° | p.2 Fig. 9.1 |
| Table 9.2 b.p. / K | 350.8, 329.3, 310.5, 300.8, 390.3 | p.8 |
| pK_b NH₃ | 4.75 | p.9 |
| Table 9.3 | MeNH₂ 3.38; Me₂NH 3.27; Me₃N 4.22; EtNH₂ 3.29; Et₂NH 3.00; Et₃N 3.25; PhNH₂ 9.38; PhCH₂NH₂ 4.70; PhNHMe 9.30; PhNMe₂ 8.92 | p.9 |
| Aqueous methyl | Me₂NH > MeNH₂ > Me₃N > NH₃ | p.11 |
| Aqueous ethyl | Et₂NH > Et₃N > EtNH₂ > NH₃ | p.11 |
| Hoffmann | RCONH₂ + Br₂ + 4 NaOH → RNH₂ + Na₂CO₃ + 2 NaBr + 2 H₂O | p.6 |
| Nitration 288 K | 51% p, 47% m, 2% o | p.15 |
| Diazotisation | 273–278 K | p.16 |
| Phenol from ArN₂⁺ | 283 K | p.18 |
| Coupling | p-hydroxyazobenzene orange; p-aminoazobenzene yellow | p.18 |

## Exercises 9.1–9.14

All 14 end-of-chapter exercises mapped with steps in `chapter.json`. Intext 9.1–9.9 covered in lessons/worked items. Intext 9.4 answers checked against zoom p.22.

## Edition notes (honest)

- Hinsberg reagent is still taught as C₆H₅SO₂Cl; the reprint adds that **p-toluenesulphonyl chloride** now replaces it.
- Direct nitration percentages **51 / 47 / 2** are printed under p / m / o on zoom p.15 — not invented.
- No polymers / everyday-life content in this PDF.
