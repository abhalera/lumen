# COVERAGE — jesc107 · How do Organisms Reproduce?

Source: `books/originals/Class10-Science_jesc107.pdf` (15 pdf-pages, sha256:575cb5a5… per `output/Class10/SOURCE-MANIFEST.md`, Reprint 2026–27, printed pp. 113–127).
Source link used in every concept: https://ncert.nic.in/textbook/pdf/jesc107.pdf
File: `output/Class10/jesc107/index.html` — single, offline, self-contained (no CDN/iframe/fonts/fetch). Works via `file://`.

## Concepts (7) → NCERT sections
| # | Concept | NCERT § | PDF pp. | Printed | Sim |
|---|---|---|---|---|---|
| 1 | DNA copying & variation | 7.1 | 1–2 | 113–114 | Variation stepper (4 steps) |
| 2 | Fission in single cells | 7.2.1 | 3–4 | 115 | Binary/multiple fission stepper + mode toggle |
| 3 | Buds, pieces & regrowth | 7.2.2–7.2.4 | 4–6 | 116–117 | Reproduction-mode classifier (7 modes incl. sexual) |
| 4 | Spores & vegetative parts | 7.2.5–7.2.6 | 6–8 | 117–118 | Spore→vegetative→tissue-culture stepper (5 steps) |
| 5 | Why sex? Inside a flower | 7.3.1–7.3.2 | 8–11 | 119–121 | Flower labeller (8 parts, explore + find-it quiz) |
| 6 | Pollination to seed | 7.3.2 | 10–11 | 121 | Pollination→fertilisation→seed stepper (5 steps) |
| 7 | Human reproduction | 7.3.3 (a–d) | 11–15 | 121–126 | Human sequence stepper (gamete→fertilisation→implantation→placenta→menstruation), schematic only |

Each concept: Learn 80–140w + deeper + worked example · Play with Predict + readout · Connect (2 Indian, 1 quantitative) · Practice Easy/Medium/Hard (21 total, mixed MCQ + numeric) · Revise (say/draw/exit/next).

## In-text questions mapped
- §7.1 Q1 (DNA copying importance) → C1 Easy/Medium · Q2 (variation: species vs individual) → C1 Hard
- §7.2 Q1 (binary vs multiple fission) → C2 Easy · Q2 (spore benefit) → C4 Medium(closest: propagation advantages; spore survival taught in C4 Learn/Play) · Q3 (complex organisms & regeneration) → C3 Hard · Q4 (why vegetative propagation) → C4 Medium · Q5 (DNA copying essential) → C1 Easy
- §7.3 Q1 (pollination vs fertilisation) → C6 Easy · Q2 (seminal vesicles/prostate) → C7 Learn + worked context · Q3 (puberty changes in girls) → C7 Learn · Q4 (embryo nourishment) → C7 Medium · Q5 (copper-T & STDs) → C7 Hard

## Exercise map (all 11, honest)
Q1 yeast budding → C3 · Q2 vas deferens → C7 · Q3 anther/pollen → C5 · Q4 sexual advantages → C5 · Q5 testis functions → C7 · Q6 menstruation → C7 · Q7 flower diagram → C5 (labeller) · Q8 contraception → C7 · Q9 unicellular vs multicellular → C2/C3 · Q10 population stability → C1 · Q11 contraceptive reasons → C7.
Practice questions are original; the map links each NCERT item to its lesson.

## Checks
- [x] node syntax check of inline script passes; no `http` references except ncert.nic.in links
- [x] 7 concepts × 3 questions = 21; progress max = 21
- [x] Human content: educational/clinical tone, schematic SVG only, no explicit imagery
- [x] learn-play/connect/practice/revise blocks present in every concept; aria-live readouts; 44px controls; reduced-motion respected
- [x] 2026-09-07 fixes verified: node --check PASS; page-range PASS (PDF 1–15); file <2MB; graphic dog-cutting worked example removed → non-graphic limited-regeneration comparison (lizard tail regrows tail only + human skin closes cut vs Planaria whole-body re-patterning); Hard papaya/mustard recall replaced with flower-data interpretation (bagged pistil-only papaya fails vs bagged mustard sets seed → unisexual vs bisexual + justify); numeric-only Hards upgraded to interpret-evidence/multistep (Amoeba 128-ceiling vs 90 observed diagnoses mortality/limits; sunflower 1,200 vs 60 bagged diagnoses pollination, ~1,140 depend on pollinators); title slang neutralised; Hards are diagnose/justify/interpret

## Wow trivia cards (2026-09-08)
- Every concept now has 3 Connect cards: 2 core + 1 `Wow — …` (40–70 words, real-world use + why + school simplification, max 2 https links: Wikipedia + official India-govt/WHO).
- Renderer patched to jesc109 pilot/app.js approach: `wow` badge (`WOW · REAL WORLD`), optional `ext-links` list, `offline-note` (“Links need internet. The lesson above works offline.”). CSS added: `.connect-card.wow`, `.wow-badge`, `.ext-links`, `.offline-note`.
- Wow list:
  1. dna-copy — Wow — Gir cows keep prized milk in the family (50w) — https://en.wikipedia.org/wiki/Gir_cattle + https://agriwelfare.gov.in/
  2. fission — Wow — morning curd from invisible doubling (48w) — https://en.wikipedia.org/wiki/Lactobacillus + https://agriwelfare.gov.in/
  3. pieces-buds — Wow — Hydra, the animal that regrows its head (54w) — https://en.wikipedia.org/wiki/Hydra_(genus) + https://dst.gov.in/
  4. spore-veg — Wow — one banana plant becomes a thousand (55w) — https://en.wikipedia.org/wiki/Plant_tissue_culture + https://agriwelfare.gov.in/
  5. flower — Wow — one Alphonso, a thousand identical trees (47w) — https://en.wikipedia.org/wiki/Alphonso_(mango) + https://agriwelfare.gov.in/
  6. pollination — Wow — mustard honey needs two sexes in one flower (51w) — https://en.wikipedia.org/wiki/Beekeeping_in_India + https://agriwelfare.gov.in/
  7. human — Wow — fertilisation outside the body can still make a baby (57w) — https://en.wikipedia.org/wiki/In_vitro_fertilisation + https://www.who.int/health-topics/infertility (clinical tone, no dosage/advice; India 1978 first-IVF fact kept general)
- Checks 2026-09-08: node --check of inline script PASS; file 83,859 bytes (<2MB); 7/7 lessons have Wow; every Wow 40–70w, ≤2 https links; all 10 unique URLs curl 200 (Mozilla UA); books/reference untouched.

## Gaps (honest)
- Yeast-budding microscope activity (7.1) and chana germination (7.7) are described, not simulated — wet-lab, no safe on-screen substitute claimed.
- Potato/Bryophyllum activities (7.5, 7.6) covered as worked reasoning + sim step, not as timed growth sims.
- Tissue-culture “More to Know” box summarised in one sim step; hormone names beyond NCERT not added.
- Puberty detail kept to NCERT’s level; mental-health/consent framing limited to NCERT’s “readiness” paragraph.
