# COVERAGE — keph207 Waves

**Source:** `books/originals/Class11-Physics-Pt2_keph207.pdf` (22 pdf pages, printed pp. 278–299, Reprint 2026–27).  
**SHA-256:** `9f39d09b0556` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph207.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| intro-mechanical | 14.1 | 1–3 | Complete; Fig. 14.1 coupled springs |
| trans-long-pulse | 14.2 | 3–4 | Complete; Fig. 14.2 pulse, Example 14.1 |
| progressive-wave | 14.3 | 5–7 | Complete; Example 14.2 λ = 7.85 cm |
| wave-speed | 14.4 | 8–10 | Complete; √(T/μ) = 93 m/s; Newton 280 vs Laplace 331 |
| superposition | 14.5 | 11–12 | Complete; Fig. 14.9–14.10 |
| standing-waves | 14.6 | 12–16 | Complete; strings and pipes, Example 14.5 |
| beats | 14.7 | 16–17 | Complete; ν_beat = \|ν₁−ν₂\|, Example 14.6 |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 14.1 | (a) mixed (b) long. (c) mixed (d) long. |
| 14.2 | a = 5 mm, λ = 7.85 cm, T = 2.09 s, ν = 0.48 Hz |
| 14.3 | v = 93 m s⁻¹ |
| 14.4 | Newton 280 m s⁻¹; Laplace 331 m s⁻¹ |
| 14.5 | open 2nd harmonic 1.1 kHz; closed — no |
| 14.6 | ν_B = 422 Hz |

## Exercises 14.1–14.19

All 19 mapped with steps in `chapter.json`. Standing-wave items 14.11–14.17 use v = fλ independently.

## Edition note — deleted subtopics, not restored

TOC of this reprint: **14.1–14.7 Beats**, then Summary / Points to ponder / Exercises.

- **Doppler effect** — no section, no formula, no exercise asking for a Doppler shift. Ex 14.19(b) on bats is echolocation (echo timing), not Doppler.
- Older additional-exercise blocks beyond 14.19 are not in this PDF.

Labs: wave pulse, progressive sine, superposition, standing wave, beats. No Doppler lab was added.
