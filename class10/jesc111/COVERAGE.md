# COVERAGE — jesc111 · Electricity

- File: `output/Class10/jesc111/index.html` (98,218 bytes, < 2 MB), single file, offline-safe (only NCERT anchor links + Wow reference links).
- Source: `books/originals/Class10-Science_jesc111.pdf` (24 pdf-pages, sha256 per manifest), printed pp. 171–194, Reprint 2026–27. Extracted with `pdftotext` first.
- Concepts: 8 (24 practice questions: 16 MCQ + 8 numeric).

| # | Concept | NCERT § | Printed | Sim |
|---|---|---|---|---|
| 01 | Current, circuit, symbols, meters | 11.1 + 11.3 | 171–174 | circuit (series) |
| 02 | Potential difference, voltmeter | 11.2 | 173–174 | circuit (series) |
| 03 | Ohm's law, V–I graph, rheostat | 11.4 | 175–176 | ohmgraph (+Ex7 dots) |
| 04 | R = ρl/A, table, alloys | 11.5 | 177–180 | rho (5 materials) |
| 05 | Series: same I, Rs = ΣR | 11.6.1 | 181–184 | circuit (series) |
| 06 | Parallel: same V, 1/Rp = Σ1/R | 11.6.2 | 185–187 | circuit (parallel) |
| 07 | Joule heating, bulb, fuse | 11.7–11.7.1 | 188–190 | heat (+fuse tester) |
| 08 | Power, kWh, bill | 11.8 | 191–192 | bill (6 presets) |

## Sims
- **circuit**: exact laws; series Rs = R1+R2 (same I, V splits), parallel Rp = R1R2/(R1+R2) (same V, I splits); live I/V/P; mA readout; 5 A fuse-trip warning. Replays Ex 11.7 (24 Ω, 0.25 A, 5 V + 1 V).
- **ohmgraph**: V–I line slope = R at fixed T; overlays real NCERT Ex7 dots with mean V/I ≈ 3.33 Ω fit note.
- **rho**: R = ρl/A with Table 11.2 ρ at 20 °C (Cu 1.62e-8 … nichrome 100e-6 + manganese 1.84e-6); diameter-squared scaling live. Replays Ex 11.5 (26 Ω → manganese) and Ex 11.6 (4 Ω → 1 Ω).
- **heat**: H = I²Rt exact; appliance fuse tester I = P/220 vs 1/2/3/5/10 A ratings. Replays in-text iron (15 kJ) and 1 kW → 4.55 A → 5 A fuse.
- **bill**: E = P·h·d/1000 kWh; 1 kWh = 3.6 MJ; cost = E × tariff; 220 V current hint. Replays Ex 11.13 (96 kWh, ₹288) and settles Ex16 TV-vs-toaster (250 vs 200 Wh).

## Exercise mapping (all 18 located)
Ex 1 → c06 · Ex 2 → c08 · Ex 3 → c08 · Ex 4 → c06/08 · Ex 5 → c02 · Ex 6 (122.7 m; 2.5 Ω) → c04 · Ex 7 → c03 · Ex 8 (4800 Ω; mA→A stressed) → c01–03 · Ex 9 (0.67 A) → c05 · Ex 10 (4) → c06 · Ex 11 (9 Ω; 4 Ω) → c05/06 · Ex 12 (110 lamps) → c06/08 · Ex 13 (9.17/4.58/18.33 A) → c05/06 · Ex 14 (8 W both) → c05/06/08 · Ex 15 (0.73 A) → c08 · Ex 16 → c08 · Ex 17 (1100 W; 7.92 MJ) → c07/08 · Ex 18 → c04/06/07. All in-text §11.1–11.8 question sets mapped in the revision exmap; Examples 11.1–11.13 each replayed in their concept. Verified: Ex 11.3 (0.183/2.2 A), 11.4 (15 Ω → 8 A), 11.8 (2.4/1.2/0.4 A, Rp 3 Ω), 11.9 (18 Ω, 0.67 A), 11.10 (3.82 A/57.6 Ω; 1.64 A/134.15 Ω), 11.11 (5 A, 20 V), in-text 96000 C → 4.8 MJ, Q-ratios 25 / 1:4 / 25 W all rechecked.

## Checks run
- Structural audit: 8 lessons, 24/24 questions, sim handlers present, wrong-JSON parses, balances 0. `node --check` pass. Control-wiring audit: NONE missing. Offline audit: clean.
- Sign/law conventions: series/parallel laws, P = VI = I²R = V²/R, kW↔W, mA→A conversions labelled in labs.

