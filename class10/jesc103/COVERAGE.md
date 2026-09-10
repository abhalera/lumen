# COVERAGE — jesc103 Metals and Non-metals

Source: books/originals/Class10-Science_jesc103.pdf (21 pdf pages, printed pp. 37-57). NCERT link: https://ncert.nic.in/textbook/pdf/jesc103.pdf. PDF not bundled.

## Concept IDs (6)
| ID | NCERT section | PDF pp | Status |
|---|---|---|---|
| physical-properties | 3.1 + Act 3.1-3.2 | 1-3 | complete |
| metals-air-water | 3.2.1-3.2.2 + Act 3.3-3.5 | 4-7 | complete |
| acids-reactivity-series | 3.2.3-3.2.5 + Act 3.6-3.8 | 7-11 | complete |
| ionic-bonding | 3.3 + Act 3.9-3.11 | 11-15 | complete |
| extraction | 3.4 + Act 3.12-3.14 | 15-19 | complete |
| corrosion-alloys | 3.5 + alloys/non-metal oxides | 19-21 | complete (alloys + non-metal chemistry folded in; see note) |

Note: 6 concepts cover all of §3.1-3.5 (acids/series split for sim clarity). Alloys (brass/bronze/solder/22-carat/amalgam) and non-metal oxide chemistry live in corrosion-alloys with the corrosion selector + Ex Q3/Q4/Q9/Q11/Q13/Q16 practice.

## Activities → concept
| Activity | Maps to | Status |
|---|---|---|
| 3.1 hammer samples | physical-properties | described + property tester |
| 3.2 wire/bulb/heat tests | physical-properties | described + property tester |
| 3.3 burn Mg/Zn/Fe/Cu | metals-air-water | described + balancer sim |
| 3.4 Na in water (teacher) | metals-air-water | described + balancer sim (safety noted) |
| 3.5 Mg/Al/Zn/Fe + cold/hot/steam | metals-air-water | described in text |
| 3.6 metals + dilute HCl | acids-reactivity-series | described in text + predictor context |
| 3.7 metals + CuSO4/ZnSO4/FeSO4 | acids-reactivity-series | described + predictor sim |
| 3.8 Cu + ZnSO4 vs Zn + CuSO4 | acids-reactivity-series | described + predictor sim |
| 3.9 dot structures | ionic-bonding | described + electron stepper |
| 3.10 NaCl/MgCl2 formation | ionic-bonding | described + electron stepper |
| 3.11 mp/conduction tests | ionic-bonding | described in text |
| 3.12 heat ZnCO3/ZnS | extraction | described + extraction balancer |
| 3.13 ZnO + C | extraction | described + balancer sim |
| 3.14 MnO2 + ... (displacement) | extraction | described in deeper (thermite link) |

## In-text questions → concept (verbatim items used as mapped practice)
p37 liquid metal, malleable/ductile (physical-properties); p40 Na in kerosene, water equations (metals-air-water); p43-46 A/B/C/D reactivity, H2 gas, Zn + FeSO4 (acids-reactivity-series); p48 ionic mp (ionic-bonding); p52 mineral/ore/gangue, free-state metals, oxide→metal by reduction (extraction); p55 oxide-displacement table, non-corroding metals, alloys (corrosion-alloys). Verbatim where marked; rest mapped, original practice.

## End exercises Q1-16 → concept (all 16 located in page map)
Verbatim: Ex Q1 (reactivity Medium), Q2 (protection Easy), Q4 (tin cans Medium), Q5 (tests Hard), Q8 (refining Medium), Q12c/Q12d (extraction Hard/Medium). Rest mapped, original practice (full bank not reproduced).
Exercise page map (verified 2026-09-07 via `pdftotext -layout` per pdf page): Ex Q1-7 on pdf p.20 (printed p.56); Ex Q8-16 on pdf p.21 (printed p.57); pdf p.19 (printed p.55) holds in-text Q only. `exerciseMap` now stores explicit `pdfPage` + `printedPage`; renderer links `#page=<pdfPage>` and displays both; JS + Python checks enforce 1<=pdfPage<=pdfPages (21).

## Sims
Property tester (4 samples × 4 tests with honest exception notes; caption states school-model); burning/fizzing balancer (now 4 reactions incl. Mg+hot-water hydroxide vs steam oxide; live atom-count table); displacement predictor (series K→Au approx; Fe(II)/Cu(II) assumption stated; equations auto-balanced incl. Al2(SO4)3-type cases); electron-transfer stepper (NaCl/MgO/MgCl2, learner-controlled step, no auto-animation); extraction balancer (roast/calcine/reduce); corrosion selector (dry/moist/salty × paint/oil/zinc/alloy, relative-spot model, caption states model not rate meter). No invented reactivity inversions; K/Na/Ca excluded from strips with stated water-reaction reason.

## Gaps / pending
- Teacher/student review pending; no browser screenshots taken yet.
- Electrolysis of alumina not simulated stepwise (equation-level only); alloy microstructures not visualised.

