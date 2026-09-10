# COVERAGE — jesc108 · Heredity

Source: `books/originals/Class10-Science_jesc108.pdf` (6 pdf-pages via pdfinfo/pdftotext, sha256:b0357c0b… per `output/Class10/SOURCE-MANIFEST.md`, Reprint 2026–27, printed pp. 128–133). Printed vs PDF kept distinct (pages=PDF 1–6, print=printed pp.).
Source link used in every concept: https://ncert.nic.in/textbook/pdf/jesc108.pdf
File: `output/Class10/jesc108/index.html` — single, offline, self-contained (no CDN/iframe/fonts/fetch). Works via `file://`.

## Concepts (6) → NCERT sections
| # | Concept | NCERT § | Printed | Sim |
|---|---|---|---|---|
| 1 | Variation builds up | 8.1 | 128–129 | Generation-branching stepper (4 steps) |
| 2 | Mendel’s F1: dominance | 8.2.2 | 130 | Punnett builder TT×tt (gametes→combine→count) |
| 3 | Mendel’s F2: 3:1 & 1:2:1 | 8.2.2 | 130 | Punnett builder Tt×Tt + genotype/phenotype counts |
| 4 | Two traits at once | 8.2.2 | 130–131 | Dihybrid 4×4 explorer with new-combo highlighting (9:3:3:1) |
| 5 | Genes → proteins → traits | 8.2.3 | 131–132 | Enzyme-efficiency slider with threshold (dominance mechanised) — INVENTED ILLUSTRATIVE MODEL, NOT MEASURED (TT≈100/Tt≈60/tt≈10/threshold≈30 labelled prominently in sim SVG banner + readout + cap + modelNote + Learn + deeper + worked + predict + quiz) |
| 6 | Boy or girl? | 8.2.4 | 132 | XX×XY Punnett + coin-toss repeated-trials demo (1/20/200) |

Each concept: Learn 80–140w + deeper + worked example · Play with Predict + readout + model note · Connect (2 Indian, 1 quantitative) · Practice Easy/Medium/Hard (18 total, mixed MCQ + numeric) · Revise.

## Correctness rules honoured
- Ratios labelled as large-number expectations everywhere (readouts, model notes, revision rule, C3 Hard, C6).
- Small-family variation explicitly taught: coin-toss demo shows % wandering at n=20 and settling near 50% at n=200; worked example (½)⁴ = 1/16 all-girl families.
- Each birth independent (C6 Hard); one child cannot prove dominance (C4 blood-group Q).

## In-text questions mapped
- §8.1 Q1 (10% vs 60%: which arose earlier) → C1 Medium + worked · Q2 (variation & survival) → C1 Hard
- §8.2 Q1 (dominant/recessive) → C2 Hard + C3 · Q2 (independent inheritance) → C4 Easy · Q3 (blood group A×O→O) → C4 Hard + Connect · Q4 (sex determination) → C6 Easy

## Exercise map (all 4, honest)
Q1 TtWW (c) → C4 (dihybrid reasoning) · Q2 light eyes → C2 (cannot say — Connect-adjacent; taught in C4 blood-group logic) · Q3 dog-coat project → C2 Connect + C3 · Q4 equal contribution → C5 Hard.
Practice questions are original; the map links each NCERT item to its lesson.

## Checks
- [x] node syntax check of inline script passes; no `http` refs except ncert.nic.in
- [x] 6 concepts × 3 questions = 18; progress max = 18
- [x] Punnett counts verified: TT×tt → 4 Tt; Tt×Tt → 1:2:1 / 3:1; XX×XY → 2:2; dihybrid classes 9/3/3/1 computed from gamete logic
- [x] aria-live readouts; 44px controls; reduced-motion respected
- [x] 2026-09-07 fixes verified: node --check PASS; page-range PASS via pdftotext/pdfinfo (PDF 1–6; lessons F1 [2,3], F2 [3,4], dihybrid [4,4], gene [4,5], sex [5,6]; exerciseMap all PDF p.6 where Exercises live; printed kept distinct); file <2MB; gene % prominently labelled INVENTED in sim+text+quiz; Hards are diagnose/justify/interpret (no bigger-numbers Hards)

## Wow trivia cards (2026-09-08)
- Every concept now has 3 Connect cards: 2 core + 1 `Wow — …` (40–70 words, real-world use + why + school simplification, max 2 https links: Wikipedia + official WHO/NHM/India-govt/DST).
- Renderer patched to jesc109 pilot/app.js approach: `wow` badge (`WOW · REAL WORLD`), optional `ext-links` list, `offline-note`. CSS added: `.connect-card.wow`, `.wow-badge`, `.ext-links`, `.offline-note`.
- Wow list:
  1. accumulate — Wow — Pusa Basmati 1121 was designed, not found (50w) — https://en.wikipedia.org/wiki/Pusa_Basmati_1121 + https://agriwelfare.gov.in/
  2. f1 — Wow — Mendel counted 28,000 plants to see dominance (54w) — https://en.wikipedia.org/wiki/Mendel%27s_laws + https://dst.gov.in/
  3. f2 — Wow — why O blood helps in donation camps (60w) — https://en.wikipedia.org/wiki/ABO_blood_group_system + https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability (no medical advice; O needs two copies)
  4. dihybrid — Wow — Delhi’s vault stores tomorrow’s 9:3:3:1 (48w) — https://en.wikipedia.org/wiki/Gene_bank + https://agriwelfare.gov.in/ (National Gene Bank “over four lakh” stated as approximate)
  5. gene — Wow — one spelling change, less haemoglobin (53w) — https://en.wikipedia.org/wiki/Thalassemia + https://www.nhm.gov.in/ (function-level only, screening general, no dosage/advice)
  6. sex — Wow — myths blame mothers, chromosomes don’t (56w) — https://en.wikipedia.org/wiki/Sex-determination_system + https://www.india.gov.in/ (sensitive, factual; prenatal sex determination banned)
- Checks 2026-09-08: node --check of inline script PASS; file 64,814 bytes (<2MB); 6/6 lessons have Wow; every Wow 40–70w, ≤2 https links; all 11 unique URLs curl 200; books/reference untouched.

## Gaps (honest)
- Mendel biography box summarised (monastery/Vienna/peas/counting) rather than full text.
- Activity 8.1 (earlobe survey) given as Connect protocol, not a data-logging tool.
- Activity 8.2 answered in C3 Deeper; Fig. 8.3/8.5/8.6 redrawn schematically, not reproduced.
- Asexually-reproducing inheritance (“can we work out…?”) left as the chapter leaves it — no added mechanism beyond NCERT.
