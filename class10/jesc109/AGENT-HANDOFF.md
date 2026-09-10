# Next-agent brief

Paste the following brief into the next agent and provide this entire folder.

---

Develop the interactive NCERT textbook project described in my existing VISION.md. Prioritise **student self-study on phone, tablet, laptop and desktop**. Use the provided Light pilot and authoring template as the starting point. This phase should finish **Class 10 Science, Light – Reflection and Refraction, jesc109**, then stabilise the reusable chapter pattern. Do not regenerate the same prototype or replace it with a marketing page.

First read `START-HERE.md`, `PLAN.md`, `template/CONCEPT-TEMPLATE.md`, and the existing chapter PDF. Inspect `pilot/content.js`, `model.js`, `app.js`, and `styles.css` only as needed. Preserve the five blocks in order: Learn, Play, Connect, Practice, Revise. Keep source content separate from simulation calculations. Retain single-file offline delivery with no mandatory backend or framework.

**Source:** my original file is `/home/abhalera/Downloads/interactive-textbooks/books/originals/Class10-Science_jesc109.pdf`. The reviewed edition is Reprint 2026–27, 27 PDF pages, printed pp.134–160, SHA-256 `a647d66cd9dd9e767c1fea57baac3a7aeaf9cb7461f87dc3f619e6fee8947497`. If the file differs, remap the edition before claiming references are verified.

**Already built:** eight concept groups; 24 original easy/medium/hard questions; hints and explanations; worked examples; reflection, mirror/lens, slab and power simulations; revision; source links; all 17 end-exercise numbers located. The core is about 64 KB. `node tests/verify.cjs` passes 14,760 numerical assertions and scripted lesson/quiz checks. This is not a browser or classroom validation result.

**Your next work, in order:**

1. Run the existing tests. Open the pilot in a real browser and verify it at 360/390, 768, 1280 and 1440 px. Check 200% text, keyboard, touch, reduced motion, screen-reader names and offline loading. Inspect the rendered diagrams visually, including the virtual-image and at-focus cases. Fix label collisions, mobile readability and actual runtime bugs.
2. Build a ledger of every NCERT subsection, activity, in-text question and end exercise. Compare against the pilot and mark each row authored, verified or pending. The 17-question map in the pilot is navigation, not complete exercise coverage.
3. Add missing core explanations and tasks. Explicitly teach transparent lens materials, mirror/lens terminology and the image-position cases. Add assessed ray-construction tasks, a comparison of mirror types, and full worked solutions for all required questions with checked signs and units. Use original explanations and approved sourcing; resolve content rights for the intended publication model.
4. Evaluate splitting the existing refraction group into bending, index and slab concepts; separate lens formula/construction if needed. Each resulting concept must have quick reading, a meaningful manipulation and easy/medium/hard checks. Grow production question banks to 5–8 questions where useful while keeping the initial quiz short. Difficulty is a property of a question, not a permanent label for the learner.
5. Generalise only what repeated content requires: chapter metadata, number of concepts/questions, revision data, exercise mapping and a simulation registry. The present shell hardcodes Light-specific labels and counts. Preserve the established reading and exploration experience while removing these hardcoded assumptions.
6. Improve simulations only to teach a specific objective. Add a half-covered-lens/brightness demonstration if it earns its place. Do not add games, dashboards, accounts, chatbots, audio or advanced optics without a learning need and scope decision. Keep models bounded and documented.
7. Obtain physics-teacher review and student usability feedback when available. Do not claim to have conducted a student study or achieved learning improvement without evidence. Record required external reviews as pending if you cannot perform them.
8. Rebuild the portable HTML and deliver the editable source, complete coverage ledger and honest verification report. Label the chapter complete only when every required item and quality gate is satisfied.

**Non-negotiable correctness:** left is negative with incident light travelling left to right; mirror `1/v + 1/u = 1/f`, `m = −v/u`; lens `1/v − 1/u = 1/f`, `m = v/u`; power uses metres. Handle an object exactly at F as no finite image. Real rays are solid and virtual extensions dashed. Never clamp offscreen image values or invent NCERT question numbers. Label model approximations, exaggerated vertical diagram scale and any extension beyond this chapter.

**Efficiency:** work in one bounded chapter before scaling. Reuse tested calculations and styles. Read only the relevant extracted pages for each task. Do not repeatedly research settled conventions or rewrite functioning scaffolding. Update the coverage ledger as the durable state for future agents. Report concrete changes, checks and remaining gaps.

---
