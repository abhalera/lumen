# COVERAGE — jesc109 · Light (pilot Wow update 2026-09-08)

Source: `books/originals/Class10-Science_jesc109.pdf` (27 PDF pages, Reprint 2026–27, printed pp. 134–160) per `output/Class10/jesc109/PLAN.md`. Editable source: `output/Class10/jesc109/pilot/content.js`; built deliverables `output/Class10/jesc109/index.html` + `light-pilot.html` via `python3 build.py`. Renderer already supported Wow (`wow` badge + `ext-links` + `offline-note` in `pilot/app.js`); no renderer/CSS change needed.

## Wow trivia cards (2026-09-08)
- concave-mirror already had JWST Wow — left untouched, no duplicate.
- Added Wow to the 7 remaining lessons (each now 3 Connect cards: 2 core + 1 Wow, 40–70 words, max 2 https links: Wikipedia + official):
  1. reflection — Wow — a submarine sees without surfacing (48w) — https://en.wikipedia.org/wiki/Periscope + https://www.drdo.gov.in/
  2. convex-mirror — Wow — side mirrors shrink cars to save lives (53w) — https://en.wikipedia.org/wiki/Bhadla_Solar_Park + https://www.mnre.gov.in/ (Bhadla mentioned truthfully as PV panel fields; convex claim only for side mirrors)
  3. mirror-formula — Wow — Hubble’s blurry mirror needed new glasses (50w) — https://en.wikipedia.org/wiki/Hubble_Space_Telescope + https://science.nasa.gov/mission/hubble/ (1990 launch blur, 1993 corrective optics, simplified)
  4. refraction — Wow — doctors see inside with light pipes (50w) — https://en.wikipedia.org/wiki/Optical_fiber + https://dst.gov.in/ (endoscopy general, no medical advice)
  5. convex-lens — Wow — your eye is a living convex lens (49w) — https://en.wikipedia.org/wiki/Human_eye + https://www.nhm.gov.in/
  6. concave-lens — Wow — your door peephole shrinks visitors on purpose (55w) — https://en.wikipedia.org/wiki/Door_viewer + https://dst.gov.in/
  7. power — Wow — minus for far, plus for near (54w) — https://en.wikipedia.org/wiki/Dioptre + https://www.nhm.gov.in/ (explains -2D/+2D labels; no prescription advice)
  8. concave-mirror (pre-existing) — Wow — a 6.5 m concave mirror in space (JWST, 3 links incl. labelled YouTube) — untouched.

## Checks 2026-09-08
- [x] `python3 build.py` regenerated index.html + light-pilot.html: 69,229 bytes (<2MB)
- [x] `node tests/verify.cjs` PASS: 14760 optical assertions; all 8 lessons and 24 correct-answer paths; blank-answer validation; 17 unique exercise mappings
- [x] `node --check` PASS for pilot/model.js, content.js, app.js
- [x] 8/8 lessons have Wow (7 new + 1 pre-existing); every new Wow 40–70w, ≤2 https links; all new unique URLs curl 200 (Mozilla UA)
- [x] books/reference untouched.

## Gaps (honest)
- Bhadla Wow mentions Bhadla only as PV context to avoid falsely claiming convex-mirror solar furnaces; concave solar-furnace physics remains with concave-mirror lesson.
- Fibre-optic Wow simplifies guidance as “total internal reflection at the walls”; full TIR derivation is beyond Class 10 jesc109 scope (pilot contract notes TIR guard only).
- Hubble Wow simplifies spherical-aberration/COSTAR history to “corrective optics like glasses”; detailed prescription/design is out of scope.
- Browser, screen-reader, device-layout and learning-effectiveness validation remain outstanding per PLAN.md.
