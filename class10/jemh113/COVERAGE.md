# jemh113 Statistics pilot — coverage (verified against locked extraction)

Source: `books/originals/Class10-Maths_jemh113.pdf`, 31 pdf pages, printed pp. 171–201, Reprint 2026–27. Extraction: `scripts/extract_maths.py` (PyMuPDF dict spans + raw text) plus PNG-zoom verification of every worked table/equation authored below.

Zoom-verified numbers (rendered at 2.5× from the source PDF, read in-chat before authoring):
- PDF p.4 (Table 13.3): xi = 17.5, 32.5, 47.5, 62.5, 77.5, 92.5; fixi = 35.0, 97.5, 332.5, 375.0, 465.0, 555.0; Σfi = 30, Σfixi = 1860.0; mean 1860.0/30 = 62; 59.3 exact vs 62 approximate (mid-point assumption).
- PDF p.6 top (assumed mean): x-bar = 47.5 + 435/30 = 47.5 + 14.5 = 62; Activity 1 (any a → 62).
- PDF p.6 bottom (Table 13.5): ui = −2, −1, 0, 1, 2, 3; fiui = −4, −3, 0, 6, 12, 18; Σfiui = 29; x-bar = 47.5 + 15×(29/30) = 62.
- PDF p.9 (Table 13.7): Σfi = 35, Σfixi = 1390, Σfidi = −360, Σfiui = −36; all three methods → 39.71.
- PDF p.10 (Table 13.8): uifi = −56, −30, −60, 0, 10, 30; Σ = −106; x-bar = 200 + 20×(−106/45) = 152.89; unequal class sizes with h = 20.
- PDF p.15 (Example 5): Mode = 3 + ((8−7)/(2×8−7−2))×2 = 3 + 2/7 = 3.286; (Example 6) modal 40–55 → 40 + ((7−3)/(14−3−6))×15 = 52, mean 62.
- PDF p.23 (median): n/2 = 26.5, l = 60, cf = 22, f = 7, h = 10 → 60 + 45/7 ≈ 66.4.
- PDF p.25 (Example 7): 145 + (72.5/18) = 149.03 cm.
- PDF p.26 (Example 8): 76 + x + y = 100; 525 = 500 + ((50−36−x)/20)×100 → x = 9, y = 15.

| NCERT block | PDF pp. | Concept | Status |
|---|---|---|---|
| 13.1 Introduction (mean/median/mode, ogives) | 1 | classmark-direct Connect (census), ogive-median Connect | referenced (motivating framing, not assessed) |
| 13.2 Mean: ungrouped Table 13.1 (59.3), grouped Table 13.2/13.3 (62), class mark, mid-point assumption | 2–4 | classmark-direct | implemented, zoom-verified |
| 13.2 Assumed mean Table 13.4 (a = 47.5, Σfidi = 435), Activity 1 | 4–6 | assumed-mean | implemented, zoom-verified |
| 13.2 Step-deviation Table 13.5 (Σfiui = 29), formula holds for any a/h | 6–7 | step-deviation | implemented, zoom-verified |
| Example 2 (female teachers, all three methods → 39.71), Remark on method choice | 8–9 | step-deviation quizzes/deeper | implemented, zoom-verified |
| Example 3 (wickets, unequal classes, a = 200 h = 20 → 152.89) | 10 | step-deviation | implemented, zoom-verified |
| Ex 13.1 Q1–9 | 11–13 | all mean concepts | located in exerciseMap; Q-patterns covered (missing-f, discontinuous, unequal widths in quizzes/deeper) |
| 13.3 Mode: Example 4 (ungrouped 2), modal class + formula, Examples 5–6 (3.286, 52 vs 62) | 13–16 | modal-class | implemented, zoom-verified |
| Ex 13.2 Q1–6 | 16–17 | modal-class | located; modal + mean patterns in quizzes |
| 13.4 Median ungrouped (Tables 13.9–13.11 → 28.5), cf less-than/more-than (Tables 13.12–13.14), Table 13.15, median class 60–70 → 66.4 | 18–23 | median-class | implemented, zoom-verified |
| Examples 7–8 (149.03; x = 9, y = 15), which-measure discussion, empirical 3Median = Mode + 2Mean | 24–27 | median-class, ogive-median | implemented, zoom-verified; empirical relation in model + tests |
| Ogives: NOTE — this print has no drawn ogive figures; less-than/more-than tables (PDF pp.21–22) + Note-to-Reader rules (continuous classes, free scales) ground the graphical median 66.4 | 21–22, 31 | ogive-median | implemented as sketch sim from the cf tables; no NCERT ogive figure to trace |
| Ex 13.3 Q1–7 | 28–30 | median-class, ogive-median | located; median/continuity patterns in quizzes |
| 13.5 Summary + Note to Reader (continuity, ogive scales) | 30–31 | ogive-median | implemented in deeper/recall |

Wow videos (oEmbed-verified 2026-09-08; rule: never invent IDs; pending marked honestly):
- classmark-direct: k3aKKasOmIw — "Finding mean, median, and mode | Descriptive statistics | Probability and Statistics | Khan Academy" (oEmbed OK).
- assumed-mean / step-deviation / modal-class / median-class / ogive-median: no fitting reputable 3–12 min video found after genuine oEmbed checks (several guessed IDs 404/400); reading link kept, video pending noted in-card. This matches the jemh108 precedent ("No fitting reputable video found … read the lesson's worked numbers instead").

Gaps (honest): full 22-item exercise bank is mapped, not fully solved in-page; leaf-length continuity correction (Ex 13.3 Q4, 117.5–126.5) and SO2/absentee decimal/unequal-width drills are quiz/deeper patterns, not full solutions; five Wow videos pending (no reputable fit found, not skipped); browser matrix/teacher/learner review pending.
