# COVERAGE — jesc101 Chemical Reactions and Equations

**Source:** `books/originals/Class10-Science_jesc101.pdf`. NCERT *Science*, Grade 10, Chapter 1 (reprint 2026–27), 16 PDF pages, printed pp. 1–16 (printed page = PDF page).
**SHA-256:** `9d58fa614b2d1064f4ef13423eaf85155b0efc5e74bdf3e8c5e6f15f1b742d36`
**NCERT:** https://ncert.nic.in/textbook/pdf/jesc101.pdf

**Build:** `python3 scripts/build_chapter.py jesc101` (shared Class 9/10 pipeline). Combines `chapter.json` + `sims.js` with `scripts/templates/{app.js,styles.css,lab.js}`.
**Checks:**
- `node output/Class10/jesc101/tests/verify.cjs`
- `NODE_PATH=… node scripts/chapter_tools/browser_qa.cjs output/Class10/jesc101`

This is a rebuild from the PDF to the iesc104-shaped standard. The previous `index.html` had no `chapter.json` and is replaced. Thermite welding is **not** in this reprint (old coverage listed it as Activity 1.9); Activity 1.9 here is iron nails in copper sulphate. Question stems keep the PDF’s own spellings (`fillings` in Q3, `sulpur` in Q5).

Videos: 7 lessons wired from `work/class10-science-videos/results/jesc101.json` (agy-imported). I re-ran `python3 work/class10-science-videos/verify_videos.py jesc101` → PASS (12 oEmbed title+channel matches). One video per wow card.

## Concepts

| # | Concept | NCERT section | PDF / printed pp. | Lab (`sims.js`) |
|---|---|---|---|---|
| 1 | Signs of a chemical reaction | Intro, Act. 1.1–1.3 | 1–2 | `signs` |
| 2 | Chemical equations | 1.1, 1.1.1 | 2–3 | `wordeq` |
| 3 | Balancing (hit-and-trial, states) | 1.1.2 | 3–5 | `balancer` |
| 4 | Combination & decomposition | 1.2.1–1.2.2 | 6–10 | `combo` |
| 5 | Displacement & double displacement | 1.2.3–1.2.4 | 10–12 | `displace` |
| 6 | Oxidation and reduction | 1.2.5 | 12–13 | `redox` |
| 7 | Corrosion & rancidity | 1.3 | 13 | `corrosion` |

## Activities, examples and figures

