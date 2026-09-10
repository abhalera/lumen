# Chapter 7 Coverage: The Mathematics of Maybe — Introduction to Probability (iemh107)
**Textbook:** Ganita Manjari, Grade 9 Part I (NCF 2024–26 Reprint)  
**Curriculum Scope:** Pages 155–173 (19 pages)  
**Standard:** Golden Reference 5-Block Pedagogical Architecture  
**Deliverable:** Standalone single-file HTML (`index.html`), 100% offline, strictly < 2.0 MB budget.

---

## 1. Executive Summary & Curriculum Audit

| Metric | Target / Standard | Achieved Status | Verification |
| :--- | :--- | :--- | :--- |
| **Concepts** | 6 Deep Conceptual Units | **6 Concepts** | Verified via `chapter.json` & DOM |
| **Interactive Labs** | 6 Canvas/SVG Manipulatives | **6 Engines** | Full timeline controls (`▶ Play`, `⏸ Pause`, `⏭ Step`, `↺ Reset`) |
| **Formulas** | Complete Derivations | **16 Formulas** | Markdown math equations |
| **Practice Quizzes** | 3 per Concept with Hints | **18 Quizzes** | Complete hints and pedagogical explanations |
| **In-Text Exercises** | Sets 7.1, 7.2, 7.3, 7.4 | **12 Items** | Verbatim text, worked solutions |
| **End-of-Chapter Exercises** | Questions 1 to 16 | **16 Items** | Verbatim text, step-by-step guidance |
| **Total Exercise Items** | Complete Textbook Coverage | **28 Items** | 100% coverage, zero omissions |
| **Pedagogical Guidance** | Native Expandable `<details>` | **28 / 28** | Includes `"Step-by-Step Pedagogical Guidance"` |
| **Offline File Budget** | Strictly < 2,048 KB | **~190 KB** | Standalone zero-CDN single-file HTML |

---

## 2. Concept Breakdown & Pedagogical Mapping

### Concept 1: Randomness, Chance & The 0-to-1 Probability Scale (pp. 155–159)
- **Sections Covered:** 7.1 What is Probability?, 7.1.1 What is Randomness?, 7.1.2 The Probability Scale.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Deterministic vs random events. Ancient Indian heritage: *Jñān-Chaupaḍ* (ancestor of Snakes and Ladders). The probability continuum from 0 (Impossible) to 1 (Certain) with 0.5 as Even Chance.
  2. *Predict First:* Rating the likelihood of picking a purple card from an 8-green, 2-purple deck.
  3. *Play (Manipulative):* The 0-to-1 Probability Scale & Card Deck Meter. Adjustable 6-card deck with dynamic needle traversing color-coded zones.
  4. *Connect:* Meteorological PoP rainfall forecasting, medical diagnostic sensitivity.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Probability boundary formulas and likelihood classification table.

### Concept 2: Experimental Probability & The Law of Large Numbers (pp. 159–161)
- **Sections Covered:** 7.2 Measuring Probability Objectively, 7.2.1 Experimental Probability.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Empirical relative frequency $P_{\text{exp}}(E) = k/N$. Asymmetrical objects (e.g. paper cups). The Law of Large Numbers (Jakob Bernoulli, 1713): convergence of empirical frequency to theoretical probability as $N 	o \infty$.
  2. *Predict First:* Explaining why 8 Heads out of 10 tosses does not mean the coin is biased.
  3. *Play (Manipulative):* Law of Large Numbers (LLN) Convergence Simulator. Batch flipping up to $N = 1000$ tosses, real-time polyline trajectory graph converging to golden $0.50$ reference line.
  4. *Connect:* Actuarial life insurance tables, semiconductor manufacturing defect monitoring.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Relative frequency and LLN limit equations.

### Concept 3: Theoretical Probability & Classical Equally Likely Outcomes (pp. 161–162)
- **Sections Covered:** 7.2.2 Theoretical Probability.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Laplace's classical formula $P(E) = n(E)/n(S)$ under physical symmetry. Standard dice, playing cards, word letter extractions ('PROBABILITY', 'PEACE'). Complement Rule: $P(\text{not } E) = 1 - P(E)$.
  2. *Predict First:* Probability of picking 'E' from cards of the word 'PEACE'.
  3. *Play (Manipulative):* Theoretical Probability on a Fair 6-Sided Die. Interactive filter toggles (Even, Prime, $>4$, Face 3) with dynamic visual face highlights and fraction breakdowns.
  4. *Connect:* SHA-256 cryptographic hash collision safety, Mendelian genetic inheritance ratios.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Classical ratio formula and complement identity.

### Concept 4: Statistical Sampling & The Gambler's Fallacy (pp. 162–165)
- **Sections Covered:** 7.2.3 Analysing Statistical Data Using Probability.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Population inference from representative random samples $\hat{N} = \hat{p} \times N_{\text{pop}}$. Statistical independence of trials. Debunking the Gambler's Fallacy: why coins have no memory and streaks do not make opposite outcomes 'due'.
  2. *Predict First:* Probability of rolling a 6 after rolling four consecutive 6s on a fair die.
  3. *Play (Manipulative):* Gambler's Fallacy & Statistical Sampling Lab. Streak simulator proving invariant $50\%$ next-flip probability, plus interactive school population fruit projection scaler.
  4. *Connect:* National electoral exit polling sample sizes, algorithmic financial trading models.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Sampling proportion formulas and independence definition.

