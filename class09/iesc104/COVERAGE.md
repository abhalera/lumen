# COVERAGE — iesc104 Describing Motion Around Us

**Source:** `books/originals/Class09-Science_iesc104.pdf` (24 pdf pages, printed pp. 48–71, Reprint 2026–27 NCF edition *Exploration*).  
**SHA-256:** `9a9299f272e2e760b7b58e4ecbf697fd65e51ab0fe181d55c0aff8ce4d19e8a4`  
**NCERT Source Link:** https://ncert.nic.in/textbook/pdf/iesc104.pdf.  
**Compilation Tool:** `scripts/build_chapter4.py` (Single source of truth compiler).

---

## 1. Concept IDs (7 Core Sections)

| ID | Concept Title | NCERT Section | PDF pp | Printed pp | Status |
|---|---|---|:---:|:---:|:---:|
| `position-distance-displacement` | Reference Point, Distance & Displacement | 4.1.1, 4.1.2 | 2–5 | 49–52 | Complete |
| `speed-and-velocity` | Speed, Velocity & Rate of Change | 4.1.3 | 5–7 | 52–54 | Complete |
| `acceleration-and-braking` | Acceleration & Retardation | 4.1.4 | 7–9 | 54–56 | Complete |
| `position-time-graphs` | Position–Time Graphs & Slope | 4.2.1, 4.2.2 | 9–13 | 56–60 | Complete |
| `velocity-time-graphs` | Velocity–Time Graphs & Area Under Curve | 4.2.3 | 14–16 | 61–63 | Complete |
| `kinematic-equations` | Equations of Motion & Stopping Distance | 4.3 | 16–19 | 63–66 | Complete |
| `uniform-circular-motion` | Uniform Circular Motion & Tangential Velocity | 4.4, 4.4.1 | 19–21 | 66–68 | Complete |

---

## 2. In-Text Activities (4.1–4.5) Implementation

| Activity | Topic & Procedure | Mapped Concept | Interactive Lab Implementation |
|---|---|---|---|
| **Activity 4.1** | Ball thrown vertically up to 140 cm and caught at origin. Distance vs. displacement analysis. | `position-distance-displacement` | Full physical toss timeline: throw ($y=0$), peak ($y=140\text{ cm}$), and catch ($y=0$). Upward and downward trails shown; tracks height, distance ($280\text{ cm}$), and net displacement ($0\text{ cm}$). |
| **Activity 4.2** | Calculating acceleration in discrete intervals for speeding/slowing car. | `acceleration-and-braking` | Accelerometer dial, live $\vec{v}$ and $\vec{a}$ vector arrows, and passenger inertial tilt animation. |
| **Activity 4.3** | Plotting position–time graph from tabular data ($0 \to 100\text{ m}$ in $5\text{ s}$). | `position-time-graphs` | Dedicated progressive data plotting mode revealing discrete $(t_i, s_i)$ points with animated pulse and trendline. |
| **Activity 4.4** | Constructing triangle $ABC$ on $s$-$t$ graph to calculate velocity from slope $\frac{s_2 - s_1}{t_2 - t_1}$. | `position-time-graphs` | Interactive right triangle $ABC$ with selectable/movable points $A$ and $B$, showing live $\Delta s$, $\Delta t$, and slope velocity. |
| **Activity 4.5** | Marble rotating inside circular ring; lifting ring releases marble along tangent. | `uniform-circular-motion` | Circular arena with live centripetal acceleration vector $\vec{a}_c$ and tangential velocity $\vec{v}$. "Lift Ring" action releases marble in a straight line along the instantaneous tangent. |

---

## 3. In-Text Questions & Examples Mapping

