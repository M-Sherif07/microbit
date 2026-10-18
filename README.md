# ICTPRG302 Python Labs (React)

A React + Vite version of the labs in `../ICTPRG302-Python-Labs`. The **home page** and the **Loops Lab** are
React; the other five labs are still the original pages, copied into `public/` so every link works.

```sh
npm install
npm run dev        # http://localhost:5173/ (home page)
npm run build      # static site in dist/ (upload dist/ to the website or LMS)
npm run check      # check every React lab's content: answers, solutions, tooltips (no browser needed)
npm run sync       # refresh the home page data and the not-yet-ported labs from the original course
```

Run `npm run check` after editing a lab's `content.js`. It lists anything a student couldn't finish
(a wrong answer, a model solution that fails its own check, a line without a tooltip).

The build uses relative paths, so `dist/` works from any folder. Progress is saved under the same
localStorage keys as the original pages.

## Where things live

| To change | Edit |
|---|---|
| Questions, programs, flowcharts, challenges | `src/labs/<lab>/content.js` |
| Topic intros, activity titles and order | `topics` in the same `content.js` |
| How an activity type behaves | `src/activities/*.jsx` (the `kind` in content.js picks the component) |
| Colours and layout | `src/styles.css` (copied from the original page) |
| The Python simulator | `src/lib/python.js` |
| What the hover tooltip says about a line of code | `src/lib/explain.js` (Python and pseudocode), used by every lab |
| Tooltips and changes on the not-yet-ported labs | `src/original/code-tips.js`, then run `npm run sync` |
| Next buttons and the end-of-topic bar on the not-yet-ported labs | `src/original/lab-nav.js`, then run `npm run sync` |
| The help shown when a student's code has an error | `src/lib/errorHelp.js` (tested by `npm run check`) |
| How a "Code it here" challenge is checked | `check:` on the challenge in `content.js` (helpers in `src/lib/checks.js`) |
| Home page layout and wording | `src/home/Home.jsx`, `src/home/home.css` |
| Home page lab list, outcomes, slides | rebuild the original course, then `node tools/sync-home.mjs` |

## Porting another lab

1. `node tools/extract-lab.mjs selection-lab` writes `src/labs/selection-lab/content.js` from the original page.
2. `node tools/sync-home.mjs` removes that lab's original copy from `public/`.
3. Copy `src/labs/loops-lab/main.jsx` and `loops-lab/index.html` for the new lab, and add it to `input` in `vite.config.js`.
4. Any activity `kind` that isn't in `src/activities/index.js` yet (Parsons puzzles, button and sensor
   programs, flowchart building ...) needs a component. The original page's `make<Kind>` function is the spec.

## Code it here

Each topic's micro:bit challenges can be coded on the page (`src/components/CodeLab.jsx`). When a
program finishes, the challenge's `check(run)` gets a record of what it did (text shown, images,
prints, button presses, `input()` answers, LEDs left on, the source) and returns `null` for a pass
or a one-line hint. Code and passes are saved under `ictprg302-<lab>-code`. "Reset my progress"
clears the passes but keeps students' code.
