# COVERAGE — keph106 Systems of Particles and Rotational Motion

**Source:** `books/originals/Class11-Physics-Pt1_keph106.pdf` (35 pdf pages, printed pp. 92–126, Reprint 2026–27).  
**SHA-256:** `88e0ad16f315` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph106.pdf

## Concepts (8)

| ID | Section | PDF pp | Status |
|---|---|---|---|
| rigid-cm | 6.1–6.2 | 1–8 | Complete; Examples 6.1–6.3 zoom-verified |
| motion-cm | 6.3 | 8–10 | Complete |
| system-P | 6.4 | 10–12 | Complete |
| cross-omega | 6.5–6.6 | 12–16 | Complete; Example 6.4 zoom p.12 |
| torque-L | 6.7 | 16–18 | Complete; Example 6.5 τ=2î+12ĵ+10k̂ |
| equilibrium | 6.8 | 18–23 | Complete; Examples 6.8–6.9 |
| inertia-kin | 6.9–6.10 | 23–27 | Complete; Table 6.1 quoted, not re-derived |
| dynamics-Lcons | 6.11–6.12 | 27–33 | Complete; Example 6.12 + Iω |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 6.1 | X=5/18 m, Y=√3/9 m |
| 6.2 | triangular lamina CM = centroid |
| 6.3 | L-lamina (5/6, 5/6) m |
| 6.4 | a·b=−25; a×b=7î−ĵ−5k̂ |
| 6.5 | τ=2î+12ĵ+10k̂ |
| 6.6 | ℓ of a free particle is constant |
| 6.8 | R1=54.88 N, R2=43.12 N |
| 6.9 | F1=34.6 N, N=196 N, F2=199 N, α≈80° |
| 6.11 | α=4π rad s⁻², 576 rev |
| 6.12 | α=12.5 rad s⁻², W=ΔK=50 J |

## Exercises 6.1–6.17

All 17 end-exercises of this reprint mapped. No Additional Exercises in this rationalised file.

## Verification and browser QA

- `tests/verify.cjs`: 138 source, structure, exercise, recomputation, video and packaging checks.
- `tests/expect.json`: 15 named simulation presets with concrete final-state assertions.
- Browser QA: 126 checks at desktop, tablet and mobile widths, 0 failures, 0 console errors.
- Videos: two candidates per lesson were checked through YouTube oEmbed; the first verified result is wired to each lesson's explicit Wow card.

## Edition notes (honest gaps)

- **No parallel-axis theorem** and **no perpendicular-axis theorem** sections in this 35-page reprint (older prints had them). Table 6.1 is quoted without derivation, as the book states.
- **Rolling without slipping** is introduced in §6.1.1 as translation + rotation (Fig. 6.2, 6.6) and the chapter then restricts itself to **rotation about a fixed axis**. There is no later section with K=½mv²+½Iω² or v=ωR as a numbered development. Not invented.
- Vector product of two vectors is in §6.5 (promised from Ch. 5).
