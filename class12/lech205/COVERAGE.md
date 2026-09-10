# COVERAGE — lech205 Biomolecules

**Source:** `books/originals/Class12-Chemistry-Pt2_lech205.pdf` (22 pdf pages, printed pp. 281–302, Reprint 2026–27).  
**SHA-256:** `a6e215335dff95dfc4023bfbf1a994cbca7b35890ab75952a6cc1c390ba9c072` (`output/Class12/CHEM-SOURCE-MANIFEST.json`).  
**Extraction:** PyMuPDF `page.get_text("dict")` + `text` + 1.6× PNG zooms in `extracted/zooms/`. **pdftotext was not used.**  
**NCERT:** https://ncert.nic.in/textbook/pdf/lech205.pdf

Unit 10 of Chemistry Part II. **Polymers** and **Chemistry in Everyday Life** are not in this rationalised reprint and were not restored.

## Lessons (8)

| ID | Section | Print pp | PDF pp | Sim | Status |
|---|---|---|---|---|---|
| carb-class | 10.1–10.1.1 | 281–282 | 1–2 | `carbclass` | Complete; acetic acid vs rhamnose; reducing rule |
| glucose | 10.1.2.1 | 282–286 | 2–6 | `carblab` | Complete; six proofs; three failures; α 419 K / β 423 K; D vs (+) |
| fructose-disacch | 10.1.2.2–10.1.3 | 286–288 | 6–8 | `invertlab` | Complete; +52.5° / −92.4° invert sugar; sucrose 1→2; maltose; lactose |
| polysaccharides | 10.1.4–10.1.5 | 288–290 | 8–10 | `polylab` | Complete; amylose 15–20% 200–1000; amylopectin 80–85% C1–C6; cellulose β |
| aminoacids | 10.2.1–10.2.2 | 290–292 | 10–12 | `zwitterion` | Complete; Table 10.2 ten asterisks including Arg, His |
| peptide-protein | 10.2.3–10.2.4 | 292–295 | 12–15 | `peptidelab` | Complete; Gly-Ala; 1°–4°; denaturation 2°/3° lost |
| enzymes-vitamins-hormones | 10.3, 10.4, 10.6 | 295–301 | 15–21 | `vitaminlab` | Complete; Ea 6.22 / 2.15; Table 10.3; hormones; iodised salt |
| nucleicacids | 10.5 | 297–300 | 17–20 | `dnapair` | Complete; Fig. 10.7 A–T / C–G; nucleoside vs nucleotide; m/r/t-RNA |

## Zoom-verified numbers and structures

| Item | Value | Zoom |
|---|---|---|
| Starch hydrolysis | 393 K, 2–3 atm | p.3 |
| α-glucose m.p. / cryst. | 419 K / 303 K | p.5 |
| β-glucose m.p. / cryst. | 423 K / 371 K | p.5 |
| Invert rotations | glucose +52.5°; fructose −92.4° | p.7 |
| Amylose | 15–20%; 200–1000 α-D-Glc; C1–C4 | p.8 |
| Amylopectin | 80–85%; C1–C4 + C1–C6 | p.8 |
| Essential AA | Val Leu Ile Arg Lys Thr Met Phe Trp His | p.10–11 |
| Insulin | 51 amino acids | p.12 |
| Sucrase Ea | 6.22 kJ mol⁻¹ (acid) → 2.15 kJ mol⁻¹ (sucrase) | p.15 |
| Fat-soluble | A, D, E, K | p.16 |
| DNA pairs (text) | A with T; C with G | p.19 |

## Exercises 10.1–10.25

All 25 end-of-chapter exercises mapped with steps in `chapter.json`. Intext 10.1–10.8 covered in lessons.

## Edition notes (honest)

- **§10.3.1 Mechanism of Enzyme Action** in this reprint is two Ea values plus “Mechanism for the enzyme action has been discussed.” No lock-and-key / induced-fit figure is printed. The lab does not invent one.
- Table 10.2 marks **arginine and histidine** essential (ten asterisks). The summary also says ten. Quoted as printed.
- Fig. 10.7 draws A–T and G–C rungs. Body text does not print “two vs three hydrogen bonds”; the DNA lab uses the standard Watson–Crick counts **labelled as a model**.
- Sucrose’s own specific rotation is **not** printed; only +52.5° and −92.4° of the products and the sign change.
- Hormones (§10.6) **are** in this reprint (insulin/glucagon, thyroxine, iodised salt, Addison’s, sex steroids).