## Fix log 2026-09-07 (REVIEW U1/U3/B4/B5)
- Hot water (U1): fixed `Mg only with hot water (MgO + H2)` to `Mg + 2H2O(hot) -> Mg(OH)2 + H2 (hydroxide, not MgO)`; clarified `Metals + water -> hydroxide + H2 (cold/hot) or oxide + H2 (steam)`; added 4th balancer reaction `Mg + hot water` (species Mg/H2O/Mg(OH)2/H2, cond hot water, limit notes hydroxide vs steam oxide e.g. `3Fe + 4H2O(g) -> Fe3O4 + 4H2`); updated Medium Q option/solution to contrast hydroxide vs steam oxide; verified against PDF p.42-43.
- Nitric acid (U1): rewrote `Nitric acid gives NO2/H2 instead` to oxidising-acid exception matching NCERT p.43-44: `HNO3 oxidises H2 to water, reduced to N2O/NO/NO2; only very dilute HNO3 with Mg/Mn gives H2`.
- Extraction (U1): fixed `Cu2O + Cu2S -> 6Cu + SO2` to `2Cu2O + Cu2S -> 6Cu + SO2` (Cu 6/6, O 2/2, S 1/1) in deeper; verified roast/calcine/reduce, Hg, thermite equations; added inline JS atom-count self-test (31 equations incl. all air/water/acid/displacement/ionic/extraction/corrosion equations; parser handles parentheses, hydrates, fractions, charges) — `node` logs `BALANCE/PAGE CHECK OK: 31 equations, 16 exercise links in range 1-21`.
- Frying pan (U1 assessment): fixed Easy Q keyed `all of these` incl. paint. Now asks cooking-surface context, keys grease/oil only (NCERT Ex Q2 option a), distractors paint (peels/burns/toxic; for gates/grills) and zinc galvanising (sacrificial for roofs/buckets; leaches, not food-safe on heated surface) each explained; solution also covers alloying (stainless) vs coating contexts.
- Ionic simplification: fixed `Mg + O -> MgO` to `2Mg + O2 -> 2MgO`; qualified `Na > Mg > ...` ladder as school approximation with full series in Play.
- U3 pages: replaced 16 `exerciseMap` tuples using printed pp.56-58 (58 does not exist; book ends printed 57) with explicit `{n,title,lesson,pdfPage,printedPage}` (Q1-7 pdf20/printed56; Q8-16 pdf21/printed57); added `pdfPages:21, printedRange:37-57`; renderer links pdfPage, shows both, validates range.
- B4/B5: qualified salt-classifier caption + reactivity ladder visibly as school models; checked for drafting residue (`no —`, `Three 6 V`, TODO, student-facing script-checked) — none found in this file; kept Lumen design/CSS untouched.
- Verify: `node --check` 2/2 scripts pass; Python `#page` range check passes; file 91984 bytes (<2MB).

## Remaining gaps
- No live browser QA (viewport/keyboard/screen-reader) per REVIEW release gate; needs 320/390/768/1440px + 200% zoom pass.
- Full exercise bank not reproduced as attemptable items (verbatim subset only); ledger records mapped vs verbatim honestly.

## 2026-09-07 Wow trivia cards (6/6 concepts; verified)
- Renderer: connect-grid map now handles optional `x[2]` links + `wow` class + `WOW · REAL WORLD` badge + offline note (ES5, matches jesc109 pilot logic). CSS adds `.connect-card.wow/.wow-badge/.ext-links/.offline-note` matching pilot; Lumen kept; core offline.
- physical-properties → Wow — utensils that refuse to rust (52w; stainless Cr/Ni, 304 note) [https://en.wikipedia.org/wiki/Stainless_steel, https://www.tatasteel.com]
- metals-air-water → Wow — roofs that heal their scratches (53w; Zn sacrificial over Fe) [https://en.wikipedia.org/wiki/Zinc, https://www.hzlindia.com]
- acids-reactivity-series → Wow — the kalhaiwala who tins your kadhai (55w; Sn barrier, tamarind) [https://en.wikipedia.org/wiki/Tinning, https://en.wikipedia.org/wiki/Copper]
- ionic-bonding → Wow — salt pans that feed three industries (48w; NaCl ions, chlor-alkali) [https://en.wikipedia.org/wiki/Chloralkali_process, https://en.wikipedia.org/wiki/Sodium_chloride]
- extraction → Wow — rails welded by aluminium's hunger (54w; 3MnO2+4Al thermite) [https://en.wikipedia.org/wiki/Thermite, https://indianrailways.gov.in]
- corrosion-alloys → Wow — metal that flies to the Moon (52w; ISRO Al-Li/Mg/Cu, 22K analogy) [https://en.wikipedia.org/wiki/Aluminium_alloy, https://www.isro.gov.in]
- Verify: node --check PASS (2/2 inline scripts); file 96188 bytes <2MB; every lesson 3 connect cards with last titled Wow; all 12 URLs https + HEAD-200; facts checked vs linked claims; 40–70w each; no unsafe home experiments; books/, reference/, jesc109/ untouched.
