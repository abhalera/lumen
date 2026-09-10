# COVERAGE — jesc101 Chemical Reactions and Equations

Source: books/originals/Class10-Science_jesc101.pdf (16 pdf pages, printed pp. 1-16). NCERT link: https://ncert.nic.in/textbook/pdf/jesc101.pdf. PDF not bundled.

## Concept IDs (7)
| ID | NCERT section | PDF pp | Status |
|---|---|---|---|
| signs-of-reaction | Intro + Activities 1.1-1.3 | 1-2 | complete |
| chemical-equations | 1.1 (word/skeletal) | 2-3 | complete |
| balancing-method | 1.1.2 (hit-and-trial, states) | 3-5 | complete |
| combination-decomposition | 1.2.1-1.2.2 | 6-8 | complete |
| displacement-double | 1.2.3-1.2.4 | 9-11 | complete |
| redox | 1.2.5 | 11-12 | complete |
| corrosion-rancidity | 1.3 | 12-13 | complete |

## Activities (1.1-1.11 + group) → concept
| Activity | Maps to | Status |
|---|---|---|
| 1.1 Mg ribbon burning | signs-of-reaction, chemical-equations | described + balancer sim (teacher supervision noted; no live flame in sim) |
| 1.2 Pb(NO3)2 + KI yellow ppt | displacement-double | described + balancer sim |
| 1.3 Zn + acid, H2 + warmth | signs-of-reaction | described + balancer sim |
| 1.4 Slaking lime CaO + H2O | combination-decomposition | described + balancer sim |
| 1.5 Ferrous sulphate heating | combination-decomposition | described in deeper (green→brown) |
| 1.6 Electrolysis of water (2:1 gas) | combination-decomposition | described + balancer sim |
| 1.7 Sunlight on AgCl | combination-decomposition | described in deeper |
| 1.8 Iron nail + CuSO4 | displacement-double | described + balancer sim |
| 1.9 Thermite welding mention | displacement-double | described + balancer sim |
| 1.10 Double displacement / ppt | displacement-double | described + balancer sim |
| 1.11 CuO + H2 redox | redox | described + balancer sim |
| Group activity (exo/endo beakers) | combination-decomposition | described in text; qualitative only |

## In-text questions → concept (verbatim items used as mapped practice)
| NCERT in-text Q | Concept | Status |
|---|---|---|
| p5 Q1 Mg ribbon cleaned | signs-of-reaction | verbatim practice (Easy) |
| p5 Q2 balanced eqns (H2+Cl2; BaCl2+Al2(SO4)3; Na+H2O) | balancing-method | (i) verbatim practice; (ii)-(iii) mapped, original practice |
| p5 Q3 state symbols (BaCl2+Na2SO4; NaOH+HCl) | balancing-method | (i) verbatim practice; (ii) mapped, original practice |
| p9 whitewash X; electrolysis gas ratio | combination-decomposition | verbatim practice (Medium); gas-ratio as Hard numeric |
| p13 Fe nail colour change; double-displacement example; oxidised/reduced (Na, CuO) | displacement-double, redox | verbatim practice |

## End exercises Q1-20 → concept (see in-page exercise map; all 20 located)
All mapped. Verbatim: Ex Q1 (redox Hard), Q2 (displacement Medium), Q17/Q18/Q19 (corrosion-rancidity). Rest: mapped, original practice (full exercise bank not reproduced; solutions taught via concept practice).

## Sims
Equation balancer (coefficients 1-9 steppers, live LHS/RHS atom table, balanced verdict, type + observable evidence + limits) in all 7 concepts with concept-specific preset reactions. Zero coefficients rejected (min 1). Subscripts locked by design.

## Gaps / pending
- Teacher/student review pending; no browser screenshots taken yet (claim only file + logic checks below).
- Group activity is qualitative; no calorimetry sim (out of scope for balancer contract).

## 2026-09-07 audit (no content defects found; verified)
- node --check PASS; page-range PASS (lessons PDF 1–14, exerciseMap PDF 14–16, PDF has 16 pages; printed kept distinct); file 91KB <2MB; no "no —" residue; Hards are diagnose/justify/interpret/multistep (evidence, legal balancing moves, coefficient balancing, observation ordering, redox agents), not bigger numbers. No changes required beyond verification. Reference jesc109 untouched.

## 2026-09-07 Wow trivia cards (7/7 concepts; verified)
- Renderer: connect-grid map now handles optional `x[2]` links + `wow` class + `WOW · REAL WORLD` badge + `Links need internet. The lesson above works offline.` note (ES5, matches jesc109 pilot logic; badge text REAL WORLD per spec). CSS adds `.connect-card.wow/.wow-badge/.ext-links/.offline-note` matching pilot; Lumen tokens/layout kept; core works offline.
- signs-of-reaction → Wow — chips that stay crisp for months (48w; N2 flushing, FSSAI) [https://en.wikipedia.org/wiki/Rancidification, https://www.fssai.gov.in]
- chemical-equations → Wow — a kiln that eats limestone by the tonne (54w; cement CaCO3→CaO+CO2 mass audit) [https://en.wikipedia.org/wiki/Cement, https://www.bis.gov.in]
- balancing-method → Wow — Indore turns dung into bus fuel (49w; biogas mass conserve) [https://en.wikipedia.org/wiki/Biogas, https://mnre.gov.in]
- combination-decomposition → Wow — feeding half the world from air (51w; Haber N2+3H2, 200 atm, Fe) [https://en.wikipedia.org/wiki/Haber_process, https://www.iffco.in]
- displacement-double → Wow — welding rails with a chemical fire (54w; thermite Fe2O3+2Al, Railways) [https://en.wikipedia.org/wiki/Thermite, https://indianrailways.gov.in]
- redox → Wow — aluminium from rock and electricity (50w; Hall-Heroult 2Al2O3+3C, NALCO Angul) [https://en.wikipedia.org/wiki/Hall-Heroult_process, https://www.nalcoindia.com]
- corrosion-rancidity → Wow — ships that rust from seawater (50w; galvanic Zn sacrificial) [https://en.wikipedia.org/wiki/Galvanization, https://en.wikipedia.org/wiki/Corrosion]
- Verify: node --check PASS (1/1 inline scripts); file 95593 bytes <2MB; every lesson 3 connect cards with last titled Wow; all 14 URLs https + HEAD-200; facts checked vs linked claims (Haber/thermite/Hall-Heroult/Galvanization/Rancidification); 40–70w each; no unsafe home experiments; books/, reference/, jesc109/ untouched.