| Item | Topic / Question | Mapped Concept | Delivery in Lesson |
|---|---|---|---|
| **Think It Over** (p. 1) | Following distance behind truck to avoid collision; dependence on speed. | `kinematic-equations` | Motivating scenario; Emergency Stopping Distance Simulator. |
| **Pause & Ponder 1** (p. 4) | Athlete running back & forth: when is displacement zero? Total distance? | `position-distance-displacement` | Addressed in 1D Track Lab & Practice (Medium). |
| **Pause & Ponder 2** (p. 4) | Fuel consumed in vehicle: depends on distance or displacement? | `position-distance-displacement` | Included in Practice (Easy). |
| **Pause & Ponder 3** (p. 4) | Ball rolling down inclined track: 1D motion? Distance vs displacement? | `position-distance-displacement` | Addressed in Deep Dive & Practice. |
| **Example 4.1** (p. 5) | Two postmen starting 210 yojanas apart walking 9 and 5 yojanas/day (*Ganitakaumudi*). | `speed-and-velocity` | Included in Connect card as historic Indian mathematical problem. |
| **Example 4.2** (p. 6) | Sarang swimming 50 m across and back in 50 s: average speed vs velocity. | `speed-and-velocity` | Synchronized preset in Speed/Velocity Lab ($4.0\text{ m/s}$ speed vs $0\text{ m/s}$ velocity). |
| **Pause & Ponder 4** (p. 6) | 200 km North in 3 h, then 200 km South in 2 h: average speed & average velocity. | `speed-and-velocity` | Included in Practice (Medium). |
| **Pause & Ponder 5** (p. 6) | Conditions when average velocity equals average speed; when average velocity is zero. | `speed-and-velocity` | Addressed in Practice (Hard). |
| **Example 4.3** (p. 8) | Bus accelerating on straight highway: calculating average acceleration. | `acceleration-and-braking` | Addressed in Worked Example. |
| **Example 4.4** (p. 9) | Dropped object falling under acceleration due to gravity ($9.8\text{ m s}^{-2}$). | `acceleration-and-braking` | Included in Deep Dive & Worked Example. |
| **Example 4.5** (p. 11) | Vehicle starting from rest and speeding up: non-linear curved $s$-$t$ graph. | `position-time-graphs` | Covered in $s$-$t$ graph modes. |
| **Example 4.6** (p. 13) | Interpreting horizontal line on $s$-$t$ graph: stationary object. | `position-time-graphs` | Dedicated "Object at Rest" preset in Lab. |
| **Example 4.7** (p. 13) | Comparing two objects A and B on $s$-$t$ graph (slopes & speeds). | `position-time-graphs` | Addressed in Practice. |
| **Example 4.8** (p. 18) | Car braking uniformly on highway: stopping distance and stopping time. | `kinematic-equations` | Worked Example with full algebraic steps. |

---

## 4. End Exercises ("Revise, Reflect, Refine" Q1–16)

All 16 end-of-chapter exercise questions located in PDF pp. 21–24 (printed pp. 68–71):

| Q# | Summary of Problem | Mapped Concept | Delivery Status |
|:---:|---|---|---|
| **1** | Father goes 250 m to shop, returns for bag, goes back, returns home. Total distance & displacement. | `position-distance-displacement` | Mapped in Revision Compendium; fully solved ($d = 1000\text{ m}, s = 0\text{ m}$). |
| **2** | Student runs ground to 4th floor (3m/floor), then down to 2nd floor. Vertical distance & displacement. | `position-distance-displacement` | Mapped in Revision Compendium; fully solved ($d = 18\text{ m}, s = +6\text{ m}$). |
| **3** | Scooter with constant speedometer reading: can it be accelerating? | `uniform-circular-motion` | Mapped in Revision Compendium; solved (yes, by turning direction). |
| **4** | Car from rest reaches $24\text{ m s}^{-1}$ in $6\text{ s}$. Find average acceleration and distance travelled. | `acceleration-and-braking` | Mapped in Revision Compendium; fully solved ($a = 4\text{ m s}^{-2}, s = 72\text{ m}$). |
| **5** | Motorbike with $u = 28\text{ m s}^{-1}$ stops after $98\text{ m}$. Find acceleration and stopping time. | `acceleration-and-braking` | Mapped in Revision Compendium; fully solved ($a = -4\text{ m s}^{-2}, t = 7\text{ s}$). |
| **6** | Fig. 4.27 position–time graph for objects A and B on parallel tracks. Do they ever have equal velocity? | `position-time-graphs` | Mapped in Revision Compendium; solved (where slopes are parallel). |
| **7** | Fig. 4.28 position–time from 0 to 10s: compare average velocities and average speeds of A and B. | `position-time-graphs` | Mapped in Revision Compendium; multiple choice options analysed. |
| **8** | Truck slows from $54\text{ km h}^{-1}$ ($15\text{ m s}^{-1}$) to $36\text{ km h}^{-1}$ ($10\text{ m s}^{-1}$) in $36\text{ s}$. Distance travelled? | `kinematic-equations` | Mapped in Revision Compendium; fully solved ($s = 450\text{ m}$). |
| **9** | Car starts from rest, accelerates to $20\text{ m s}^{-1}$ in 5s, cruises for 10s, brakes to stop in 6s. Total distance? | `velocity-time-graphs` | Mapped in Revision Compendium; fully solved ($50 + 200 + 60 = 310\text{ m}$). |
| **10** | Bus at $36\text{ km h}^{-1}$ ($10\text{ m s}^{-1}$), obstacle 30 m ahead, reaction time 0.5 s, braking $a = -2\text{ m s}^{-2}$. Will it stop? | `kinematic-equations` | Mapped in Revision Compendium; fully solved ($s = 25\text{ m} < 30\text{ m}$, stops safely). |
| **11** | "The Earth moves around the Sun." Discuss whether an object on Earth can be considered at rest. | `position-distance-displacement` | Mapped in Revision Compendium; frame of reference analysis. |
| **12** | Fig. 4.30 $v$-$t$ graph for cyclist: acceleration, cruise, deceleration. Total displacement. | `velocity-time-graphs` | Mapped in Revision Compendium & dedicated simulation preset ($150\text{ m}$). |
| **13** | Fig. 4.31 smartwatch marathon runner $v$-$t$ graph: estimate total distance from area under curve. | `velocity-time-graphs` | Mapped in Revision Compendium; numerical area solution. |
| **14** | Car moves at $6\text{ m s}^{-1}$ for 2 min ($120\text{ s}$), then accelerates at $1\text{ m s}^{-2}$ for 6 s. Find displacement using $v$-$t$ graph. | `velocity-time-graphs` | Mapped in Revision Compendium; solved ($720 + 54 = 774\text{ m}$). |
| **15** | Cars A and B from rest: A reaches $5\text{ m s}^{-1}$ in 5s; B reaches $3\text{ m s}^{-1}$ in 10s. Plot and calculate displacements. | `velocity-time-graphs` | Mapped in Revision Compendium; solved ($s_A = 12.5\text{ m}, s_B = 15\text{ m}$). |
| **16** | Wall clock minute hand ($r = 7\text{ cm}$) from 6:00 PM to 7:30 PM: find distance, displacement, speed, and velocity. | `uniform-circular-motion` | Mapped in Revision Compendium & dedicated clock simulation preset. |

