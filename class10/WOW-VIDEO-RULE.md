# Wow video rule (2026-09-07): embed, 1 read + 1 video per Wow

## Why embed, not link-only
A generic homepage (FSSAI, ministry home) is a dead end for curiosity.
A topical 3-12 min video from a reputable edu channel inside the Wow card
keeps the student in the lesson. No downloads: click-to-play facade only.

## Data shape (JS-data chapters 101-108, 109, 113)
connect entry: [title, body, linksArray, videoObject]
- linksArray: keep at most ONE reading link, the single best article.
  Drop generic homepages: fssai.gov.in/, bis.gov.in, indianrailways.gov.in/,
  mnre.gov.in/, india.gov.in/, pmksy.gov.in, agriwelfare.gov.in/, moef.gov.in/,
  cpcb.nic.in/, dst.gov.in/, nhm.gov.in/, soilhealth/jaljeevan/firozabad homes.
  Keep deep article URLs (…/Aditya_L1.html, …/e-waste/, …/treaties/…).
- videoObject: {id:'<11-char YouTube ID>', title:'<oEmbed title>',
  channel:'<oEmbed author_name>'}

## Facade renderer (all chapters)
Button shows https://i.ytimg.com/vi/ID/hqdefault.jpg + play glyph + title·channel.
On click ONLY, replace with:
  <iframe src="https://www.youtube-nocookie.com/embed/ID?rel=0" ...>
No autoplay, no preload, no iframe before click. Offline: lessons/sims/quiz
work; button degrades to titled link-out.

## Curation bar
Topical to the exact Wow claim. Reputable edu channels first
(Periodic Videos, Veritasium, Steve Mould, Khan Academy, TED-Ed,
NASA/ISRO official, Amoeba Sisters, FuseSchool, Practical Engineering).
3-12 min preferred. Every ID verified via YouTube oEmbed (?url=watch?v=ID
returns title JSON) before editing. Never invent IDs. If none fits after
genuine search, keep reading link and mark video pending in COVERAGE.md.

## Static chapters 110-112
Same behavior via tiny inline script:
  button.video-facade[data-yt] -> click -> youtube-nocookie iframe.
Same CSS classes so design stays Lumen.
