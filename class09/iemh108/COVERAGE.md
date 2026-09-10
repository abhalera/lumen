# Chapter 8 Coverage: Predicting What Comes Next — Exploring Sequences and Progressions (iemh108)
**Textbook:** Ganita Manjari, Grade 9 Part I (NCF 2024–26 Reprint)  
**Curriculum Scope:** Pages 174–200 (27 pages)  
**Standard:** Golden Reference 5-Block Pedagogical Architecture  
**Deliverable:** Standalone single-file HTML (`index.html`), 100% offline, strictly < 2.0 MB budget.

---

## 1. Executive Summary & Curriculum Audit

| Metric | Target / Standard | Achieved Status | Verification |
| :--- | :--- | :--- | :--- |
| **Concepts** | 6 Deep Conceptual Units | **6 Concepts** | Verified via `chapter.json` & DOM |
| **Interactive Labs** | 6 Canvas/SVG Manipulatives | **6 Engines** | Full timeline controls (`▶ Play`, `⏸ Pause`, `⏭ Step`, `↺ Reset`) |
| **Formulas** | Complete Derivations | **24 Formulas** | Markdown math equations |
| **Practice Quizzes** | 3 per Concept with Hints | **18 Quizzes** | Complete hints and pedagogical explanations |
| **In-Text Exercises** | Sets 8.1, 8.2, 8.3 | **20 Items** | Verbatim text, worked solutions |
| **End-of-Chapter Exercises** | Questions 1 to 15 | **15 Items** | Verbatim text, step-by-step guidance |
| **Total Exercise Items** | Complete Textbook Coverage | **35 Items** | 100% coverage, zero omissions |
| **Pedagogical Guidance** | Native Expandable `<details>` | **35 / 35** | Includes `"Step-by-Step Pedagogical Guidance"` |
| **Offline File Budget** | Strictly < 2,048 KB | **~210 KB** | Standalone zero-CDN single-file HTML |

---

## 2. Concept Breakdown & Pedagogical Mapping

### Concept 1: Sequences & The Two Rules: Explicit vs Recursive (pp. 174–180)
- **Sections Covered:** 8.1 Introduction to Sequences, 8.2 The Explicit Rule, 8.3 The Recursive Rule, Sanskrit Poetic Metrics.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Sequence definition, position index $n$, explicit rule $t_n = f(n)$, recursive rule $t_n = g(t_{n-1})$. Indian history: Virahāṅka (c. 600–700 CE) metric analysis of short (*laghu*, 1 mora) and long (*guru*, 2 morae) syllables leading to $V_n = V_{n-1} + V_{n-2}$.
  2. *Predict First:* Testing if 471 is a term of $t_n = 5n - 2$.
  3. *Play (Manipulative):* Sequence Rule Generator & Virahāṅka Prosody Visualizer. Compare explicit linear/triangular formulas vs recursive Virahāṅka mora accumulations.
  4. *Connect:* Computer programming recursion algorithms (quicksort, binary tree traversals), Indian classical rhythm (taala).
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Explicit format, recursive first-order format, and Virahāṅka recurrence.

### Concept 2: Arithmetic Progressions & Linear Functions (pp. 180–183)
- **Sections Covered:** 8.4 Arithmetic Progressions, 8.4.1 Visualising an AP.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Common difference $d = t_{k} - t_{k-1}$, growing square patterns, general form $a, a+d, a+2d, \dots$. Cartesian coordinate representation: $(n, t_n)$ on line $y = dx + (a - d)$. Slope interpretation $m = d$.
  2. *Predict First:* Finding 15th term of $3, 7, 11, 15, \dots$
  3. *Play (Manipulative):* AP Coordinate Line & Difference Sandbox. Adjust $a$ (-10 to 20), $d$ (-5 to 8), and $n$, visualizing points on the continuous line with delta slope right-triangle.
  4. *Connect:* Depreciation accounting in finance, uniform velocity equations in physics.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* AP general term, common difference, recursive step, and linear polynomial equivalence.

### Concept 3: Sum of Natural Numbers & Āryabhaṭa's Reversal Method (pp. 183–186)
- **Sections Covered:** 8.5 The Sum of Natural Numbers, Āryabhaṭa's Geometric Proof, Triangular Numbers.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Triangular numbers $T_n = n(n+1)/2$, Āryabhaṭa's reversal proof pairing $1+2+\dots+n$ with $n+(n-1)+\dots+1$ to form an $n \times (n+1)$ rectangle. General AP series formula $S_n = \frac{n}{2}(a + l) = \frac{n}{2}(2a + (n-1)d)$.
  2. *Predict First:* Sum of first 50 natural numbers.
  3. *Play (Manipulative):* Āryabhaṭa Reversal & Triangular Dot Array Lab. Toggle paired reversal to see blue and orange triangular arrays form an $n \times (n+1)$ rectangle.
  4. *Connect:* Handshake problem in combinatorics, network connections between $n$ computers.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Triangular number formula, Āryabhaṭa reversal identity, and AP sum formulas.

### Concept 4: Geometric Progressions & Exponential Scaling (pp. 186–191)
- **Sections Covered:** 8.6 Geometric Progressions, 8.6.1 The Bouncing Ball Problem.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Common ratio $r = t_k / t_{k-1}$, general form $a, ar, ar^2, \dots$, general term $t_n = a \cdot r^{n-1}$. Exponential growth vs geometric decay. Bouncing ball physics model $h_n = h_0 r^n$ and cumulative vertical distance $D_n$.
  2. *Predict First:* Comparing 10th term of AP vs GP starting from 2.
  3. *Play (Manipulative):* GP Exponential Growth & Bouncing Ball Simulator. Observe trajectory arcs of decaying bounce heights ($h_0 = 80$ m, $r = 0.60$) and cumulative vertical travel.
  4. *Connect:* Compound interest, viral pandemic reproduction number $R_0$, sound decibel scale.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* GP general term, common ratio, recursive GP step, and finite GP sum.

