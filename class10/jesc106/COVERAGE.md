# Coverage — Control and Coordination (jesc106)

Source: [jesc106.pdf](https://ncert.nic.in/textbook/pdf/jesc106.pdf) · Edition 2026–27 · File: `output/Class10/jesc106/index.html`

Concepts (6): `neuron`, `reflex-voluntary`, `brain`, `plant-movements`, `plant-hormones`, `animal-hormones`
Practice: 18 questions (3 per concept: Easy/Medium/Hard). Sims: impulse stepper; pathway builder; brain atlas; tropism theatre; auxin lab; hormone matcher.

## Map (NCERT item → concept ID + status)

| NCERT item | Concept ID | Status |
|---|---|---|
| 6.1 Nervous system + neuron Fig.6.1 + Activity 6.1 (pp.100–101) | `neuron` | covered: Learn + impulse stepper + 3 Qs |
| In-text Q p.105: reflex vs walking | `reflex-voluntary` | quizzed (Easy Q) |
| In-text Q p.105: synapse | `neuron` | covered: deeper + stepper step 3 |
| In-text Q p.105: cerebellum | `brain` | quizzed (Easy Q) |
| In-text Q p.105: agarbatti smell | `neuron` | quizzed (Medium Q) |
| In-text Q p.105: brain in reflex | `brain` | covered: Learn + chapter exit-ticket Q1 (cord acts, brain informed) |
| 6.1.1 Reflex actions + Fig.6.2 (p.102) | `reflex-voluntary` | covered: Learn + pathway builder + ordering Q |
| 6.1.2 Human brain + Fig.6.3 (pp.103–104) | `brain` | covered: Learn + brain atlas sim + Qs (Ex.3) |
| 6.1.3 Protection; 6.1.4 muscle action (p.104) | `brain` | covered: Learn + armour option + stepper step 5 |
| 6.2 Plant coordination + mimosa Fig.6.4 (pp.105–106) | `plant-movements` | covered: Learn + theatre sim |
| 6.2.1 Immediate response; 6.2.2 growth + Activities 6.2 Figs.6.5/6.6 (pp.106–107) | `plant-movements` | covered: Learn + sim + 3 Qs |
| In-text Q p.108: plant hormones define | `plant-hormones` | covered: Learn Q1 theme |
| In-text Q p.108: mimosa vs shoot | `plant-movements` | quizzed (Easy Q) |
| In-text Q p.108: growth promoter example | `plant-hormones` | quizzed (Easy Q) |
| In-text Q p.108: auxin tendril | `plant-hormones` | covered: deeper + Medium Q theme |
| In-text Q p.108: hydrotropism experiment | `plant-movements` | covered: worked design |
| 6.3 Animal hormones + Fig.6.7 + Activities 6.3/6.4, Table 6.1 (pp.109–111) | `animal-hormones` | covered: Learn + matcher sim + 3 Qs; NO dosage advice (stated) |
| In-text Q p.111: chemical coordination/how | `animal-hormones` | covered: Learn |
| In-text Q p.111: iodised salt | `animal-hormones` | quizzed (Medium Q) |
| In-text Q p.111: adrenaline response | `animal-hormones` | covered: Learn + sim option |
| In-text Q p.111: insulin injections why | `animal-hormones` | quizzed (Hard Q) |
| Ex.1 plant hormone | `plant-hormones` | quizzed (Easy Q): cytokinin |
| Ex.2 synapse | `neuron` | quizzed (Easy Q) |
| Ex.3 brain all | `brain` | quizzed (Medium Q) |
| Ex.4 receptors | `neuron` | mapped: Learn + Medium Q theme |
| Ex.5 neuron structure | `neuron` | mapped: Learn + recall sketch |
| Ex.6 phototropism | `plant-hormones` | mapped: Learn + auxin sim + Medium Q |
| Ex.7 spinal injury | `reflex-voluntary` | quizzed (Medium Q) |
| Ex.8 plant chemical coordination | `plant-hormones` | mapped: Learn |
| Ex.9 need for control | `reflex-voluntary` | mapped: Learn intro |
| Ex.10 involuntary vs reflex | `reflex-voluntary` | mapped: deeper + builder contrast |
| Ex.11 nervous vs hormonal | `animal-hormones` | mapped: deeper |
| Ex.12 sensitive plant vs legs | `plant-movements` | mapped: Learn + recall theme |
| GAP: library consultation (Act. 6.3 other glands) | `—` | GAP: pineal/thymus etc. beyond Table 6.1 not covered (out of chapter scope) |

## Honest gaps
- Extra glands beyond Table 6.1 (Act. 6.3 library task) not covered — chapter scope only.
- No reaction-time measurement; speed claims qualitative (fast/slow), no millisecond numbers.
- No medical/dosage advice anywhere (stated in chapter); treatment = doctor’s domain.

## 2026-09-07 fixes
- Brain Hard resting-% recall Q replaced with mechanism reasoning (blocked motor nerve with intact sensory/cord → predict no withdrawal but pain felt; dissociates motor-out vs sensory-up). Verified node --check PASS (both script blocks), page-range PASS (PDF 1–13), file <2MB, no "no —" residue, Hards are diagnose/justify/interpret/multistep.

Q-number policy: only real NCERT numbers above are cited; all quiz questions are labelled `Original practice` except where the map tag names an NCERT item.

## 2026-09-07 Wow trivia cards (jesc109-pilot mirror)
- Added ONE `Wow — …` connect card as last card in every concept (6/6): 2 core cards kept verbatim, Wow is 3rd. Each Wow 40–70 words, original wording, real place/device + why + school-model vs measured split. No dosage (insulin function only, doctor domain), no unsafe home chemistry (carbide ban noted, no home experiments).
- Cards: `neuron` Braille reading (50w); `reflex-voluntary` knee-hammer arc (55w); `brain` hospital EEG caps (51w); `plant-movements` sunflower tracking (48w); `plant-hormones` ethylene ripening chambers (49w); `animal-hormones` insulin sugar-key (53w). Max 2 https links per Wow (Wikipedia only, no deep-URL invention); all HEAD 200 verified (429s re-checked 200 after backoff).
- Renderer + CSS mirror `jesc109/pilot`: `connect-card wow` + `wow-badge` (WOW · REAL WORLD) + `ext-links` + `offline-note`; `connectTag` unchanged (no rebrand).
- Verify: file 105,479 B <2MB; `node --check` PASS both scripts; every lesson 3 connect cards, last-is-Wow; `tests/verify-course.cjs` PASS.
