# COVERAGE — jesc102 Acids, Bases and Salts

Source: books/originals/Class10-Science_jesc102.pdf (20 pdf pages, printed pp. 18-36). NCERT link: https://ncert.nic.in/textbook/pdf/jesc102.pdf. PDF not bundled.

## Concept IDs (7)
| ID | NCERT section | PDF pp | Status |
|---|---|---|---|
| indicators | 2.1.1 + Act 2.1-2.2 | 1-3 | complete |
| acids-metals-carbonates | 2.1.2-2.1.3 + Act 2.3-2.5 | 3-6 | complete |
| neutralisation-oxides | 2.1.4-2.1.6 + Act 2.6-2.7 | 6-8 | complete |
| acids-in-water | 2.2 + Act 2.8-2.9 | 8-12 | complete |
| ph-scale | 2.3-2.3.1 + Act 2.10-2.13 | 12-15 | complete |
| salt-family | 2.4.1-2.4.2 + Act 2.14 | 15-17 | complete |
| chemicals-from-salt | 2.4.3-2.4.4 + Act 2.15 | 17-20 | complete |

## Activities → concept
| Activity | Maps to | Status |
|---|---|---|
| 2.1 three test tubes + indicator | indicators | described + pH sim |
| 2.2 effect on turmeric/onion etc. | indicators | described in text |
| 2.3 Zn + H2SO4/HCl (H2, pop) | acids-metals-carbonates | described + balancer sim |
| 2.4 NaOH + Zn (H2 from base) | acids-metals-carbonates | described in deeper |
| 2.5 carbonate + acid, lime-water | acids-metals-carbonates | described + balancer sim |
| 2.6 HCl + NaOH titration | neutralisation-oxides | described + mixer sim |
| 2.7 CuO + HCl; CO2 + lime | neutralisation-oxides | described in text |
| 2.8 HCl/glucose/alcohol bulb test | acids-in-water | described (Ex Q6 verbatim) |
| 2.9 dry vs moist litmus, dilution heat | acids-in-water | described |
| 2.10-2.13 pH papers, soil, saliva, rain | ph-scale | described + pH sim |
| 2.14 salt solution pH test | salt-family | described + classifier sim |
| 2.15 CuSO4 heating (blue→white) | chemicals-from-salt | described in deeper |

## In-text questions → concept (verbatim items used as mapped practice)
p18 three-tube sort (indicators); p20-23 curd in brass, H2 gas, compound-A + HCl (acids-metals-carbonates); p25-28 HCl/HNO3 in water, conduction, dry litmus, acid-to-water, dilution of H3O+/OH- (acids-in-water); p28-31 pH 6 vs ?/H+ effect/basic H+/soil farmer (ph-scale); p33 Ca(ClO)2 name, Cl2 + dry slaked lime, softening soda, heating NaHCO3, POP + water (chemicals-from-salt). Verbatim practice where marked; rest mapped, original practice.

## End exercises Q1-15 → concept (all 15 located in page map)
Verbatim: Ex Q1 (indicators Easy), Q2 (carbonates Easy), Q3 (neutralisation Medium), Q4 (antacid Easy), Q8 (dry HCl Easy), Q9 (pH sort Medium/Hard), Q10 (strong vs weak, Hard), Q12 (milkman, Hard), Q13 (POP, Medium), Q14 (neutralisation def, Easy). Rest mapped, original practice.
Exercise page map (verified 2026-09-07 via `pdftotext -layout` per pdf page): Ex Q1-7 on pdf p.18 (printed p.34); Ex Q8-15 on pdf p.19 (printed p.35); pdf p.20 (printed p.36) holds Group Activity II only. `exerciseMap` now stores explicit `pdfPage` + `printedPage`; renderer links `#page=<pdfPage>` and displays both; JS + Python checks enforce 1<=pdfPage<=pdfPages (20).

## Sims
pH/indicator explorer (slider 0-14 step 1 incl. edges 0/7/14; litmus/methyl-orange/phenolphthalein/universal model colours; nature + [H+] = 10^-pH readout; household presets labelled typical); neutralisation mixer (0-10 equal-strength drops, salt+water counts, excess readout); salt-family classifier (parent-strength bars → neutral/acidic/basic; bleaching powder in NCERT form Ca(ClO)2, noted as complex mixture); gas-reaction balancer (pop + milky-water reactions with evidence; live atom-count table).

## Limits stated in sims
Household pH given as typical ranges only; universal colours are school-model; mixer uses equal-strength drops (real titration uses burette + indicator + heat); classifier pH follows stronger-parent school model (real salt pH needs strip/meter; caption + revision rule now say so visibly).

## Gaps / pending
- Teacher/student review pending; no browser screenshots taken yet.
- Soda-acid extinguisher group activity described, not built as a separate sim (covered by mixer + carbonate balancer).

