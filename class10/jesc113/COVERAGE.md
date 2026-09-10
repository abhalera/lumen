# COVERAGE — jesc113 · Our Environment

Source: `books/originals/Class10-Science_jesc113.pdf` (10 pdf-pages, sha256:3f61f057… per `output/Class10/SOURCE-MANIFEST.md`, Reprint 2026–27, printed pp. 208–217).
Source link used in every concept: https://ncert.nic.in/textbook/pdf/jesc113.pdf
File: `output/Class10/jesc113/index.html` — single, offline, self-contained (no CDN/iframe/fonts/fetch). Works via `file://`.

## Concepts (7) → NCERT sections
| # | Concept | NCERT § | Printed | Sim |
|---|---|---|---|---|
| 1 | Ecosystem & its people | intro–13.1 | 208–210 | Roles classifier (producer/consumer/decomposer, 8 cases) |
| 2 | Food chains & levels | 13.1.1 | 210 | Chain builder: tray → ordered links, arrows to eater, T1–T4 validation |
| 3 | Food webs & balance | 13.1.1 | 210–211 | Web toggler: 4 hunters, live route count (branching, not lengthening) |
| 4 | The 10% energy toll | 13.1.1 | 210–211 | Pyramid calculator: slider 1,000–20,000 J → 10,000→1,000→100→10 |
| 5 | Poisons climb upward | 13.1.1 | 211–212 | Biomagnification bars T1–T4 (illustrative ppm model) |
| 6 | The ozone shield | 13.2.1 | 212–213 | O₂→O₃ formation → shield → CFC-thinning stepper |
| 7 | Sorting our garbage | 13.2.2 | 213–216 | 3-bin waste sorter (9 items incl. e-waste; safe destinations only) |

Each concept: Learn 80–140w + deeper + worked example · Play with Predict + readout (+ model note where values are illustrative) · Connect (2 Indian, 1 quantitative) · Practice Easy/Medium/Hard (21 total, mixed MCQ + numeric) · Revise.

## Correctness rules honoured
- 10% energy transfer labelled as Lindeman ~10% average approximation (“model” label; real 5–20%; bar widths schematic, values exact ×0.1). Non-transferred share labelled as heat + respiration + waste + uneaten (not "lost as heat" alone) in revision, Learn, deeper, worked, quiz solutions and pyramid readout/caption.
- Food-chain validation uses explicit allowed food→eater adjacency map derived from tray (Grass/Wheat→Goat/Rabbit/Deer; Algae→Small fish; Goat→Human/Tiger; Rabbit→Fox/Hawk/Human/Tiger; Deer→Tiger/Human; Small fish→Frog/Hawk/Human; Frog→Fox/Hawk; Fox→Tiger; Human/Tiger/Hawk top). Every adjacent pair checked; skipped links (Grass→Tiger), reversed arrows, wrong diets and duplicates rejected with specific messages; arrows colour-coded (green allowed/red rejected); levels shown by position T1→Tn with diet group; readout/arrows/feedback/caption agree.
- Only ~1% sunlight capture kept as NCERT’s figure.
- E-waste: authorised-collection destinations only; explicit never-burn/never-open/never-flush — no unsafe instructions.
- Ozone: O₃-as-poison-down/shield-up distinction kept; 1987 UNEP freeze at 1986 levels as in NCERT.

## In-text questions mapped
- §13.1 Q1 (trophic levels + chain example) → C2 Medium · Q2 (decomposers) → C1 Easy
- §13.2 Q1 (why some substances non-biodegradable) → C7 Medium · Q2/Q3 (effects of bio/non-bio waste) → C7 Deeper + Hard
- §13.2 Q1 (ozone & ecosystems) → C6 Easy · Q2 (reduce waste disposal, 2 methods) → C7 Learn/Revise

