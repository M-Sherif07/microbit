/* Labs that exist only in this React project, not in the original course. They're kept out of
   labs.json because tools/sync-home.mjs rewrites that file from the original course.
   Each entry has the same shape as a labs.json entry; "before" replaces the usual
   "builds on the previous lab" note. */
import { SCENARIOS, STEPS } from "../labs/plan-code-lab/scenarios.js";

const PLAN_STEPS = {
  understand: ["Understand the problem", "Pick out the inputs, the processing and the outputs from the client brief."],
  pseudo: ["Write the pseudocode", "Plan the program in plain English, with a checklist that updates as you type."],
  flow: ["Build the flowchart", "Turn each line of pseudocode into the right flowchart shape and watch the chart draw itself."],
  code: ["Write the Python", "Translate the plan into micro:bit Python and run it with your own inputs."],
  test: ["Test it", "Predict each result from the brief, run every test, add your own and explain what you found."]
};

export default [
  {
    folder: "plan-code-lab",
    title: "Plan It, Code It",
    key: "ictprg302-plan-code-progress",
    blurb: "Take a client brief all the way to tested code: pseudocode, a flowchart, Python and a test table.",
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%231b5fa8'/><text x='32' y='43' font-family='Menlo,Consolas,monospace' font-size='30' font-weight='700' fill='white' text-anchor='middle'>◇</text></svg>",
    slides: ["Flowcharts and Pseudocode", "04 Selection", "06 Loops and Conditions"],
    outcomes: [
      "Pick out the inputs, processing and outputs in a client brief",
      "Plan a program in pseudocode, then turn the plan into a flowchart",
      "Translate a plan into micro:bit Python, one line at a time",
      "Test with normal, boundary and invalid values, and explain what the tests found"
    ],
    before: "This lab uses selection and loops. Finish the Selection Lab and the Loops Lab first.",
    ids: SCENARIOS.flatMap(sc => STEPS.map(([k]) => `${sc.id}-${k}`)),
    topics: SCENARIOS.map(sc => ({
      id: sc.id, tab: sc.tab, title: sc.title, lead: sc.lead,
      acts: STEPS.map(([k], i) => ({ id: `${sc.id}-${k}`, tag: `Step ${i + 1}`, title: PLAN_STEPS[k][0], brief: PLAN_STEPS[k][1] }))
    }))
  }
];
