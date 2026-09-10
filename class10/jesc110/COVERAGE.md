# COVERAGE — jesc110 · The Human Eye and the Colourful World

- File: `output/Class10/jesc110/index.html` (95,313 bytes, < 2 MB), single file, no network needed (only outbound links are NCERT source anchors + Wow reference links).
- Source: `books/originals/Class10-Science_jesc110.pdf` (10 pdf-pages, sha256 per `SOURCE-MANIFEST.md`), printed pp. 161–170, Reprint 2026–27. Extracted with `pdftotext` before authoring.
- Concepts: 7 (21 practice questions: 17 MCQ + 4 numeric; E/M/H one per concept).

| # | Concept | NCERT § | PDF pp. | Printed | Sim |
|---|---|---|---|---|---|
| 01 | The eye as a camera | 10.1 | 1–2 | 161–162 | eye (distant default) |
| 02 | Accommodation, near/far point | 10.1.1 | 2–3 | 162 | eye (25 cm default) |
| 03 | Myopia + concave correction | 10.2(a) | 3–4 | 162–163 | defects (myopia) |
| 04 | Hypermetropia, presbyopia, bifocals | 10.2(b)–(c) | 4 | 163–164 | defects (hypermetropia) |
| 05 | Prism refraction, deviation | 10.3 + Act 10.1 | 5–6 | 165 | prism (single colour) |
| 06 | Dispersion, recombination, rainbow | 10.4 + Act 10.2 | 6–7 | 166–167 | prism (white mode) |
| 07 | Atmospheric refraction + scattering | 10.5–10.6 | 7–10 | 168–170 | sky (5 scenarios) |

## Sims (models independent of rendering)
- **eye**: thin-lens `P = 1/v − 1/u` (lens sign convention reused from jesc109 pilot: `1/v − 1/u = 1/f`); retina fixed 2.3 cm; range 43.48 D → 47.48 D (+4 D amplitude ⇒ 25 cm near point). Blur shown when object < 25 cm.
- **defects**: vergence correction; myopia preset +3 D excess (full fix ≈ −3 D), hypermetropia preset −3 D shortfall for 25 cm (full fix ≈ +3 D). Signs: concave minus, convex plus.
- **prism**: exact vector Snell trace at both faces, apex 60°, n = 1.51/1.52/1.54; TIR at 2nd face computed and shown. D = i + e − A readout per colour.
- **sky**: qualitative stage (5 chips); NCERT numbers quoted (2 min Sun shift, red λ ≈ 1.8× blue); star flicker is a learner-pressed toggle (no autoplay, reduced-motion safe).

## Exercise mapping (honest)
- All 12 exercises located in chapter revision map: Ex 1–4, 8–9 → c02; Ex 2 → c01; Ex 5 → c03/04; Ex 6 → c03; Ex 7 → c04; Ex 10–12 → c07. In-text Q1–Q4 → c02/c03/c02/c03.
- Practice tags say “NCERT …” only where the item is the textbook question (values identical); otherwise “Original practice · §…”.
- Checked numbers: −5.5 D → −18.2 cm; +1.5 D → +66.7 cm; 80 cm far point → −1.25 D; 1 m near point → +3 D; D_yellow(50°) = 38.9° (exact recomputation, independent script); ordering red < yellow < violet.
- Eye-donation box: background values note in c01, flagged as non-examined (not inflated into physics questions).

## Checks run
- Python structural audit: 7 lessons, 21/21 question ids, all `data-sim` containers have JS initialisers, all `data-wrong` parse as JSON, brace/paren balance 0.
- `node --check` on core + sim scripts: pass.
- Independent recomputation (node): prism deviations, eye powers, prescription powers, E5 focal lengths — all match displayed values after fixing two rounding slips (39.1→38.9; violet 39.5→40.7).
- Control-wiring audit: every `.in-*`/`.out-*` class queried by JS exists in HTML.
- Offline audit: no `src=`/`fetch`/iframe; only NCERT anchor links + internal SVG gradient refs.

