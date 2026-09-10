# COVERAGE — jesc112 · Magnetic Effects of Electric Current

- File: `output/Class10/jesc112/index.html` (92,887 bytes, < 2 MB), single file, offline-safe (only NCERT anchors + Wow reference links).
- Source: `books/originals/Class10-Science_jesc112.pdf` (13 pdf-pages, sha256 per manifest), printed pp. 195–207, Reprint 2026–27. **Read first**: this rationalised edition contains NO motor/generator construction and NO electromagnetic-induction section — only a name-list of devices (§12.3) and the MRI box. Nothing beyond the source was imported.
- Concepts: 7 (21 practice questions: 20 MCQ + 1 numeric).

| # | Concept | NCERT § | Printed | Sim |
|---|---|---|---|---|
| 01 | Field lines (compass, filings, rules) | 12.1 | 195–197 | compass probe |
| 02 | Straight-wire circles, RH thumb rule | 12.2–12.2.2 | 197–199 | wire (I/direction/distance) |
| 03 | Circular loop, n-turn scaling | 12.2.3 | 200–201 | coil (1 turn) |
| 04 | Solenoid, uniform field, electromagnet | 12.2.4 | 201–202 | coil (100 turns, core) |
| 05 | Force on current, Fleming left hand | 12.3 | 202–204 | fleming (B×I→F + e⁻ flip) |
| 06 | Domestic wiring: live/neutral/earth | 12.4 | 204–205 | domestic (parallel loads) |
| 07 | Fuse, overload, short circuit | 12.4 + §11.7 | 205–206 | domestic (short button) |

## Sims
- **compass**: probe along bar-magnet loops; needle = tangent (B direction), crowding = strength; never-cross rule live.
- **wire**: top-view circles; sense exact by RH rule (out-of-page = anticlockwise, verified by l̂×r̂); reversal flips all arrows; I ↑ strengthens, distance ↑ weakens (schematic fall-off, stated).
- **coil**: field ∝ N·I exact per NCERT; air vs soft-iron core (×200 labelled schematic); loop-centre straight lines; interior uniform lines per Fig. 12.10; poles swap on reversal; zero at I = 0.
- **fleming**: exact F direction for perpendicular I,B via I×B with hand aide; electron toggle flips effective current (replays Ex 12.2 → into page); ZERO shown for I ∥ B (largest at 90°).
- **domestic**: parallel 220 V loads, I = ΣP/220 vs 5/15 A ratings; earth path drawn; short-circuit button (≈400 A schematic spike, labelled).

## Exercise mapping (all 9 located + honest gap)
Ex 1 (d) → c02 · Ex 2 (c) → c07 · Ex 3a (true) → c03, 3b (false, green = earth) → c06 · Ex 4 → c01/02 · Ex 5 → c05 · Ex 6 (B upward — derived, not memorised) → c05 · Ex 7(i)(ii) → c02/c05, **7(iii) flagged as beyond this edition** (needs induction rule deleted from source; students told to ask teacher) · Ex 8 → c07 · Ex 9 → c06. Ex 12.1 (south below, north above — cross-product verified) → c02; Ex 12.2 (d) → c05. All in-text sets mapped. No F = BIl formula introduced (edition is qualitative: “larger I/B/l → larger kick”).

## Checks run
- Structural audit: 7 lessons, 21/21, handlers present, JSON ok, balances 0. `node --check` pass. Wiring audit clean. Offline audit clean.
- Independent direction audit (node cross products): Ex12.1 below/above, Q6, alpha-particle Q, sim default, wire east-point — all agree with displayed answers. Fixed during build: wire tangent sign, compass arrowhead direction, Fleming coordinate frame.

## Wow layer — 2026-09-07
- Every concept keeps its 2 core connect cards; a third `connect-card wow` card was appended in each `connect-grid` (7/7 lessons), each 43–50 words with 1–2 https links and an offline note. Same pilot-mirrored CSS + static-file adaptation as jesc110 (no JS changed; offline core untouched).
- Cards (hook — links): field-lines “A hospital that photographs with fields” (MRI 1.5–3 T superconducting, function only; NCERT More-to-Know) — Magnetic_resonance_imaging; straight-wire “Floating on fields” (Maglev, general, no construction detail) — Maglev; loop “The bell that counts turns” (field ∝ turns) — Doorbell; solenoid “The crane that drops on command” (field dies with current) — Electromagnet; force “Twenty thousand kicks a second” (headphone driver, Fleming) — Loudspeaker; domestic “The pin that arrives first” (earth pin longer + thicker; explicitly no open/rewire) — Earthing_system; safety “The tower that protects itself” (turbine-tower switchgear: breakers + over-current/earth-fault relays; general, source-fidelity kept — no induction taught, this edition deleted it) — Wind_turbine + MNRE.
- Checks: word counts 43–50 asserted by script; all URLs https + HEAD 200; `node --check` PASS on 3 inline scripts; `tests/verify-course.cjs` PASS; 92,887 B < 2 MB; no new `src=`/`fetch`/iframe.
- Gaps: link rot needs periodic re-check; new cards not yet browser-rendered; no YouTube links used.

## Gaps
- Same pending browser/device matrix as sibling chapters; provisions (labels, aria-live, keyboard-native controls, no autoplay) in code.
- Motor/generator/loudspeaker internals and any induction content deliberately absent (source fidelity, not omission).
- Short-circuit current magnitude is schematic; fuse is threshold, not time-modelled (both captioned).
