# COVERAGE — jesc102 Acids, Bases and Salts

**Source:** `books/originals/Class10-Science_jesc102.pdf`. NCERT *Science*, Grade 10, Chapter 2 (reprint 2026–27), 20 PDF pages, printed pp. 17–36 (printed page = PDF page + 16).
**SHA-256:** `8ce001e9cd1ab5f842064d1f332d4a64e010c37d5e5e29664bacd9da526f7340`
**NCERT:** https://ncert.nic.in/textbook/pdf/jesc102.pdf

**Build:** `python3 scripts/build_chapter.py jesc102` (shared Class 9/10 pipeline).
**Checks:**
- `node output/Class10/jesc102/tests/verify.cjs` → PASS 298 checks
- `browser_qa.cjs output/Class10/jesc102` → 151 checks, 0 failures, 0 console errors (1280 + 390)

Rebuild from the PDF to the iesc104-shaped standard. Previous `index.html` had no `chapter.json`. Bleaching powder is written **Ca(ClO)₂** as in this reprint (composition noted as complex). Washing soda is the two-step path: heat NaHCO₃ then Na₂CO₃ + 10H₂O. Q8 keeps the PDF spelling `HCL`.

Videos: 7/7 lessons wired from `work/class10-science-videos/results/jesc102.json`. Re-ran `python3 work/class10-science-videos/verify_videos.py jesc102` → PASS (14 oEmbed title+channel matches). One video per wow card.

## Concepts

| # | Concept | NCERT section | PDF pp. | Printed pp. | Lab |
|---|---|---|---|---|---|
| 1 | Indicators | Intro, 2.1.1, Act 2.1–2.2 | 1–3 | 17–19 | `indicators` |
| 2 | Acids with metals and carbonates | 2.1.2–2.1.3, Act 2.3–2.5 | 3–6 | 19–22 | `metals` |
| 3 | Neutralisation and oxides | 2.1.4–2.1.6, Act 2.6–2.7 | 5–6 | 21–22 | `neutralise` |
| 4 | Acids and bases in water | 2.2, Act 2.8–2.10 | 6–9 | 22–25 | `ions` |
| 5 | The pH scale | 2.3–2.3.1, Act 2.11–2.13 | 9–12 | 25–28 | `phscale` |
| 6 | Family of salts | 2.4.1–2.4.2, Act 2.13–2.14 | 12–13 | 28–29 | `salts` |
| 7 | Chemicals from common salt | 2.4.3–2.4.4, Act 2.15 | 14–17 | 30–33 | `saltchem` |

## End-of-chapter exercises (PDF pp. 18–19 / printed 34–35)

All 15 on the revision page with verbatim stems and worked solutions.

| Q | Concept | Answer (short) |
|---|---|---|
| 1 | C1 | (d) 10 |
| 2 | C2 | (b) HCl |
| 3 | C3 | (d) 16 mL |
| 4 | C3 | (c) Antacid |
| 5 | C2 | Zn/Mg/Al/Fe + acid → salt + H₂ |
| 6 | C4 | Activity 2.8 bulb test |
| 7 | C4 | distilled water: no ions; rain water: dissolved acids |
| 8 | C4 | dry HCl has no H⁺(aq) |
| 9 | C5 | D 7; C 11; B 1; A 4; E 9; [H⁺] order C,E,D,A,B |
| 10 | C5 | more fizz in A (strong HCl) |
| 11 | C5 | pH decreases (lactic acid) |
| 12 | C6 | baking soda makes milk slightly alkaline |
| 13 | C7 | POP + moisture → gypsum |
| 14 | C3 | acid + base → salt + water |
| 15 | C7 | washing soda / baking soda uses |

## PDF facts recomputed

- Q3: 20/10 × 8 mL = 16 mL
- Fig. 2.7: gastric ≈ 1.2, lemon ≈ 2.2, blood 7.4, milk of magnesia 10, NaOH ≈ 14
- Chlor-alkali, bleaching powder Ca(ClO)₂, 2NaHCO₃ heat, CuO + 2HCl, 2NaOH + Zn all atom-balanced in `tests/verify.cjs`
- POP at 373 K

## Gaps

- Videos not yet wired.
- Group activities (beetroot indicator, soda-acid extinguisher) described, not separate sims.
- Salt pH lab is the textbook school model; caption says measure a real sample with paper.
