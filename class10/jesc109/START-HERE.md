# Start here

Open **index.html** in a browser. **light-pilot.html** is an equivalent portable copy. It contains the whole interactive pilot and works offline. For the editable source, use **pilot/index.html** with its neighbouring files.

Try this first:

1. Choose **Concave mirrors**.
2. Keep |f| = 15 cm. Compare **At 2F**, **At F** and **Inside F**.
3. Explain why the image changes from real to virtual.
4. Answer the Easy, Medium and Hard questions. Wrong answers offer a hint and an expandable solution.
5. Explore the refraction slab and switch the power lab between convex and concave lenses.

The package includes:

- `PLAN.md`: researched product plan, design decisions, verified NCERT mapping and production gates.
- `AGENT-HANDOFF.md`: a ready-to-paste brief for the next agent.
- `template/CONCEPT-TEMPLATE.md`: reusable authoring specification and completion rubric.
- `template/concept.template.json`: machine-readable example structure with explicit placeholders.
- `pilot/`: original editable content, styles, renderer and optics model.
- `tests/verify.cjs`: numerical and scripted interaction verification.
- `build.py`: assembles the source into the portable HTML.
- `LICENSE`: MIT terms for the original material only.

The pilot has eight concept groups and 24 original questions. The NCERT exercise map locates all 17 end questions; the full original exercise set and activities are not yet implemented. Progress lasts for the current page session. Reloading starts again. Print styles support the currently open concept and chapter revision, not a full printed textbook export.

Run the checks and rebuild from this folder:

```sh
node tests/verify.cjs
python3 build.py
```

For editing, change the source files in `pilot/`; the assembled HTML will be replaced on rebuild. New subject areas can reuse the lesson structure and styling but need their own simulation families. The current renderer and chapter shell contain Light-specific labels, revision content and counts; do not treat them as a fully general textbook platform.

For the full Class 10 Science mission, read the project-root `CLASS10-SCIENCE-AGENT-PROMPT.md`. It supersedes the narrower Light-only scope in the original handoff.
