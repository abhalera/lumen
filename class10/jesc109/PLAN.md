# Interactive textbooks: template and Class 10 Light pilot

Prepared 6 September 2026. Audience: independent English-medium NCERT learners using phones, tablets, laptops and desktops. Based on the supplied VISION.md and the downloaded jesc109 PDF.

## The product decision

Build a **read → predict → manipulate → explain → retrieve** experience within the vision's five blocks: Learn, Play, Connect, Practice, Revise. The simulation belongs immediately beside the idea it explains. Each lesson should answer one useful question, not simply contain one animation.

For Light, the best demonstration is the transition across a concave mirror's focus. A learner predicts whether the image will stay inverted, moves the object through F, and sees why the ray extensions now meet behind the mirror. A difficult concept becomes something they can investigate and explain.

The pilot contains eight lesson-sized concept groups, 24 original questions (one easy, medium and hard per group), four simulation families, worked examples, two connections per group, recall prompts and a chapter exit ticket. It is a working learning and design example. It is **not a complete replacement for the chapter**: all 17 end exercises are located and linked, but their complete questions, solutions and required diagrams have not all been implemented. Some groups contain several microconcepts that should be split after student testing.

Open `light-pilot.html` directly in a browser. There are no runtime dependencies or required network requests. The editable source is in `pilot/`.

## What the research changes in the design