| NCERT item | Where it appears | Lab scenario |
|---|---|---|
| Daily-life list (milk, iron tawa, grapes, cooking, digestion, respiration) | C1 Learn | — |
| Activity 1.1 / Fig. 1.1 Mg ribbon, white MgO | C1 worked, Easy quiz | `Activity 1.1: Mg ribbon` |
| Activity 1.2 yellow ppt (PbI₂) | C1 prediction; C5 Connect | `Activity 1.2: yellow ppt` |
| Activity 1.3 Zn + acid, H₂, warmth / Fig. 1.2 | C1 Hard quiz; Eq. 1.3 | `Activity 1.3: Zn + acid` |
| Word-equation 1.1, skeletal 1.2, balanced 1.3 | C2 | `Eq. 1.1`, `Eq. 1.2`, `Eq. 1.3` |
| Hit-and-trial Fe + H₂O → Fe₃O₄ + H₂ (1.4–1.10) | C3 worked | `Eq. 1.9`, `Eq. 1.4` |
| State symbols; 340 atm methanol; photosynthesis 1.12 | C3 Learn / Go deeper | — |
| In-text p. 6 Q1–Q3 | C1 Easy; C3 Connect | `H₂ + Cl₂`, `2Na + 2H₂O` |
| Activity 1.4 / Fig. 1.3 slaking, Eq. 1.13, whitewash 1.14 | C4 | `Activity 1.4: slaked lime` |
| Coal 1.15, water 1.16, methane 1.17, respiration 1.18 | C4 | `Eq. 1.15`, `Eq. 1.16` |
| Activity 1.5 / Fig. 1.4 FeSO₄, Eq. 1.19 | C4 Hard quiz | `Activity 1.5: FeSO₄` |
| Limestone / cement Eq. 1.20 | C4 | `Eq. 1.20: limestone` |
| Activity 1.6 / Fig. 1.5 lead nitrate, brown NO₂, Eq. 1.21 | C5 decomp lab (also in combo chapter text) | `Activity 1.6` in `decomp` |
| Activity 1.7 / Fig. 1.6 electrolysis 2 : 1 | C4 Medium quiz, worked | `Activity 1.7: electrolysis 2:1` |
| Activity 1.8 / Fig. 1.7 AgCl, Eq. 1.22; AgBr 1.23 | C4 Learn | `Activity 1.8` in `decomp` |
| Ba(OH)₂ + NH₄Cl palm test (endothermic) | C4 Go deeper | — |
| In-text p. 10 whitewash X; 2 : 1 gas | C4 worked | electrolysis scenario |
| Activity 1.9 / Fig. 1.8 Fe + CuSO₄, Eq. 1.24 | C5 | `Activity 1.9` |
| Zn / Pb displacement 1.25–1.26 | C5 Hard quiz | `Eq. 1.25` |
| Activity 1.10 / Fig. 1.9 BaSO₄ ppt, Eq. 1.27 | C5 | `Activity 1.10` |
| Activity 1.11 / Fig. 1.10 Cu → CuO; CuO + H₂ | C6 | `Activity 1.11`, `Eq. 1.29` |
| ZnO + C; MnO₂ + HCl | C6 Hard quiz | — |
| In-text p. 13 Q1–Q3 | C5 Easy; C6 Medium | — |
| Corrosion, rancidity, paint, N₂ flush | C7 | `Corrosion of iron`, `Rancidity: N₂ flush` |
| Group activity (four beakers) | C4 Go deeper | qualitative; no calorimetry sim |

## End-of-chapter exercises (pp. 14–16)

All 20 are on the revision page with the verbatim question text, a step-by-step solution, the final answer and a takeaway.

| Q | Concept | Answer (short) |
|---|---|---|
| 1 | C6 redox | (i) (a) and (b) |
| 2 | C5 | (d) displacement |
| 3 | C5 | (a) H₂ and iron chloride |
| 4 | C3 | equal atom counts; conservation of mass |
| 5 | C3 | N₂+3H₂→2NH₃; 2H₂S+3O₂→2H₂O+2SO₂; 3BaCl₂+Al₂(SO₄)₃→2AlCl₃+3BaSO₄; 2K+2H₂O→2KOH+H₂ |
| 6 | C3 | 2HNO₃…; 2NaOH…; already balanced; …+2HCl |
| 7 | C3 | Ca(OH)₂+CO₂; Zn+2AgNO₃; 2Al+3CuCl₂; BaCl₂+K₂SO₄ |
| 8 | C4 | double disp.; decomp.; combination; displacement |
| 9 | C4 | heat out vs energy in, with chapter examples |
| 10 | C4 | respiration Eq. 1.18 releases energy |
| 11 | C4 | one product vs one reactant; CaO+H₂O vs CaCO₃ |
| 12 | C4 | CaCO₃ (heat); 2AgCl (light); 2H₂O (electricity) |
| 13 | C5 | Fe+CuSO₄ vs Na₂SO₄+BaCl₂ |
| 14 | C5 | Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag |
| 15 | C5 | insoluble salt; BaSO₄ and PbI₂ |
| 16 | C6 | gain of O (2Cu+O₂, 2Mg+O₂); loss of O (CuO+H₂, ZnO+C) |
| 17 | C6 | copper; CuO |
| 18 | C7 | paint keeps air and moisture off iron |
| 19 | C7 | N₂ flush prevents oxidation of the oil |
| 20 | C7 | rusting of iron; stale chips / oxidised fats |

## Gaps / pending

- Videos not yet wired (agy-imported request sent). Connect wow cards are present without a `video` field.
- Group activity is qualitative; no calorimetry sim.
- Figures 1.1–1.10 are described in labs as SVG scenes; they are not cited by number in the 20 exercises, so `figures.js` is not required by the shared verifier.
