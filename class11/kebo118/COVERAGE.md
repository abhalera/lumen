# kebo118 Coverage — Neural Control and Coordination (Ch. 18, print pp. 230–238)

## Lessons (7)
| # | Lesson | Sections | Sims |
| 1 | Coordination and the Neural System | Introduction + 18.1 | coordlab |
| 2 | Human Neural System: CNS, PNS and Their Divisions | 18.2 | hnslab |
| 3 | Neuron: Structure, Shapes and Myelin | 18.3 | neuronlab |
| 4 | Generation and Conduction of the Nerve Impulse | 18.3.1 | impulselab |
| 5 | Transmission of Impulses Across the Synapse | 18.3.2 | synapselab |
| 6 | Brain: Command Centre and Forebrain | 18.4 + 18.4.1 | forelab |
| 7 | Midbrain, Hindbrain and the Brain Stem | 18.4.2–18.4.3 + Summary | hindlab |

## Exercises (10, all solved)
| **18.1** | Structure of the brain | 100% Fully solved (command centre to brain stem) |
| **18.2** | CNS/PNS; resting/action potential | 100% Fully solved both comparisons (a)–(b) |
| **18.3** | Polarisation, depolarisation, chemical transmission | 100% Fully solved (a)–(c) |
| **18.4** | Labelled diagrams: neuron, brain | 100% Fully solved with inline labelled SVG art (a)–(b) |
| **18.5** | Short notes (a)–(e) | 100% Fully solved all five notes |
| **18.6** | Mechanism of synaptic transmission | 100% Fully solved (electrical + chemical) |
| **18.7** | Role of Na+ | 100% Fully solved (gradient, influx, reversal) |
| **18.8** | Four distinctions (a)–(d) | 100% Fully solved all four |
| **18.9** | Most developed part; master clock | 100% Fully solved with scope flag on (b) |
| **18.10** | Afferent/efferent, conduction, cranial/spinal | 100% Fully solved (a), (b), (f) with scope flags on (b) and (f) |

## Print-fidelity notes
- Print spellings kept verbatim: homeostasis, point-to-point connections, synchronised fashion, ganglia, visceral nervous system, comprises of, afferent/efferent fibres, somatic/autonomic, sympathetic/parasympathetic, nerves/fibres/ganglia/plexuses, viscera, Nissl’s granules, synaptic knob, neurotransmitters, neuro-muscular junction, multipolar/bipolar/unipolar, cerebral cortex, retina of eye, embryonic stage, Schwann cells, myelin sheath, nodes of Ranvier, autonomous, excitable cells, polarised, ion channels, selectively permeable, axoplasm, concentration gradient, sodium-potassium pump, 3 Na+ outwards for 2 K+, resting potential, depolarised, action potential, nerve impulse, fraction of a second, responsive to further stimulation, pre-synaptic/post-synaptic, synaptic cleft, fluid-filled space, specific receptors, excitatory or inhibitory, command and control system, thermoregulation, circadian (24-hour) rhythms, behaviour, cranial meninges, dura mater, arachnoid, pia mater, sagital (Figure 18.4 caption), corpus callosum, cerebral hemispheres, grey matter, white matter, association areas, intersensory associations, coordinating centre, neurosecretory cells, hypothalamic hormones, limbic lobe or limbic system, amygdala, hippocampus, sexual behaviour, cerebral aqueduct, passess, corpora quadrigemina, fibre tracts, convoluted surface, cardiovascular reflexes, gastric secretions, medulla oblongata, brain stem, mid brain (stem list), Pons consists (body) and Pons consist (Summary), spiral cord (Summary), olfaction, semicircular canals, Figures 18.1–18.4.
- Print grammar quirks kept: “which possess synaptic vesicles”, “is called as the resting potential”, “and, therefore is, polarised”, “and thus form a concentration gradient”, “which is in fact termed as a nerve impulse”, “Cerebellum has very convoluted surface”, “Brain stem forms the connections”.
- Figures cited in print: Figure 18.1 (neuron), Figure 18.2 (impulse conduction at A and B), Figure 18.3 (axon terminal and synapse), Figure 18.4 (sagital section of the human brain).
- Q10’s groundtruth stem labels the third subpart (f), skipping (c)–(e) — kept verbatim per the groundtruth contract, and answered as (f).
- The reprint ends the chapter at the hindbrain/Summary: the old-edition reflex-arc and sense-organ sections are cut, and no such content is included.
- Scope flags: Q9(b) (master-clock part unnamed in print), Q10(b) (no conduction-speed comparison in print), Q10(f) (no cranial/spinal origins, counts or names in print) carry explicit beyond-print markers, named in the exercises note.
- Art policy: only Q4’s stem cites a diagram/figure, so only Q4 carries inline SVG art; no other exercise carries art.
- No beyond-chapter insertions: no saltatory/refractory/threshold language, no millivolt values, no gated-channel types, no named neurotransmitters, no calcium/ATP machinery, no reflex arc, no cortical lobes, no cranial/spinal counts or names, no autonomic catchphrases.

## Verification Criteria
- [x] Strict offline bundle (< 2.0 MB target).
- [x] Zero external CDN fonts, stylesheets, or scripts.
- [x] Zero eager iframes in static markup.
- [x] 7 custom native interactive simulations.
- [x] 21 multi-tier practice quizzes with instant feedback.
- [x] 100% solved NCERT exercises (all 10 exercises).
- [x] Validated by Node test harness (`tests/verify.cjs`).