## Gaps
- No browser/device run (see jesc110 gaps — same code family, same pending matrix); accessibility provisions present but not screen-reader tested.
- V–I sim holds R fixed (ideal); filament drift covered in text, not simulated.
- Fuse melting curve is threshold-exact, not time-current modelled (stated in caption).

## Wow layer — 2026-09-07
- Every concept keeps its 2 core connect cards; a third `connect-card wow` card was appended in each `connect-grid` (8/8 lessons), each 41–55 words with 1–2 https links and an offline note. Same pilot-mirrored CSS + static-file adaptation as jesc110 (no JS changed; offline core untouched).
- Cards (hook — links): current “The inverter takes over mid-blink” (standby source, descriptive, no DIY) — Uninterruptible_power_supply; potential “25,000 volts overhead” (pantograph, look-don't-touch) — 25_kV_AC_railway_electrification + Indian Railways; ohms-law “A V–I curve flies to the Sun” (Aditya-L1 panels + battery, L1 1.5 M km; photovoltaic context, no fabrication detail) — Solar_cell + ISRO Aditya-L1; resistance-factors “Why the electrician reaches for fat wire” (ρl/A gauge choice, descriptive) — Standard_wire_gauge; series “The meter that must join the queue” (ammeter in series) — Ammeter; parallel “The meter that bridges from the side” (voltmeter in parallel) — Voltmeter; heating “Boards that know every appliance by name” (5 A lighting / 15 A power, MCB vs fuse wire) — Fuse_(electrical) + Circuit_breaker; power “The bill that rewards the swap” (9 W LED ≈ 1.35 units/month vs 100 W filament 15 units; BEE star-rated LED) — BSES Delhi + BEE.
- Checks: word counts 41–55 asserted by script; all URLs https + HEAD/GET 200 (BEE 405 on HEAD, 200 on GET); `node --check` PASS on 3 inline scripts; `tests/verify-course.cjs` PASS; 98,218 B < 2 MB; no new `src=`/`fetch`/iframe.
- Gaps: link rot needs periodic re-check; new cards not yet browser-rendered; no YouTube links used.

## Fix log — 2026-09-07 (REVIEW U1-111 + B4 + follow-up)
- U1 L-resistance-factors: `Copper (~1.6e-8) vs nichrome (100e-6): six million times apart` — ratio is 100e-6/1.6e-8 = 6,250 (~six thousand). Fixed wording to `ratio ... = 6,250 — about six thousand times apart`, with formula shown. Transcribed Table 11.2 verified via `pdftotext books/originals/Class10-Science_jesc111.pdf` before changing wording (source values kept): Ag 1.60e-8, Cu 1.62e-8, Al 2.63e-8, W 5.20e-8, Ni 6.84e-8, Fe 10.0e-8, Cr 12.9e-8, Hg 94.0e-8, Mn 1.84e-6, Constantan 49e-6, Manganin 44e-6, Nichrome 100e-6 — MATS in sim match; only arithmetic wording corrected.
- B4 fuse "exact": `Fuse rule exact: blows when...` implied measured time response. Reworded to stated classroom simplification: instantaneous threshold in sim, real fuses follow time–current curve (brief overloads may hold). H=I²Rt kept as ideal-model law.
- B2 Hard reasoning: `L-resistance-factors` Hard (alloys) was recall of two textbook reasons. Kept 3 levels, answer still alloys-high-ρ+oxidation-resistant; prompt now gives same-size copper vs alloy scenario requiring diagnosis (compact R + red-heat survival) and why pure metal fails; solution retained.
- Audit: recomputed all display numbers — Q=300 C, 1.9e21 e⁻, W=24 J, 0.183/2.2 A, R=15 Ω→8 A, Ex7 mean 3.33 Ω, Ex11.5 A=7.07e-8 m²→1.84e-6 Mn, Ex11.6 1 Ω, series 24 Ω/0.25 A/5+1 V, 25 Ω/0.24 A/2.88 V, parallel 4 A/Rp 3 Ω, Rp 3.33 Ω/3.6 A, R/25, 4.8 MJ, 15 kJ, 3.82 A/57.6 Ω + 1.64 A/134.15 Ω (PDF-rounded), 5 A/20 V, 96 kWh/₹288, 110 W, 25 W (V²), 250 vs 200 Wh, 122.7 m→2.5 Ω — all match PDF/keys. Page targets PDF pp. 1–22 within 24 pp; file 91,567 B <2 MB; no CDN/src/fetch/iframe; `node --check` PASS on 3 inline scripts.
