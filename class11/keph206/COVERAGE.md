# COVERAGE — keph206 Oscillations

**Source:** `books/originals/Class11-Physics-Pt2_keph206.pdf` (19 pdf pages, printed pp. 259–277, Reprint 2026–27).  
**SHA-256:** `adc85e61480a` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph206.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| periodic-oscillatory | 13.1–13.2 | 1–4 | Complete; Example 13.1 heart 1.25 Hz |
| shm-definition | 13.3 | 4–6 | Complete; Eq. (13.4) |
| shm-ucm | 13.4 | 6–7 | Complete; reference circle |
| vel-acc-shm | 13.5 | 8–9 | Complete; Example 13.5 |
| force-spring | 13.6 | 9–10 | Complete; T = 2π√(m/k), Example 13.6 |
| energy-shm | 13.7 | 10–12 | Complete; E = ½kA² = 0.25 J |
| simple-pendulum | 13.8 | 12–13 | Complete; T = 2π√(L/g), L ≈ 1 m |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 13.1 | ν = 1.25 Hz, T = 0.80 s |
| 13.2 | (i)(ii) periodic; (iii)(iv) not |
| 13.3 | (1) SHM; (2) sin² ωt periodic not SHM |
| 13.5 | x = −3.54 m, v ≈ 22.1 m/s, a ≈ 140 m/s² |
| 13.6 | two springs: T = 2π√(m/2k) |
| 13.7 | E = 0.25 J; at 5 cm, U = 0.0625 J, K ≈ 0.19 J |
| 13.8 | seconds pendulum L ≈ 1 m |

## Exercises 13.1–13.18

All 18 mapped with steps in `chapter.json`. Fig. 13.18, 13.19, 13.20, 13.21 read from zooms p.16–18.

## Edition note — deleted subtopics, not restored

TOC of this reprint: **13.1–13.8 The simple pendulum**, then Summary / Points to ponder / Exercises.

- **Damped oscillations** — no section. Intro still promises “later in the chapter”; that later text is absent. Points to Ponder 9 has one sentence: damped SHM is not strictly SHM.
- **Forced oscillations and resonance** — no section.

Labs are mass-spring and pendulum only. No driven/damped oscillator was added.

## Standard audit (keph206)

Audited all 19 source PDF pages (printed 259–277), froze 18 exercise fixtures, normalized lesson worked examples and verified video metadata. `tests/verify.cjs` PASS 47 checks. Browser QA PASS 71 checks, 0 failures, 0 console errors.
