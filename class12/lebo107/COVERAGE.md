# COVERAGE — lebo107 Human Health and Disease

**Source:** `books/originals/Class12-Biology_lebo107.pdf` (22 pdf pages, printed folio absent in source, Reprint 2026-27).
**SHA-256:** `afb1c7c2f7699e0572e09e9ee3279f4e61100ba0b117b3f34b9d1ac10bdeae75` (in `/tmp/opencode/bio_maps.json`, key `lebo107`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo107.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo107.pdf

Tone: clinical, textbook-faithful. The drugs/alcohol lesson is educational throughout; nothing glorifies use.

Honest notes: the `bio_maps.json` section map for lebo107 lists most sections (§7.1–7.5) at pdf page 3 and the exercise map lists all Q1–17 at pdf p. 22, so per-lesson pdf ranges below follow the text layer (body pdf 3–21, summary + exercises pdf 21–22) rather than the map. The antibody diagram question (Q9) is answered descriptively since the offline build has no image upload; labels reproduce the Figure 7.4 H2L2 cartoon. The second malaria species prints as P. malariae in this reprint's text layer. Yoga appears only as the chapter's own lifestyle prescription (practised since time immemorial for physical and mental health) alongside diet, hygiene and exercise.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| bacterial-viral-protozoan | 7.1 | 3–6 | Complete; typhoid/Widal/Mary Mallon, pneumonia, rhinovirus cold, Plasmodium species + two-host cycle + haemozoin, Entamoeba |
| helminth-fungal-hygiene | 7.1 | 6–8 | Complete; Ascaris, Wuchereria/elephantiasis, ringworm genera, personal/public hygiene, vector control, vaccines/antibiotics wins |
| innate-acquired-immunity | 7.2, 7.2.1, 7.2.2 | 8–10 | Complete; four innate barriers, memory/primary vs secondary, B/T cells, H2L2 + Ig classes, humoral vs CMI, graft rejection |
| vaccination-allergy-lymphoid | 7.2.3–7.2.7 | 10–12 | Complete; active vs passive, vaccines + passive immunisation, allergy IgE axis, autoimmunity, primary vs secondary organs + MALT 50% |
| aids | 7.3 | 12–14 | Complete; retrovirus + reverse transcriptase, helper-T fall, four routes + touch exclusion, 5–10 yr lag, ELISA, ART limit, NACO prevention |
| cancer | 7.4 | 14–16 | Complete; contact inhibition, benign vs malignant + metastasis, carcinogens + c-onc, biopsy/CT/MRI/antibodies, surgery/radio/chemo/α-interferon |
| drugs-alcohol | 7.5, 7.5.1–7.5.4 | 16–21 | Complete; opioids/cannabinoids/cocaine + nicotine, adolescence drivers, addiction vs dependence, harms + doping, five-step prevention |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Typhoid | Salmonella typhi | Sustained 39–40°C; Widal confirms; carrier Mary Mallon |
| Pneumonia | S. pneumoniae, H. influenzae | Alveoli fill with fluid; droplets or shared utensils |
| Cold | Rhinoviruses | Nose/passage, not lungs; 3–7 days; fomites |
| Malaria | P. vivax/malariae/falciparum | Sporozoites → liver → RBC + haemozoin chill every 3–4 days; two hosts, female Anopheles vector |
| Amoebiasis | Entamoeba histolytica | Mucous/blood stools; housefly mechanical carriers |
| Ascariasis | Ascaris | Intestinal blockage; faecal–oral eggs |
| Elephantiasis | W. bancrofti/malayi | Chronic lymphatic inflammation; mosquito vectors |
| Ringworm | Microsporum/Trichophyton/Epidermophyton | Scaly itchy lesions; heat/moisture; towels/combs/soil |
| Innate | Four barriers | Skin/mucus; acid/saliva/tears; PMNL/monocyte/NK/macrophage; interferons |
| Antibody | H2L2 | 2 heavy + 2 light chains; IgA/IgM/IgE/IgG; Figure 7.4 |
| Memory | Primary vs secondary | Low first, intense anamnestic on re-exposure |
| Active/passive | Self-made vs ready-made | Infection/vaccine vs colostrum IgA, placenta, antitoxin |
| Allergy | IgE axis | Allergen → IgE → mast-cell histamine + serotonin |
| Lymphoid | Primary vs secondary | Marrow/thymus vs spleen/nodes/tonsils/Peyer's/appendix; MALT ~50% |
| AIDS | HIV retrovirus | RNA + reverse transcriptase; helper-T fall; ELISA; ART prolongs only |
| AIDS routes | Body fluids only | Sex, blood, needles, placenta; never touch; lag usually 5–10 yr |
| Cancer | Benign vs malignant | Confined vs invade/starve/metastasise via blood |
| Carcinogens | Physical/chemical/bio | X-rays/gamma, UV, tobacco smoke, oncogenic viruses, c-onc |
| Drugs | Groups + receptors | Opioids/CNS-GIT, cannabinoids/brain, cocaine/dopamine, nicotine/adrenaline |
| Adolescence | 12–18 years | Curiosity, stress, cool-image, media, family, peers |
| Addiction/dependence | Craving vs withdrawal | Tolerance loop vs anxiety/shakiness/nausea/sweating |

## End-of-Chapter Exercises 1–17

All **17** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (all on pdf p. 22; printed folio absent in source).

## Pedagogical Simulations (sims.js — separate script)

1. `pathogens` — disease → pathogen → spread matcher (typhoid to amoebiasis).
2. `malaria` — Plasmodium life-cycle stepper (human + mosquito) + worm/fungus control.
3. `immunity` — innate vs acquired classifier + antibody H2L2 builder.
4. `lymphoid` — primary vs secondary organ sorter + MALT.
5. `aids` — HIV replication stepper + transmission myth-buster.
6. `cancer` — benign vs malignant sorter + metastasis path.
7. `drugs` — addiction vs dependence sorter + prevention planner.