## Gaps (not claimed)
- No real-device/browser render test (no headless browser in env); responsive + keyboard + reduced-motion handled in code mirroring the pilot, but 360/768/1280/1440 px verification is pending.
- No screen-reader run; sliders have `aria-label`s, readouts `aria-live="polite"`, sims have text fallbacks (captions + worked examples).
- Static SVG fallback when JS is off: explanations/worked examples/revision remain; sim scenes need JS (noted in `<noscript>`).
- Plan/progress persistence uses `localStorage` guarded in try/catch (file:// safe).

## Wow layer — 2026-09-07
- Every concept keeps its 2 core connect cards; a third `connect-card wow` card was appended in each `connect-grid` (7/7 lessons), each 41–55 words with 1–2 https links (Wikipedia + official) and an offline note. CSS `.connect-card.wow` badge + `.ext-links` + `.offline-note` mirrored from the jesc109 pilot tokens (same `--blue/--soft/--muted`). Adaptation note: these chapters are static HTML (no JS connect renderer exists), so no JS changed; offline core untouched, Lumen layout preserved.
- Cards (hook — links): eye-parts “Eyes that mix up colours” (Ishihara, screening-only) — Color_blindness; accommodation “A ten-minute lens exchange” (IOL camps) — Cataract_surgery + WHO blindness fact sheet; myopia “Spectacles for a telescope” (Hubble 2.2 µm edge error, COSTAR 1993) — Hubble_Space_Telescope + NASA Hubble; hypermetropia “Franklin's two-in-one lens” (generally credited, hedged) — Bifocals; prism “The prism grows up” (spectrometer) — Spectrometer; dispersion “Cherapunji's monsoon bow” (42°) — Rainbow + IMD; sky “Blue over the Thar, beams on the expressway” (scattering + Tyndall) — Tyndall_effect + IMD.
- Checks: word counts 41–55 asserted by script; all URLs https + HEAD 200 (IMD/NASA/WHO/Wikipedia); `node --check` PASS on 3 inline scripts; `tests/verify-course.cjs` PASS; 95,313 B < 2 MB; no new `src=`/`fetch`/iframe (only outbound `<a>`).
- Gaps: link rot needs periodic re-check; new cards not yet seen in a real browser render (same pending matrix as before); no YouTube links used.

## Fix log — 2026-09-07 (REVIEW U1-110 + B4 + follow-up)
- U1 L-sky worked example: previously `470 nm × 1.8 ≈ 850 nm` presented as red-light, but 850 nm is infrared. Verified PDF via `pdftotext`: §10.6.2 says "red light has wavelength about 1.8 times greater than blue light" (rough textbook comparison, no 850 nm claim). Replaced with visible-only example: blue ≈ 470 nm, red ≈ 650 nm → ratio ≈ 1.38, both 400–750 nm; NCERT 1.8× kept only as quoted rough comparison in quick + sim body, with explicit warning not to multiply literally to IR. No IR presented as red.
- B4 eye power: whole-eye numbers (43.5 D, 43.98 D, 44.48 D, 43.5→47.5 D +4 D) were labelled "lens power" while text also says cornea does most bending. Relabelled consistently to combined simplified optical system (cornea + lens lumped at one plane) in key equation, deeper, worked, both eye lab captions, Medium quiz prompt/solution, accommodation quick/key/worked/revise, revision grid, JS readout (`Combined eye power... / model eye supplies...`) and SVG label (`eye (combined)`). Captions now state model limits visibly (real cornea ~2/3, lens fine-tunes). Spectacle-lens powers (−1.25 D, +3 D, −5.5/+1.5 D) left as spectacle lenses.
- Audit: verified 2.3 cm → 43.48 D, 2 m → 43.98 D, 1 m → 44.48 D, +4 D for 25 cm, −5.5 D → −18.2 cm, +1.5 D → +66.7 cm, 80 cm → −1.25 D, 1 m → +3 D, 1.2 m → −0.83 D, prism D 38.1/38.9/40.7° at i=50° (Snell recomputed), 2+2=4 min day stretch, pupil 8→2 mm =16× light, all keys. Hard Qs already reasoning (diagnose/interpret multistep); e.g. q110b-h clarified to combined power. Page targets PDF pp. 1–10 within 10 pp; file 89,497 B <2 MB; no CDN/src/fetch/iframe; `node --check` PASS on 3 inline scripts.