### Concept 5: Fractals & Self-Similarity: Sierpiński Progressions (pp. 191–194)
- **Sections Covered:** 8.7 Fractals and Geometric Progressions, Sierpiński Triangle, Sierpiński Square Carpet.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Fractal geometry, self-similarity across scales. Sierpiński triangle: shape count multiplies by 3 ($3^n$), area multiplies by 3/4 ($(3/4)^n$). Sierpiński carpet: count multiplies by 8 ($8^n$), area multiplies by 8/9 ($(8/9)^n$). Divergence of perimeter vs convergence of area to zero.
  2. *Predict First:* Number of red squares in Stage 3 of Sierpiński carpet.
  3. *Play (Manipulative):* Sierpiński Fractal Zoomer & Stage Stepper. Interactive SVG rendering of Carpet and Triangle at stages 0, 1, 2, 3 with real-time count and area fraction readouts.
  4. *Connect:* Fractal antenna miniaturization in smartphones, pulmonary lung bronchi branching.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Carpet count and area formulas, triangle count and area formulas.

### Concept 6: Advanced Recurrences, System Solvers & Number Theoretic Partitions (pp. 194–196)
- **Sections Covered:** Advanced AP/GP systems, Consecutive natural sum partitions of 100, General recurrence techniques.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Solving linear systems for $(a, d)$ and nonlinear systems for $(a, r)$. Number theoretic partition theorem: expressing $N$ as sum of consecutive natural numbers by analyzing odd divisors of $2N$. Power of 2 impossibility proof.
  2. *Predict First:* Smallest natural number $n$ such that $1+2+\dots+n > 1000$.
  3. *Play (Manipulative):* Consecutive Sum Partition Explorer. Interactive decomposition of $N$ into consecutive natural numbers; for 100, visualizes the 5-term and 8-term partitions.
  4. *Connect:* Goldbach-like additive number theory, quantum energy level quantization in physics.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Odd divisor partition theorem, 3-term GP product identity, and general recurrence reduction.

---

## 3. Verbatim Exercise Sets Audit (35 Items)

| Section | Question IDs | Count | Topic / Key Result | Guidance |
| :--- | :--- | :--- | :--- | :--- |
| **Exercise Set 8.1** | `ex-8-1-1` to `ex-8-1-6` | 6 | First 5 terms for 3 rules; 10th & 15th terms; Membership test of 97 and 172; Finding $n=122$ for 607; Recursive $t_1=-5, t_{n+1}=t_n+3$; Tribonacci-like $T_n=T_{n-1}+T_{n-2}+T_{n-3}$ | Included with full step-by-step guidance |
| **Exercise Set 8.2** | `ex-8-2-1` to `ex-8-2-7` | 7 | AP terms (10th=48, 26th=128); -81 is 35th term & 0 is 8th term; AP nth term $14-3n$; 50-term AP system ($t_{29}=64$); Sum of 2-digit mult of 3 (1665); Harish salary increment (11th yr); 25-row marble sum (325) | Included with full step-by-step guidance |
| **Exercise Set 8.3** | `ex-8-3-1` to `ex-8-3-7` | 7 | GP 12th term (3072); GP $5^n$ & $5^{10}$; Recurrence $t_{n+1}=3t_n-2$ gives 730 at $n=7$; GP 4374 is 8th term; Bouncing ball ($h_5=6.2208$m, vertical dist $301.3376$m); $2, 2\sqrt{2}, 4...$ 128 is 13th term; Sierpiński carpet 4-part exploration | Included with full step-by-step guidance |
| **End-of-Chapter** | `ex-8-ch-1` to `ex-8-ch-15` | 15 | AP from $t_{11}, t_{16}$ ($t_{31}=178$); AP from $t_3=16, t_7-t_5=12$; 3-digit mult of 7 (128); Multiples of 4 between 10 & 250 (60); GP with $S_2=-4, t_5=4t_3$; Consecutive sum partitions of 100 ($18..22$ and $9..16$); Bacteria doubling; AP $t_4+t_8=24, t_6+t_{10}=44$ (terms $-13, -8, -3$); Smallest $n$ for $S_n>1000$ ($n=45$); GP 131072 is 9th term; GP $S_3=13/12, P=-1$; GP proof $y^2=xz$; GP $S_3=26, S_{\text{sq}}=364$; Recurrence $P_n=2^{n-1}$; Recurrence $W_n$ Virahāṅka sequence | Included with full step-by-step guidance |
| **Total** | **All Sections** | **35** | **100% Complete Textbook Coverage** | **All 35 Verified** |

---

## 4. Verification & Quality Assurance

```bash
node tests/verify.cjs
```
- Mathematical Algorithm Verification: 6 suites passing.
- Curriculum Data Schema: 6 concepts, 18 quizzes with hints, 35 exercises with step-by-step guidance.
- Standalone HTML Budget: < 2.0 MB offline budget satisfied (~210 KB).
- Zero external CDN or unencrypted HTTP references.
- DOM Simulation Engine: all 6 engines initialize and render with `.update()` and `.render()`.
