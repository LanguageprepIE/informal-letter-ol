# Pedagogical listening audit — implementation for review

21 October 2026. Base: `85662293801cf10ce62cfc2a2f7f3631834e4209`.

The teacher approved implementing the Phase 1 audit. This branch contains the proposed changes for review; merging to main still requires separate authorization.

## Changes

The catalogue contains 131 questions across 25 activities:

| Activity | Before | After | Added anchors |
| --- | ---: | ---: | --- |
| Everyday 05 — Un trabajo para el verano | 5 | 7 | Workplace, normal working hours |
| People 05 — Álvaro, de aprendiz a inventor | 5 | 6 | Home city |
| Culture 05 — Una noche en el teatro | 5 | 7 | Number of companies, month rehearsals began |
| Weather 04 — El tiempo en Canarias | 5 | 6 | Fog on Tenerife mountain roads |

The other 21 activities retain five questions. Seventeen activity pages have targeted edits, including these four expansions. Questions, options and hints follow the approved proposal. Explanations and numbered transcript highlights match the final questions. Results use `items.length`; expanded instructions and catalogue counts reflect six or seven questions.

- Culture 03 now follows old-question order 1, 5, 2, 3, 4.
- Weather 05 now follows old-question order 1, 2, 4, 3, 5.
- Culture 01's final question asks only about the time of the school day, avoiding a return to the earlier Thursday reference.
- News 05's city evidence now includes Valencia; Weather 05's market evidence includes the wind and causal link.
- Weather 01 no longer calls Sevilla's temperature a maximum, which the transcript does not establish.
- Resolutive hints have been replaced; Spanish quotations have been removed from hints in activities 03–05. Original bilingual support in 01–02 is retained.
- Multi-detail items and selected distractors have been simplified as approved. No new audio has been generated.

Eight activities remain byte-for-byte unchanged: Everyday 01 and 02; People 01 and 02; Culture 02; News 01 and 02; Weather 02. All 25 MP3s and all spoken transcript text are unchanged, as are the audio URLs, CSS, shared transcript script and existing playback controls. No old Netlify site or hosting configuration is touched.

## Validation

Run from the repository root:

```sh
node tests/listening-audit.cjs
```

The test runs all 25 activity scripts in a DOM simulation and verifies:

- 131 questions, correct counts and sequential question/evidence numbering.
- Valid answer keys and complete post-answer explanations where previously supported.
- Guided/Independent visibility and pressed state; reset and transcript highlight/reset behavior.
- All-correct, all-wrong, unanswered and partial scores, including 6/6 and 7/7.
- The existing 0.75×, 0.85× and 1× assignments in all 23 pages with selectors.
- Unchanged transcript wording, all 25 MP3 hashes, source paths and eight untouched activities against the pinned audit base.
- Updated catalogue counts. No changes to the shared transcript script.

Result: pass. `git diff --check`: pass.

## Review limits

This is a static site with inline JavaScript; there is no separate compilation step or package build configuration. The test executes the scripts, but does not provide real browser rendering or audio playback verification.

Playwright Chromium installation was attempted; its download returned an incomplete archive. Real-browser and Safari/iPad interaction, visual layout, playback and touch testing remain to be checked in the review version. No perceptual listening assessment is claimed.

Everyday 01 and Weather 01 already lacked speed selectors at the audit base. This branch preserves that state and all 23 existing selectors; it does not add controls outside the approved targeted changes.
