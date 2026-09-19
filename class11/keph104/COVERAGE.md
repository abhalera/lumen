# COVERAGE — keph104 Laws of Motion

**Source:** `books/originals/Class11-Physics-Pt1_keph104.pdf` (22 pdf pages, printed pp. 49–70, Reprint 2026–27).  
**SHA-256:** `8a5df412b53d` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph104.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| inertia-n1 | 4.1–4.4 | 1–5 | Complete. Example 4.1 a=0. |
| second-law | 4.5 | 5–8 | Complete. Examples 4.2 (270 N), 4.3 (F=mg). |
| impulse | 4.5 impulse | 7–9 | Complete. Examples 4.4 (3.6 N s), 4.5 (ratio ≈1.2). |
| third-law | 4.6 | 8–10 | Complete. |
| momentum-eq | 4.7–4.8 | 9–11 | Complete. Example 4.6 θ=40° (zoom p.11). |
| friction | 4.9 | 11–15 | Complete. Examples 4.7–4.9; 4.9 zoom p.14: a=0.96 m s⁻², T=27.1 N. |
| circular-dyn | 4.10 | 15–17 | Complete. Examples 4.10–4.11 zoom p.16: v₀=28.1, v_max=38.1 m s⁻¹. |
| fbd | 4.11 | 16–18 | Complete. Example 4.12: 20 N then 267.3 N. |

There is **no numbered Example 4.10a/4.13 in-chapter beyond 4.12**. Example numbering in this reprint is 4.1–4.12 (4.10 cyclist, 4.11 racetrack, 4.12 floor).

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| 4.1 | astronaut a=0 |
| 4.2 | 270 N average |
| 4.3 | F=mg |
| 4.4 | impulse 3.6 N s |
| 4.5 | wall force normal both cases; ratio 2/√3 ≈ 1.2 |
| 4.6 | tan θ=5/6, θ=40° (g=10) |
| 4.7 | a_max=1.5 m s⁻² (g=10) |
| 4.8 | μ_s=tan 15°=0.27 |
| 4.9 | a=22/23=0.96 m s⁻², T=27.1 N (g=10) |
| 4.10 | slips (v²=25 > μ_s Rg=2.94), g=9.8 |
| 4.11 | v₀=28.1 m s⁻¹, v_max=38.1 m s⁻¹, g=9.8 |
| 4.12 | 20 N; 267.3 N (g=10) |

## Exercises 4.1–4.23

All 23 mapped. The exercise header says **take g=10 m s⁻²** for numerical work. Fig. 4.16 (zoom p.21): x=0 (t<0), linear to (4 s, 3 m), then constant — impulse ±3 N s.

## Verification and browser QA

- `tests/verify.cjs`: 519 source, structure, exercise, calculation, video and packaging checks.
- `tests/expect.json`: 13 named simulation presets with concrete final-state assertions.
- Browser QA: 112 checks at desktop, tablet and mobile widths, 0 failures, 0 console errors; concept, revision and responsive screenshots captured.
- Videos: two candidates per lesson were independently checked through YouTube oEmbed; the first verified result is wired to each lesson's explicit Wow card.

## Edition notes / honest gaps

- No Additional Exercises in this 22-page PDF.
- Connected-body / pulley problems in the *body* text are Example 4.9 only; Atwood is Exercise 4.16, not an in-chapter example.
- Pseudo-force / non-inertial frames are **not** a numbered section. Not invented.
- Vertical circular motion (loop-the-loop) is **not** in this reprint’s §4.10 (only level and banked cars, plus the string-and-peg exercise 4.4 / 4.21). Not invented.