### Concept 5: Sample Spaces, Compound Events & Tree Diagrams (pp. 166–169)
- **Sections Covered:** 7.3 Elements of Probability: Sample Spaces and Events, 7.4 Tree Diagrams.
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Exhaustive sample space listing, Cartesian product size $n(S) = n_1 \times n_2$. Multi-step coin and dice experiments. Tree diagram branching: path multiplication rule along branches and addition rule across disjoint paths. Sampling with vs without replacement.
  2. *Predict First:* Probability of getting exactly two Heads when tossing 3 fair coins.
  3. *Play (Manipulative):* Multi-Stage Probability Tree Diagram Lab. Interactive 2-step coin tree and 2-stage urn (4 Red, 5 Blue) tree with toggleable replacement modes.
  4. *Connect:* Random forest decision trees in machine learning, sports knockout tournament bracket progressions.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Multi-step sample space listing and conditional tree multiplication rules.

### Concept 6: Geometric Probability & Continuous Regional Likelihood (pp. 172–173)
- **Sections Covered:** Geometric Probability, End-of-Chapter Q16 (Drop Target).
- **Pedagogical 5-Block Flow:**
  1. *Learn:* Transitioning from discrete counting to continuous 2D spatial area ratios: $P(E) = \text{Area}(E) / \text{Area}(S)$. Case study: dropping a dye on a $2\text{ m} \times 3\text{ m}$ rectangle with a $1\text{ m}$ diameter circle ($P = \pi / 24 \approx 13.09\%$). Monte Carlo numerical methods for estimating $\pi$.
  2. *Predict First:* Probability of hitting an inscribed circular bullseye inside a square target.
  3. *Play (Manipulative):* Geometric Dartboard & Monte Carlo $\pi$ Drop Sandbox. Interactive $2\text{ m} \times 3\text{ m}$ rectangular board with circular target; batch drop engine (100 to 1500 darts) computing live empirical hit ratios.
  4. *Connect:* CERN particle physics cross-sectional collision areas, cellular telecom Voronoi coverage.
  5. *Practice:* 3 concept quizzes with hints and solutions.
  6. *Revise:* Continuous area probability formula and Monte Carlo estimator equation.

---

## 3. Verbatim Exercise Sets Audit (28 Items)

| Section | Question IDs | Count | Topic / Key Result | Guidance |
| :--- | :--- | :--- | :--- | :--- |
| **Exercise Set 7.1** | `ex-7-1-1` | 1 (4 sub-parts) | Likelihood ranking: Monday after Sunday, Snow in Mumbai, Elephant in class, Greet friend | 100% Worked |
| **Exercise Set 7.2** | `ex-7-2-1` to `ex-7-2-6` | 6 | Sample sweets proportion, school club preferences, 20-coin toss experiment, paper cup orientations, die even number, short-run vs long-run die frequencies | 100% Worked |
| **Exercise Set 7.3** | `ex-7-3-1` to `ex-7-3-3` | 3 | Die sample size, combined die+coin sample space, integer sets, village fair snacks & drinks | 100% Worked |
| **Exercise Set 7.4** | `ex-7-4-1` to `ex-7-4-2` | 2 | Two fruit baskets tree diagram, 3-color pen replacement tree with same-color probability | 100% Worked |
| **End-of-Chapter** | `eoc-7-1` to `eoc-7-16` | 16 | Fill-in-blanks, football survey relative frequency, equally likely criteria, 5 multi-part sample space calculations, candy drawing, outfit table, 1000 tyre lifespans, 'PEACE' letters, 8-sector arrow spinner, 2-ball urn tree without replacement, pair of dice impossible/certain events, 5 advanced probability problems (prime sum, balls of diff colours, first coin heads, even 4-digit number, MCQ guessing), with/without replacement 4-ball tree, coin+card space, 3-coin heads sample space validation, and geometric probability dye drop ($\pi/24$) | 100% Worked |
| **TOTAL** | **28 Items** | **28** | **All 28 Textbook Questions Complete** | **100% Passed** |

---

## 4. Verification Suite & Architectural Quality Gate

The chapter was verified against the automated Node.js suite `tests/verify.cjs`:
1. **Mathematical Algorithm Verification:**
   - Classical fair die probability verified: $P(\text{Even}) = 0.5$, $P(\text{Prime}) = 0.5$, $P(>4) = 1/3$.
   - Law of Large Numbers empirical convergence verified over 2,000 simulated tosses.
   - Independence and Gambler's Fallacy invariance verified ($P = 0.50$ regardless of streak).
   - Multi-stage urn probabilities verified: without replacement ($5/18 \approx 27.8\%$) and with replacement ($20/81 \approx 24.7\%$).
   - Geometric probability verified for $2\text{ m} \times 3\text{ m}$ rectangle and $1\text{ m}$ circle ($P = \pi/24 \approx 0.1309$).
2. **Curriculum Schema:**
   - Exactly 6 concepts, 18 quizzes with hints, and 28 exercises validated.
3. **Budget & Offline Safety:**
   - Standalone single-file HTML size is ~190 KB (strictly under 2,048 KB).
   - Zero external CDNs, zero remote tracking, zero preloaded iframes.
   - All inline scripts parse without syntax errors.
4. **DOM Simulation Sandbox:**
   - All 6 simulation engines initialize, update, and render cleanly in a headless DOM environment.
