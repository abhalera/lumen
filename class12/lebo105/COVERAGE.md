# COVERAGE — lebo105 Molecular Basis of Inheritance

**Source:** `books/originals/Class12-Biology_lebo105.pdf` (31 pdf pages, printed folio = pdf page + 78 (verified, see correction note below), Reprint 2026-27).

**Correction (2026-09-19):** an earlier pass wrongly recorded this chapter as folio-absent. Verified directly against the PDF: the printed folio appears as the first extracted text line on almost every page (only the chapter-opener page lacks one). Confirmed printed = 1-based PDF page + 78 across 3 independent anchor points with zero deviation. `printPage` on every exercise and `print` on every lesson now hold the real printed folio.
**SHA-256:** `21d77cdaf37c11b26956bbdae0b9eff9700d723135ac55c1a2141b1caee8f017` (in `/tmp/opencode/bio_maps.json`, key `lebo105`).
**Extraction:** PyMuPDF text layer (`/tmp/opencode/bio_text/lebo105.txt`) + section/exercise page maps in `/tmp/opencode/bio_maps.json`. **pdftotext was not used.**
**NCERT:** https://ncert.nic.in/textbook/pdf/lebo105.pdf

Honest notes: end-of-chapter questions print as bare numerals (Q1 prints as `1` without trailing dot; Q2–Q14 print as `2.`–`14.`). Section map entries with page 1 are TOC placeholders (5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10); lesson pdf ranges below use the real content pages (5.1.1→2, 5.1.2→5, 5.2.1→7, 5.2.2→8, 5.4.1→10, 5.4.2→12, 5.5.1→13, 5.5.2→14, 5.5.3→15, 5.6.1→19, 5.6.2→20, 5.8.1→22, 5.9.1→26, exercises→31). No PNG zooms (disk constraints); all numbers rechecked against the text layer.

## Concepts

| ID | Section | PDF pp | Status |
|---|---|---|---|
| dna-structure-packaging | 5.1, 5.1.1, 5.1.2 | 1–6 | Complete; nucleoside/nucleotide, Chargaff, helix 3.4 nm/10 bp/0.34 nm, Meischer/Watson-Crick/Wilkins-Franklin, 2.2 m, nucleoid, histone octamer/200 bp/beads-on-string, NHC, eu/heterochromatin |
| genetic-material-search | 5.2, 5.2.1, 5.2.2, 5.3 | 6–10 | Complete; Griffith S/R, Avery-MacLeod-McCarty DNase, Hershey-Chase ³²P/³⁵S blender, 4 criteria, 2'-OH/T-vs-U stability, RNA world |
| dna-replication | 5.4, 5.4.1, 5.4.2 | 10–13 | Complete; semiconservative Fig. 5.6, Meselson-Stahl ¹⁵N/CsCl Gen I hybrid Gen II 50/50, Taylor Vicia, polymerase 2000 bp/s/dNTP energy, fork/ligase/ori, S-phase/polyploidy |
| transcription-unit | 5.5, 5.5.1, 5.5.2, 5.5.3 | 13–17 | Complete; unit promoter/gene/terminator, template 3'→5'/coding 5'→3', ATGC→UACG, cistron mono/poly, exons/introns, sigma/rho, Pol I/II/III, splice/cap/tail 200–300 A |
| genetic-code-trna-mutation | 5.6, 5.6.1, 5.6.2 | 17–20 | Complete; Gamow 4³=64, Khorana/Nirenberg/Ochoa, 61+3/AUG/UAA-UAG-UGA, degenerate/contiguous/universal, RAM frameshift, Glu→Val sickle, tRNA anticodon/clover-L |
| translation-synthesis | 5.7 | 20–21 | Complete; charging/ATP, ribosome 80 proteins/2 sites/23S ribozyme, AUG→stop + UTRs, initiation/elongation/release factor |
| lac-operon-regulation | 5.8, 5.8.1 | 21–23 | Complete; Jacob-Monod, i/p/o/z/y/a, β-gal/permease/transacetylase, lactose/allolactose inducer, basal leak, negative regulation, shutdown |
| hgp-fingerprinting | 5.9, 5.9.1, 5.9.2, 5.10 | 24–29 | Complete; 1990–2003 $9B/3300 books/EST/BAC-YAC/Sanger/chr1-2006, 3164.7 Mb/3000/2.4 Mb/30k/99.9%/<2%/2968/231/1.4M SNPs, Jeffreys VNTR 0.1–20 kb Southern 6 steps/PCR |

## Core Facts (text-verified)

| Item | Topic | Result |
|---|---|---|
| Lengths | Genomes | φ×174 5386 nt; lambda 48502 bp; E. coli 4.6×10⁶ bp; human haploid 3.3×10⁹ bp |
| Helix | Dimensions | pitch 3.4 nm; 10 bp/turn; rise 0.34 nm/bp; A=T 2 H, G≡C 3 H |
| Packaging | Nucleosome | 200 bp on histone octamer; 6.6×10⁹ bp → ~2.2 m; E. coli 1.36 mm → ~4×10⁶ bp |
| Proof | Years/labels | Griffith 1928; Avery 1933–44; Hershey-Chase 1952; ³²P DNA in, ³⁵S protein out |
| Replication | Bands | Gen I 100% hybrid; Gen II 50/50; Gen IV (80 min) 12.5% hybrid/87.5% light; 2000 bp/s |
| Transcription | Example | template 3'-ATGC…-5' → RNA 5'-UACG…-3'; tail 200–300 A; 3 nuclear Pols |
| Code | Table | 64 = 61 sense + UAA/UAG/UGA; AUG Met/start; UUU Phe; Met-(Phe)₆ demo |
| Translation | Ribosome | ~80 proteins; 23S rRNA ribozyme; AUG→stop + 5'/3' UTRs |
| lac | Genes | i + z/y/a; inducer lactose/allolactose; repressor–operator negative control |
| HGP | Portrait | 3164.7 Mb; ~30,000 genes; <2% coding; chr1 2968 / Y 231; 1.4M SNPs; chr1 done May 2006 |
| Fingerprint | VNTR | mini-satellite 0.1–20 kb; Southern 6 steps; PCR single-cell; Fig. 5.16 B match |

## End-of-Chapter Exercises 1–14

All **14** exercises from this reprint mapped with verbatim stems and NCERT-faithful stepwise solutions in `chapter.json` (all on pdf p. 31; printed folio = pdf page + 78 (verified, see correction note below)).

## Pedagogical Simulations (sims.js — separate script)

1. `helix` — base-pair builder with Chargaff check (A=T/G≡C, 3.4 nm/10 bp).
2. `transformation` — Griffith/Hershey-Chase experiment stepper (S/R, DNase, ³²P/³⁵S blender).
3. `replication` — Meselson-Stahl density bands + fork explorer (hybrid/light, ligase).
4. `transcription` — transcription-unit walker (template/coding/mRNA, cap/tail).
5. `codon` — codon-table translator + mutation effect (64/61/3, frameshift).
6. `translation` — ribosome stepper (charging → elongation → release factor).
7. `lacoperon` — lactose on/off gene switch (i/p/o/z/y/a, repressor).
8. `fingerprint` — VNTR band matcher (Southern blot logic, PCR).