## Fix log 2026-09-07 (REVIEW U1/U3/B4/B5)
- B4 bleaching powder (U1): stopped treating CaOCl2 and Ca(OCl)2/Ca(ClO)2 as interchangeable. Now uses NCERT Ca(ClO)2 consistently (p30, in-text Q p33: `2Ca(OH)2 + 2Cl2 -> Ca(ClO)2 + CaCl2 + 2H2O`); quick/deeper/Easy Q/salts entry/revision ticket explain honestly that CaOCl2 (Ca1O1Cl2, calcium oxychloride) vs Ca(ClO)2 (Ca1O2Cl2, calcium hypochlorite) differ by O count and are not spellings; commercial powder noted as complex mixture.
- B5 washing soda (U1): fixed `heat NaHCO3 -> washing soda Na2CO3 + CO2` to two steps: `2NaHCO3 -> Na2CO3 (sodium carbonate) + H2O + CO2` then `Na2CO3 + 10H2O -> Na2CO3.10H2O (washing soda)`; updated quick, formula, Medium Q solution/feedback, Hard Q option, revision ticket. Verified against PDF pp.31-32.
- U3 pages: replaced `exerciseMap` 4-tuples using printed pp.34/35 as `#page=` with explicit `{n,title,lesson,pdfPage,printedPage}` (Q1-7 pdf18/printed34; Q8-15 pdf19/printed35); added `pdfPages:20, printedRange:18-36`; renderer links pdfPage, shows both, validates range.
- U1 audit: fixed `Zn + NaOH -> ...` to balanced `2NaOH + Zn -> Na2ZnO2 + H2`; made `CuO + HCl` explicit `CuO + 2HCl -> CuCl2 + H2O`; audited all other displayed equations (Zn/H2SO4, CaCO3/HCl, lime-water, excess-CO2, neutralisation, HCl-water, H+/OH-, chlor-alkali, baking-make/heat, hydrates, POP) — all balanced.
- B4/B5: qualified classifier + revision rule as school model needing measurement; checked for drafting residue (`no —`, `Three 6 V`, `Back to Chapter`, TODO, script-checked in student UI) — none found in this file; kept Lumen design/CSS untouched.
- Added inline JS self-test (17 equations + page-range checks; formula parser handles parentheses, hydrates `·`, fractions `1/2`, charges) — `node --check` passes, `node` run logs `BALANCE/PAGE CHECK OK: 17 equations, 15 exercise links in range 1-20`.
- Verify: `node --check` 2/2 scripts pass; Python `#page` range check passes; file 92616 bytes (<2MB).

## Remaining gaps
- No live browser QA (viewport/keyboard/screen-reader) per REVIEW release gate; needs 320/390/768/1440px + 200% zoom pass.
- Full exercise bank not reproduced as attemptable items (verbatim subset only); coverage ledger records mapped vs verbatim honestly.

## 2026-09-07 Wow trivia cards (7/7 concepts; verified)
- Renderer: connect-grid map now handles optional `x[2]` links + `wow` class + `WOW · REAL WORLD` badge + offline note (ES5, matches jesc109 pilot logic). CSS adds `.connect-card.wow/.wow-badge/.ext-links/.offline-note` matching pilot; Lumen kept; core offline.
- indicators → Wow — why soap feels slippery (52w; soap pH 8–10, haldi) [https://en.wikipedia.org/wiki/Soap, https://www.nirma.co.in]
- acids-metals-carbonates → Wow — marble that suffers in acid rain (55w; Taj CaCO3 + acid, ASI) [https://en.wikipedia.org/wiki/Taj_Mahal, https://asi.nic.in]
- neutralisation-oxides → Wow — farmers who sweeten sour fields (48w; lime to pH 6.5; gypsum note) [https://en.wikipedia.org/wiki/Soil_pH, https://soilhealth.dac.gov.in]
- acids-in-water → Wow — a city tank dosed with chlorine (49w; bleaching Cl2, pH 6.5–8.5, Jal Jeevan) [https://en.wikipedia.org/wiki/Water_chlorination, https://jaljeevanmission.gov.in]
- ph-scale → Wow — teeth that dissolve below pH 5.5 (49w; enamel, fluoride) [https://en.wikipedia.org/wiki/Toothpaste, https://en.wikipedia.org/wiki/Tooth_decay]
- salt-family → Wow — cakes that rise on a salt (55w; NaHCO3 pH 8.3, CO2) [https://en.wikipedia.org/wiki/Sodium_bicarbonate, https://www.fssai.gov.in]
- chemicals-from-salt → Wow — bangles born in a furnace (49w; washing soda flux, Firozabad) [https://en.wikipedia.org/wiki/Sodium_carbonate, https://firozabad.nic.in]
- Verify: node --check PASS (2/2 inline scripts); file 97156 bytes <2MB; every lesson 3 connect cards with last titled Wow; all 14 URLs https + HEAD-200; facts checked vs linked claims; 40–70w each; no unsafe home experiments; books/, reference/, jesc109/ untouched.