## Exercise map (all 9, honest)
Q1 biodegradable group (c) → C7 · Q2 food chain (b) → C2 · Q3 eco-friendly (d) → C7 · Q4 kill one level → C2 Hard · Q5 remove level, differ/expendable → C3 Hard · Q6 biomagnification → C5 · Q7 non-biodegradable problems → C7 · Q8 all-biodegradable → C7 Hard · Q9 ozone → C6 Hard.
Practice questions are original; the map links each NCERT item to its lesson.

## Checks
- [x] node syntax check of inline script passes; no `http` refs except ncert.nic.in
- [x] 7 concepts × 3 questions = 21; progress max = 21
- [x] Pyramid math exact ×0.1; chain validator uses explicit allowed food→eater map (not level-rise); web route counter = 6 with all hunters on
- [x] aria-live readouts; 44px controls; reduced-motion respected
- [x] 2026-09-07 fixes verified: node --check PASS; page-range PASS (PDF 1–10, printed kept distinct); file <2MB; chain self-tests 11/11 PASS (valid 3-link + 2× valid 4-link pass; grass→tiger skipped, pure reversed Tiger→Fox, goat→grass reversed, duplicate, grass→frog wrong-diet fail; single/empty need-more; reset clears); energy labels use "not transferred (heat, respiration, waste, uneaten)" + Lindeman ~10% average (model, real 5–20%) visible in revision, formula, deeper, worked, quiz, pyramid readout/caption; "no —" residue fixed; Hards are diagnose/justify/interpret (no bigger-numbers Hards)

## Wow trivia cards (2026-09-08)
- Every concept now has 3 Connect cards: 2 core + 1 `Wow — …` (40–70 words, real-world use + why + school simplification, max 2 https links: Wikipedia + official MoEF/CPCB/UNEP/agri).
- Renderer patched to jesc109 pilot/app.js approach: `wow` badge (`WOW · REAL WORLD`), optional `ext-links` list, `offline-note`. CSS added: `.connect-card.wow`, `.wow-badge`, `.ext-links`, `.offline-note`.
- Wow list:
  1. ecosystem — Wow — villagers who hugged trees to save a forest (51w) — https://en.wikipedia.org/wiki/Chipko_movement + https://moef.gov.in/
  2. chain — Wow — Kaziranga’s grass feeds a rhino, then a tiger’s world (52w) — https://en.wikipedia.org/wiki/Kaziranga_National_Park + https://moef.gov.in/
  3. web — Wow — one tiger needs a whole web, not one chain (56w) — https://en.wikipedia.org/wiki/Project_Tiger + https://moef.gov.in/ (“more than fifty reserves” as of 2026)
  4. energy — Wow — Shree Anna millets eat sunlight, not tons of water (53w) — https://en.wikipedia.org/wiki/Ecological_pyramid + https://agriwelfare.gov.in/ (UN 2023 millet year)
  5. magnify — Wow — tiny river traces reach fish, then people (51w) — https://en.wikipedia.org/wiki/Biomagnification + https://cpcb.nic.in/ (general rivers, no alarmism, no site-specific claims)
  6. ozone — Wow — the treaty that healed the sky (50w) — https://en.wikipedia.org/wiki/Montreal_Protocol + https://ozone.unep.org/treaties/montreal-protocol
  7. waste — Wow — old phones have their own collection rules (47w) — https://en.wikipedia.org/wiki/Electronic_waste_in_India + https://cpcb.nic.in/e-waste/ (authorised collection only)
- Checks 2026-09-08: node --check of inline script PASS; file 73,905 bytes (<2MB); 7/7 lessons have Wow; every Wow 40–70w, ≤2 https links; all 12 unique URLs curl 200; books/reference untouched.

## Gaps (honest)
- Activities 13.1/13.2 (aquarium), 13.5 (bury waste), 13.7/13.8 (civic surveys) given as reasoning/Connect protocols, not field tools.
- Activity 13.3 (pesticide debate) and 13.9 (e-waste/plastic recycling research) summarised; recycling-process detail left to library/internet as NCERT does.
- Fig. 13.1–13.4 redrawn schematically, not reproduced; “Think it over” cup saga condensed into C7 Connect.