---

## 5. Audit Resolution & Quality Upgrades (Post Superior-Model Review)

Following the audit in `IESC104-REVIEW-FINDINGS.md`, the following repairs were engineered:
1. **Interactive Animation Timelines (P0-1):** Every lab now includes `Play`, `Pause`, `Step (+0.5s)`, `Reset`, visible current time, and a scrub slider, driven by `requestAnimationFrame`.
2. **Predict-First Checkpoints (P0-2):** Added interactive choice-based prediction cards above every simulation, revealing physical principles upon answer.
3. **True Vertical Ball Toss (P0-3):** Implemented continuous vertical flight for Activity 4.1 with upward/downward trails, $0..140\text{ cm}$ scaling, and $280\text{ cm}$ distance vs $0\text{ cm}$ displacement.
4. **Graph Interaction Fidelity (P0-4):** Added progressive plotting for Activity 4.3 and interactive slope triangle $ABC$ for Activity 4.4.
5. **Fixed Presets & Unit Consistency (P0-5):**
   - Cyclist Run (Q12) given its own distinct scenario from Q9.
   - Sarang pool preset given synchronized timeline and dynamic verdict calculation.
   - Rohan's clock converted to consistent SI units ($r = 0.07\text{ m}$, $T = 3600\text{ s}$).
   - Kinematics sliders clear stale preset tags and recompute verdicts dynamically.
6. **Semantic Equations Cards (P1-6, P1-7):** Converted formulas into structured equation records rendered in full-width rows with math fractions, superscripts/subscripts, eliminating broken middle-dot wrapping.
7. **Synchronized Kinematics & v–t Panel (P1-3):** Highway bus motion synchronized with live $v$-$t$ reaction rectangle and braking triangle.
8. **Progressive Area Shading (P1-4):** Velocity-time graph only shades up to current time $t$; future curve shown as dashed ghost trajectory.
9. **Single Source of Truth Compiler (P2-3):** Implemented `scripts/build_chapter4.py` and modular templates.
10. **State Persistence & Deep Links (P2-1, P2-2):** Added `localStorage` progress saving with reset button, and URL hash routing (`#concept-1`..`#concept-7`, `#revision`).

All 106 verification assertions pass cleanly in `tests/verify.cjs`.
