# COVERAGE — keph107 Gravitation

**Source:** `books/originals/Class11-Physics-Pt1_keph107.pdf` (17 pdf pages, printed pp. 127–143, Reprint 2026–27).  
**SHA-256:** `631fbe30827c` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** **ZOOM-FIRST.** The PDF text layer is CID-encoded garbage (`` …). Lessons, equations and exercises were read from `extracted/zooms/p01.png`–`p17.png`. Dict spans used only as a secondary check. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph107.pdf

## Concepts (7)

| ID | Section | PDF pp | Status |
|---|---|---|---|
| kepler | 7.1–7.2 | 1–3 | Complete; Table 7.1 and Example 7.1 from zooms |
| newton-G | 7.3–7.4 | 3–6 | Complete; Example 7.2, Cavendish, two shell theorems |
| g-variation | 7.5–7.6 | 6–8 | Complete; g(h), g(d), Example 7.6 |
| grav-pe | 7.7 | 8–9 | Complete; Example 7.3 square |
| escape | 7.8 | 9–11 | Complete; 11.2 km s⁻¹, Example 7.4 |
| satellites | 7.9 | 11–12 | Complete; T₀≈85 min, Example 7.5 Phobos |
| orbit-energy | 7.10 | 12–14 | Complete; Example 7.8 with independent ΔV sign |

## Examples (zoom-verified)

| Item | Result |
|---|---|
| 7.1 | v_p r_p = v_A r_A; time BAC > time CPB |
| 7.2 | F_R=0; after doubling A, 2Gm² ĵ |
| 7.3 | W=−5.41 Gm²/l ; U=−4√2 Gm/l |
| 7.4 | v=√(3GM/5R) |
| 7.5 | M_Mars=6.48×10^{23} kg; T_Mars=684 d |
| 7.6 | M_E=5.97×10^{24} kg (g) and 6.02×10^{24} kg (Moon) |
| 7.7 | Moon T=27.3 d from k |
| 7.8 | ΔE=+3.13×10⁹ J, ΔK=−3.13×10⁹ J, ΔV=+6.26×10⁹ J |

## Exercises 7.1–7.21

All 21 end-exercises of this reprint mapped from zooms p.15–17. Fig. 7.11 intensity arrows read from zoom p.16. No Additional Exercises in this file.

## Verification and browser QA

- `tests/verify.cjs`: source identity, exercise mapping, recomputation, video metadata and packaging checks.
- `tests/expect.json`: 15 named simulation presets with concrete final-state assertions.
- Browser QA: 118 checks at desktop, tablet and mobile widths, 0 failures, 0 console errors.
- Videos: two candidates per lesson were checked through YouTube oEmbed; the first verified result is wired to each lesson's explicit Wow card.

## Edition notes

- Rationalised 17-page chapter: Kepler, Newton, G, g(h)/g(d), PE, escape, satellites, orbital energy. **No** geostationary-orbit derivation as a numbered section, **no** gravitational potential *theory* beyond V=−GMm/r, **no** deleted older appendices invented.
- Example 7.8 (zoom p.13) prints ΔV=−6.25×10⁹ J while V=−GMm/r must become *less* negative at larger r. Independent: ΔV=+6.26×10⁹ J = 2 ΔE. Flagged in the lesson and in tests.
- G=6.67×10^{-11} in the body (Eq. 7.8); summary table also quotes 6.672×10^{-11}. Tests use 6.67×10^{-11} as in the numerical examples.
