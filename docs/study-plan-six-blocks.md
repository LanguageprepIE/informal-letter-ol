# Six-block study route — October to June preparation

21 October 2026. Base: `485235217e6f1fac23aed2310daa9edc417f679f`.

Replaces the standalone four-week route with six blocks of four study weeks. There are four sessions of about 20 minutes per week: language/vocabulary, reading, listening and writing. These are flexible study weeks without fixed dates, leaving space for holidays, school exams, catch-up and final revision. The route is a selection with spaced retrieval, not a requirement to complete the entire site or an official examination schedule.

| Block | Weeks | Focus |
| --- | --- | --- |
| 1 | 1–4 | Present foundations, short personal writing, supported comprehension |
| 2 | 5–8 | Broader topics, first past accounts, near-future plans |
| 3 | 9–12 | Selective support, explaining corrections, retrieval |
| 4 | 13–16 | Combining skills, retrieving language, complete emails |
| 5 | 17–20 | Independent attempts followed by evidence and model checking |
| 6 | 21–24 | Session management, precise comprehension, targeted revision |

## Resource choices

- 24 weekly readings: 20 distinct texts plus four revisits (travel, school, Fallas, health).
- 24 weekly listenings: 20 distinct recordings plus four revisits (Pablo, Clara, Fallas, northern weather warning). Five remaining recordings are optional alternatives, not extra weekly requirements.
- Listening support follows the audit, rather than increasing mechanically by file number. Long activities are reserved for the final block; Guided remains available when needed.
- Reading starts mostly with Guided, revisits familiar texts independently and moves to new Independent texts with direct Guided correction links.
- Writing moves from four personal sentences through paragraphs and short emails to complete original practice prompts, with time for correction. Twenty minutes is a study target, not an official SEC task timing.
- Language tasks link to existing vocabulary anchors, named Sentence Building workshops and actual grammar sections. They use recall, covered translations and sentence production. No new vocabulary quiz system is introduced in this change; broader vocabulary practice remains a separate follow-up.
- `index.html` describes the six-block plan and removes the obsolete “auditions in preparation” wording.

## Progress and timer

The route has 96 stable task IDs, separate counters for each block and an overall counter. Native details panels and six navigation links keep the page manageable. Links to blocks or weeks open the relevant panel.

The six-block plan fully replaces the old four-week plan. The obsolete previous-plan panel and its 16 tasks have been removed at the teacher’s request; the site has not yet been shared with students. Current progress continues to use `ol-study-plan-six-blocks-v1`, with the same 96 task IDs. No student work is migrated or reset. Malformed or unavailable local storage does not block the page, and a failed save is reported when ticking a task.

The existing focus timer markup and `js/study-timer.js` are unchanged. Reading, listening, vocabulary, grammar, Sentence Building and writing resources themselves are not edited.

## Validation

From the repository root:

```sh
node tests/study-plan.cjs
node tests/listening-audit.cjs
git diff --check
```

Results: pass. The new test verifies 6 blocks, 24 weeks, 96 unique new tasks, no legacy tasks or previous-plan panel, valid local links/anchors, stable current progress and reloads, counters, malformed/blocked storage, block/week deep links and unchanged timer markup. The existing listening audit passes for all 25 activities and 131 questions.

These tests use a DOM simulation, not real browser rendering. Safari/iPad layout, touch interactions and real navigation remain for teacher review; the earlier Chromium download failed, so no browser test is claimed.

Prepared on a review branch. No merge or production publication is authorized by this change alone.