| Evidence or precedent | Concrete implication | Limit of the evidence |
|---|---|---|
| [PhET facilitation guide](https://phet.colorado.edu/files/guides/TeacherGuide_StrategiesForFacilitation_en.pdf) encourages exploration, learner explanations and checks for understanding. | Give a small prediction prompt, a few meaningful controls and a question asking for evidence from the simulation. Allow free exploration too. | This is guidance for facilitated learning. It does not establish that an unguided slider automatically teaches, or prove effectiveness for this self-study product. |
| [Carnegie Mellon's retrieval-practice guidance](https://www.cmu.edu/teaching/resources/instructionalstrategies/activelearningstrategies/retrievalpractice/index.html) discusses low-stakes retrieval, feedback and question formats. | Put short retrieval questions after each concept; explain errors; include numerical or explanation tasks as well as MCQs. Revisit ideas later. | Immediate correctness and rereading a revealed solution are not reliable measures of durable mastery. |
| [PhET Geometric Optics](https://phet.colorado.edu/en/simulations/geometric-optics) is an existing optics exploration tool. | Benchmark ray interactions and explanatory affordances before writing a more complicated optical engine. Use original, bounded models for the smallest inline tasks. | This pilot does not embed, copy or claim to reproduce PhET's validated learning outcomes. |
| [Official NCERT jesc109](https://ncert.nic.in/textbook/pdf/jesc109.pdf), also read from the user's downloaded file, supplies the chapter structure and sign conventions. | Pin the edition and source hash. Reference both PDF page and printed page. Preserve the scope and progression. | A chapter code alone does not guarantee that its downloadable contents will remain unchanged. |

Reading durations, eight concept groups, three difficulty levels, colors and success thresholds below are **design hypotheses**, not findings asserted by these sources. Test them with the intended students.

## The reusable lesson pattern

| Block | Student experience | Authoring target for a first draft |
|---|---|---|
| Learn | Understand the central idea quickly; expand only if needed. | 80–140 original words, one clear question, 2–4 highlighted terms, one formula or rule. Add a deeper explanation and a worked example in expandable sections. |
| Play | Predict, move a control, observe, explain. | One simulation, 1–2 primary controls, labelled units, live textual result, a useful initial state and meaningful presets. |
| Connect | Recognise why the concept matters. | Two relevant situations per concept, preferably one quantitative. Use Indian classroom and everyday settings where they help the explanation. |
| Practice | Retrieve rather than reread. | Easy: recognise/explain a rule. Medium: apply it once. Hard: diagnose, transfer or combine two steps. Give hints and complete reasoning. |
| Revise | Reconstruct the idea from memory. | One drawing or verbal recall prompt; chapter formula map; three-question exit ticket. |

“Quick reading” should mean clear hierarchy and short, accurate explanations. Keep the complete reasoning available. Avoid speed-reading gimmicks or deleting the assumptions that make a formula valid.

**Aesthetics rule (locked 2026-09-07, from trig review): the key-equation box lists one formula per line.** Author `formula` as `·`-separated items; the renderer splits on `·` into stacked lines (line-height 1.75, 6px between). Never let two equations share one wrapped line — mid-line wraps (`cos A =` dangling at line end) look broken to students. Same for revision formula grids: one result per cell.

Each full production concept should grow from three demonstration questions to a small bank: two recognition questions, two applications and one or two reasoning questions. Serve a short selection first; show extra questions when the student needs practice. Map the bank separately to actual NCERT questions. A difficult question must involve richer reasoning, not just bigger numbers or unseen syllabus.

## Pilot coverage and content audit

Source file: `Class10-Science_jesc109.pdf`, reprint 2026–27; 27 PDF pages; printed pp. 134–160.

SHA-256: `a647d66cd9dd9e767c1fea57baac3a7aeaf9cb7461f87dc3f619e6fee8947497`

Page convention: PDF pages are 1-based file pages, not printed page labels.

| Pilot group | NCERT sections | PDF pages / printed pages | Interaction | Misconception targeted |
|---|---|---|---|---|
| 1. Reflection | 9.1 | 1–2 / 134–135 | Move incident angle | Measuring angles from the surface; plane-mirror separation |
| 2. Concave mirrors | 9.2–9.2.2 | 2–7 / 135–140 | Move object across F and C | Assuming a concave mirror always makes a real image |
| 3. Convex mirrors | 9.2.2 | 7–9 / 140–142 | Move object; change focal length | Mistaking backward extensions for actual rays |
| 4. Mirror signs and formula | 9.2.3–9.2.4 | 9–12 / 142–145 | Link u and f to v and m | Using unsigned distances; mixing magnification signs |
| 5. Refraction, index, slab | 9.3–9.3.2 | 12–17 / 145–150 | Change incident angle and slab index | Optical vs mass density; parallel output assumed to mean no refraction |
| 6. Convex lenses | 9.3.3–9.3.7 | 17–24 / 150–157 | Cross F and 2F | Thinking all convex-lens images are real; half lens means half image |
| 7. Concave lenses | 9.3.3–9.3.7 | 17–23 / 150–156 | Move real object | Confusing concave lenses with concave mirrors |
| 8. Lens power | 9.3.8 | 24–25 / 157–158 | Change f and lens type | Using centimetres in P = 1/f; confusing strength with sign |

Before calling this a complete chapter, split group 5 into bending, refractive index and slab lessons if learners struggle with its density. Consider separate lens formula and image-construction lessons too. Every resulting concept needs its own easy/medium/hard check.

### Verified end-exercise inventory

These topic labels are original summaries. “Mapped” means the number and location were checked and a relevant pilot group identified; it does **not** mean the original exercise is fully delivered by the pilot quiz.

| Q | Topic | PDF page | Relevant group(s) | Pilot status |
|---|---|---|---|---|
| 1 | Materials suitable for a lens | 26 | 6 | Mapped; explicit transparent-material discussion still needed |
| 2 | Concave mirror, upright enlarged image | 26 | 2 | Mapped; aligned original check |
| 3 | Convex lens, same-size real image | 26 | 6 | Mapped; aligned original check |
| 4 | Identify lens and mirror from negative focal length | 26–27 | 4, 7 | Mapped; full combined question pending |
| 5 | Mirrors that always give upright images | 27 | 1, 3 | Mapped; full combined question pending |
| 6 | Lens for magnifying small print | 27 | 6, 8 | Mapped; comparison question pending |
| 7 | Concave-mirror object range and ray diagram | 27 | 2 | Mapped; assessed drawing pending |
| 8 | Mirrors for headlights, side mirrors and furnace | 27 | 2, 3 | Mapped; all subparts pending |
| 9 | Partially covered convex lens | 27 | 6 | Mapped; qualitative check included, aperture simulation pending |
| 10 | Convex-lens image position, height and diagram | 27 | 6 | Mapped; full exercise pending |
| 11 | Concave-lens object distance and diagram | 27 | 7 | Mapped; inverse problem pending |
| 12 | Convex-mirror image distance | 27 | 3, 4 | Mapped; full exercise pending |
| 13 | Interpret plane-mirror magnification | 27 | 1, 4 | Mapped; exact check pending |
| 14 | Convex mirror, radius and image size | 27 | 3, 4 | Mapped; full exercise pending |
| 15 | Concave mirror, screen and image size | 27 | 2, 4 | Mapped; full exercise pending |
| 16 | Negative lens power to focal length | 27 | 8 | Mapped; aligned original check |
| 17 | Positive lens power and lens type | 27 | 8 | Mapped; aligned worked example |

In-text question groups were located at PDF p.9 (4 questions), p.12 (2), p.17 (5) and p.25 (3). They are not yet a full interactive exercise bank. Verify these groups and the chapter's activities individually in the production coverage ledger; do not infer completion from shared topics.

## Architecture that conserves agent effort

Author editable files, then assemble a single HTML file for distribution. This combines maintainability with the vision's double-click/offline requirement.

```text
chapter/
  plan.md                 # edition, objectives, section and exercise ledger
  content.js              # original teaching text, questions and source records
  model.js                # pure domain calculations, no DOM
  app.js                  # rendering, controls, quiz feedback
  styles.css              # shared chapter layout and tokens
  index.html              # source shell
  tests/                  # numerical fixtures and meaningful interaction checks
  chapter.html            # assembled single-file deliverable
```

Use classic scripts for v1. Avoid mandatory fetch calls and module imports when opening through `file://`. No external fonts, login, analytics, iframe or network connection is necessary in the pilot. Progress is kept only for the current page session; a reload resets it. If durable offline progress is added, use versioned local storage with a memory fallback, explain it to learners, and test restrictive browsers and shared devices.

The pilot uses four small original simulation families: reflection, mirror/lens ray bench, parallel slab and lens power. The ray bench shares the drawing machinery while the mirror and lens equations remain distinct. Do not force arbitrary chemistry, biology and mathematics into this renderer. Keep the lesson contract and implement the appropriate simulation family: process stepper, graph manipulator, area model, circuit or particle model.

Prefer native controls and SVG for this bounded optics task. Canvas is useful when object counts justify it. A literal “under 200 lines” requirement should yield to correctness and readability. Smaller **scope** saves more tokens than compressed, unreviewable code.

Use external simulations only when their learning value justifies the embedding, licensing, accessibility and offline costs. Check the particular simulation's current licence; do not assume that every third-party asset is covered by the same terms as the surrounding website or source repository.

## Simulation correctness contract

- Coordinate direction: incident light left to right; u < 0 for these real objects. Origins: mirror pole P, lens optical centre O. Heights above the axis are positive.
- Mirror: `1/v = 1/f − 1/u`, `m = −v/u`; concave f < 0, convex f > 0.
- Lens: `1/v = 1/f + 1/u`, `m = v/u`; convex f > 0, concave f < 0 in air.
- Set v and m to explicit non-finite states at a zero denominator. Never draw a huge fabricated finite image at F.
- Backward extensions must be dashed. Actual reflected mirror rays return to the left; transmitted lens rays go right. Arrows show direction.
- The ray model is paraxial and schematic. It omits aberrations, diffraction, lens thickness, absorption, and weak reflections from refracting surfaces. It is not a precision optical design tool.
- Refraction: `n₁ sin i = n₂ sin r`; at normal incidence direction can stay unchanged despite a speed change. Parallel emergence requires parallel interfaces and the same external medium.
- Restrict the learner's slab control to air → n ≥ 1 → air. The helper guards total internal reflection, but the pilot does not introduce that as a Class 10 learning objective.
- Lens power is `100/f_cm`, not `1/f_cm`. Zero focal length is invalid.
- Keep a fixed horizontal scale so changes are comparable. Report images outside the field of view; never quietly clamp their numerical values to visible positions. Diagram heights are schematic and exaggerated for visibility.
- Motion traces a construction. It does not represent the actual propagation speed of light.

## Visual and interaction direction

The pilot pairs an open white reading surface with a dark optics workspace, blue rays, a gold second ray and a distinct image arrow. Serif lesson titles give it the feel of a book; body text and controls use familiar system fonts. The simulation should feel like part of the explanation.

On wide screens, the chapter navigation stays at the left and Learn and Play sit alongside one another. On phones, the concept navigation becomes a horizontal list and the explanation and simulation stack. Touch controls, native sliders, keyboard focus, textual simulation readouts and reduced-motion support are included in the code.

Required pre-release device tests: 360 and 390 px phones, 768 px tablet, 1280 and 1440 px desktop; 200% text enlargement; landscape rotation; keyboard-only navigation; an actual screen reader; all controls with touch; no horizontal page overflow. Small SVG labels and reading density require particular attention. Do not mistake responsive CSS for verified usability.

## Production workflow and acceptance gates

1. **Pin and map.** Extract one chapter; record edition/hash/page conventions. Build every section, activity, in-text question and exercise into a ledger. Set status to planned, authored, verified or deferred explicitly.
2. **Author a vertical slice.** Write one concept, simulation, misconception-led quiz and revision prompt. Review the science before cloning the pattern.
3. **Complete coverage.** Fill the remaining ledger. Give every concept all five blocks. Add 5–8 formative questions per production concept where appropriate, while keeping the default quiz short.
4. **Test models and content.** Test independent numerical fixtures, units, sign regimes and degeneracies. Check quiz solutions against the same physical scenario without generating both expected and actual results from the same function.
5. **Review with a teacher and students.** Review fidelity, language and diagram reasoning. Ask students to explain an unseen case aloud; watch where they misunderstand the controls.
6. **Test delivery.** Load the assembled file with network disabled; verify phone/tablet/desktop layouts and assistive access; check source links; check core size under 2 MB. Recheck after substantive changes.
7. **Release a complete chapter.** Only label it complete when the entire coverage ledger and all required checks pass. Publish to static hosting or package for offline distribution; investigate DIKSHA/Sunbird packaging separately rather than claiming compatibility from a static file alone.

Suggested sequence: freeze the pattern using Light, then test it against Electricity and a mathematics chapter. These three expose different interaction requirements before scaling to all 154 inputs. Keep chapter authoring separate from shared renderer changes to prevent a later chapter from accidentally breaking an earlier one.

## Evaluate learning, not activity time

Use a small formative study with roughly 6–10 learners of differing prior attainment and 1–2 teachers. This is a usability and misconception-finding exercise, not a statistically conclusive learning trial.

Proposed measures:

- A short pre-test and equivalent unseen post-test, followed by a delayed check after 2–7 days. Use parallel questions, not a repeated answer sequence.
- Ability to explain image changes, signs and the slab result without the simulation visible.
- Unassisted completion of one lesson on the learner's device; number and reason of help requests.
- Confidence before checking against actual correctness.
- A drawing rubric: correct optical element, principal axis, correct ray rules, real versus virtual construction, and image interpretation.

Treat “2× more time in Play than Learn” as a hypothesis to inspect, not the success criterion. Long simulation time can also mean confusion. Do not claim a learning improvement from this build: no student study has been performed.

## Decisions to brainstorm after trying the pilot

My starting choices are:

1. **Quick explanation by default, deeper detail on demand.** If students miss prerequisites, add a short readiness check or glossary rather than lengthening every lesson.
2. **Free exploration with lightweight prompts.** Keep predict/observe/explain prompts visible; avoid a mandatory click-by-click tour. Test whether independent learners need more scaffolding than students with a teacher.
3. **A short quiz, with more practice available.** Easy/medium/hard describes the question, not the learner. Avoid locking students into a perceived ability tier.
4. **Manual explanation checks first.** Use transparent example answers and drawing rubrics. Automated grading of free text is a later decision, not a reason to add a backend now.
5. **Original explanations, traceable references.** Keep textbook fidelity through the coverage ledger rather than wholesale text copying.

The most valuable next discussion: does the concave-mirror lesson help a student explain the image flip, and is the refraction group short enough to understand independently? Those observations should decide the final concept size before the template is frozen.

## Rights and attribution

The supplied vision assumes educational use plus attribution is enough to reuse NCERT content. Do not use that as a blanket publication licence. NCERT's [April 2024 copyright notice](https://www.ncert.nic.in/pdf/announcement/notices/Press_Release_Copyright_Infringement-NCERT.pdf) specifically addresses commercial publication using its textbook content without permission. Resolve the rights for your actual distribution model before republishing protected material.

This package uses original explanations, original functional diagrams and original code, with links and factual mappings to the textbook. It does not bundle the NCERT PDF or third-party simulation assets. The included MIT licence applies only to this package's original material and does not license NCERT or third-party works. The prototype name “lumen” is a working design label, not a cleared commercial brand.

## What was actually checked

`node tests/verify.cjs` checks independent optics fixtures, 14,760 numerical assertions across available ray-bench settings, slab angle reversibility, focus degeneracies, invalid inputs, content shape, 17 unique end-exercise entries, all 8 lesson render paths and all 24 correct-answer paths in a scripted DOM stub. `python3 build.py` assembles the portable file. JavaScript syntax and the core size also passed.

These are numerical and scripted runtime checks, not browser, accessibility or learning-effectiveness certification. Browser screenshots, real device tests, teacher review, student trials and full exercise/activities coverage remain outstanding. No hosted site was published. The deliverable is the local, portable example requested by the vision.
