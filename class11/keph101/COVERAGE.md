# COVERAGE — keph101 Units and Measurement

**Source:** `books/originals/Class11-Physics-Pt1_keph101.pdf` (12 pdf pages, printed pp. 1–12, Reprint 2026–27).  
**SHA-256:** `2685cb3e2582` (full hash in `output/Class11/SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 2× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/keph101.pdf

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| si-units | 1.1–1.2 | 1–3 | Complete. Table 1.1 2018 definitions zoom-verified (p.2). Ampere uses e = 1.602176634×10⁻¹⁹ C (stacked OCR in raw_text is untrustworthy). |
| sig-figs | 1.3 | 3–5 | Complete. Rules and 4.700 m scientific-notation example. |
| arith-round | 1.3.1–1.3.2 | 5–6 | Complete. Examples 1.1–1.2 zoom p.6. |
| uncertainty | 1.3.3 | 6–7 | Complete. 164 ± 3 cm² zoom-verified. |
| dimensions | 1.4–1.5 | 7–8 | Complete. |
| homogeneity | 1.6.1 | 8–9 | Complete. Examples 1.3–1.4. |
| deduce-relations | 1.6.2 | 9–10 | Complete. Example 1.5 pendulum exponents. |

This reprint has **no “Errors in measurement / least count / combination of errors” numbered subsection** as a standalone §1.x beyond 1.3.3, and **no separate chapter on error analysis**. Combination of errors is taught inside 1.3.3 only.

## Examples (all zoom-verified)

| Item | Result |
|---|---|
| Table 1.1 | c = 299792458 m s⁻¹; h = 6.62607015×10⁻³⁴ J s; Δν_Cs = 9192631770 Hz; e = 1.602176634×10⁻¹⁹ C; k = 1.380649×10⁻²³ J K⁻¹; N_A = 6.02214076×10²³ mol⁻¹; K_cd = 683 |
| 1.1 | side 7.203 m → area 311.3 m², volume 373.7 m³ |
| 1.2 | 5.74 g / 1.2 cm³ = 4.8 g cm⁻³ |
| 1.3 | ½mv² and mgh both [M L² T⁻²] |
| 1.4 | (a)(c)(e) ruled out; (b)(d) survive; physics picks (b) |
| 1.5 | T = k √(l/g); k = 2π not from dimensions |

## Exercises 1.1–1.17

All 17 are mapped with steps in `chapter.json`. Numerical items were independently recomputed, including Ex 1.12 (2.34032 kg rounds to 2.34 kg), Ex 1.14 (3.15×10⁻⁷ m³ atomic volume per mole), Ex 1.15 (molar-to-molecular volume ratio ≈ 8.9×10³), and Ex 1.17 (mean solar density ≈ 1.4×10³ kg m⁻³). Open qualitative items (1.4, 1.8, 1.16) keep NCERT wording and do not invent extra parts.

## Videos and QA

Each of the seven lessons has one real YouTube video on its explicit Wow card. IDs, titles and channels were independently checked through YouTube oEmbed and are recorded in `work/class11-physics-videos/results/keph101.json`. The chapter fixture verifies the exact source PDF hash, all exercise pages, worked numerical results, video metadata, scenario coverage and single-file packaging. Browser QA covers all 24 lab presets at desktop, tablet and 390 px phone widths.

## Edition notes / honest gaps

- Table 1.2, Appendix A2/A6/A7/A8/A9 are referenced by the chapter but live in the book’s back matter, not in this 12-page PDF. Prefixes and extra derived-unit tables are **not** duplicated here.
- Least-count / systematic-vs-random error taxonomy of older prints is **not** a numbered section in this reprint; only 1.3.3’s three remarks.
- No end-of-chapter Additional Exercises in this PDF.
