// Content for the Loops Lab.
// First generated from loops-lab/index.html by tools/extract-lab.mjs; edit this file directly from now on.
// Each activity is { kind, data }: kind picks the component in src/activities, data is its rounds or questions.
import { P_, IO_, D_, J_, W_, CH_ } from "../../lib/flowchart.js";
import { MB_HEAD } from "../../lib/python.js";
import { nums, shown, listText, expectShown, usesFor, usesWhile, countFor } from "../../lib/checks.js";

export const meta = {
  "slug": "loops-lab",
  "brand": "ICTPRG302 Loops Lab",
  "title": "Loops Lab",
  "key": "ictprg302-loops-progress",
  "chKey": "ictprg302-loops-challenges",
  "next": {
    "href": "../datatypes-strings-lab/index.html",
    "label": "Next: Data Types & Strings Lab →"
  },
  "psKeywords": [
    "WHILE",
    "FOR",
    "STEP",
    "TIMES",
    "EACH"
  ]
};

export const topics = [
  {
    "id": "while-loops",
    "label": "While loops",
    "eyebrow": "Topic 06",
    "title": "While loops",
    "lead": "A while loop is like an if statement that repeats. It keeps running its body while the condition is True, and stops as soon as the condition is False.",
    "acts": [
      {
        "id": "w1",
        "tag": "Activity 1",
        "title": "How many times?",
        "brief": "Work out how many times the loop body runs, type your answer, then run it and watch the loop counter. Each check of the while line is marked True or False.",
        "roundLabel": "Program",
        "nextLabel": "Next program →"
      },
      {
        "id": "w2",
        "tag": "Activity 2",
        "title": "Track, check, update",
        "brief": "Every while loop that stops has three key parts. Click the line for each part, in order.",
        "roundLabel": "Program",
        "nextLabel": "Next program →"
      },
      {
        "id": "w3",
        "tag": "Activity 3",
        "title": "Will it ever stop?",
        "brief": "Decide what each loop will do: stop, run forever, or never run at all. Then watch it run. The simulator gives up after 25 times round.",
        "roundLabel": "Program",
        "nextLabel": "Next program →"
      },
      {
        "id": "w9",
        "tag": "Activity 4",
        "title": "Predict the output",
        "brief": "Read the while loop and pick what it prints. Then run it and watch the variables change each time round.",
        "roundLabel": "Program",
        "nextLabel": "Next program →"
      },
      {
        "id": "w4",
        "tag": "Activity 5",
        "title": "Follow the flowchart",
        "brief": "In a flowchart, the while line is a diamond. Yes runs the loop body, No leaves the loop, and the arrow on the left goes back to check again.",
        "roundLabel": "Chart",
        "nextLabel": "Next chart →"
      },
      {
        "id": "w5",
        "tag": "Activity 6",
        "title": "Dry run the plan",
        "brief": "Predict what the plan does, then watch a dry run fill in the trace table. A trace table is the best way to check a loop by hand.",
        "roundLabel": "Plan",
        "nextLabel": "Next plan →"
      },
      {
        "id": "w6",
        "tag": "Activity 7",
        "title": "Find the error in the plan",
        "brief": "Each plan has one mistake that stops it meeting its goal. Click the line with the error, then choose the fix.",
        "roundLabel": "Plan",
        "nextLabel": "Next plan →"
      },
      {
        "id": "w7",
        "tag": "Activity 8",
        "title": "Quick quiz: while loops",
        "brief": "Counting loops, conditions and infinite loops. Answer all of them correctly to finish."
      },
      {
        "id": "w8",
        "tag": "Activity 9",
        "title": "Spot the bug",
        "brief": "Each while loop has one bug: a missing colon, the wrong comparison, an update in the wrong place… Click the line, then choose the fix.",
        "roundLabel": "Bug",
        "nextLabel": "Next bug →"
      }
    ],
    "real": {
      "key": "w",
      "title": "While loop challenges",
      "intro": "Open the micro:bit Python editor, paste the starter code and finish each challenge. Test it in the simulator, then send it to your micro:bit and tick it off."
    }
  },
  {
    "id": "for-loops",
    "label": "For loops",
    "eyebrow": "Topic 07",
    "title": "For loops",
    "lead": "A for loop is cleaner when you know how many times to repeat. It creates the counter, updates it, and stops at the right time, all in one line.",
    "acts": [
      {
        "id": "r1",
        "tag": "Activity 1",
        "title": "Range explorer",
        "brief": "Change the start, stop and step to see exactly which numbers range() gives. Make them match the target, then go on to the next one. The stop number is never included.",
        "roundLabel": "Target",
        "nextLabel": "Next target →"
      },
      {
        "id": "r2",
        "tag": "Activity 2",
        "title": "Predict the output",
        "brief": "Read the for loop and pick what it will do. Then run it and watch the loop variable change each time round.",
        "roundLabel": "Program",
        "nextLabel": "Next program →"
      },
      {
        "id": "r10",
        "tag": "Activity 3",
        "title": "How many times?",
        "brief": "Work out how many numbers the range() gives, which is how many times the loop body runs. Type your answer, then run it and watch the loop counter.",
        "roundLabel": "Program",
        "nextLabel": "Next program →"
      },
      {
        "id": "r3",
        "tag": "Activity 4",
        "title": "Convert it: while → for",
        "brief": "Each while loop on the left can be written as a shorter for loop. Pick the one that goes through exactly the same numbers.",
        "roundLabel": "Loop",
        "nextLabel": "Next loop →"
      },
      {
        "id": "r4",
        "tag": "Activity 5",
        "title": "Which loop?",
        "brief": "For each job, decide which loop fits best. Do you know how many times it repeats, or does it depend on something that happens?"
      },
      {
        "id": "r5",
        "tag": "Activity 6",
        "title": "Follow the flowchart",
        "brief": "A for loop as a flowchart: the diamond asks whether range() has any numbers left. Each Yes hands out the next number.",
        "roundLabel": "Chart",
        "nextLabel": "Next chart →"
      },
      {
        "id": "r6",
        "tag": "Activity 7",
        "title": "Translate it",
        "brief": "Choose the Python for each line of the plan. In pseudocode, FROM 1 TO 5 includes 5. In Python, range() always stops one before.",
        "roundLabel": "Plan",
        "nextLabel": "Next plan →"
      },
      {
        "id": "r7",
        "tag": "Activity 8",
        "title": "Complete the plan",
        "brief": "Choose the right number, keyword or step for each blank so the plan meets its goal. Then compare it with the Python.",
        "roundLabel": "Plan",
        "nextLabel": "Next plan →"
      },
      {
        "id": "r8",
        "tag": "Activity 9",
        "title": "Quick quiz: for loops",
        "brief": "range(), loop variables and choosing the right loop. Answer all of them correctly to finish."
      },
      {
        "id": "r9",
        "tag": "Activity 10",
        "title": "Spot the bug",
        "brief": "Each for loop has one bug, often in the range() numbers. Click the line, then choose the fix.",
        "roundLabel": "Bug",
        "nextLabel": "Next bug →"
      }
    ],
    "real": {
      "key": "r",
      "title": "For loop challenges",
      "intro": "These practise counting with range(). The last one puts a loop inside a loop."
    }
  }
];

export const activities = {
  w1: { kind: "HowMany", data: [
    { lines: ["count = 0", "MAX_COUNT = 10", "while count < MAX_COUNT:", "    display.show(count)", "    sleep(500)", "    count = count + 1", "display.clear()"], answer: 10,
      why: "count takes the values 0 to 9. When it reaches 10, count < 10 is False and the loop stops." },
    { lines: ["count = 0", "while count < 20:", "    print(count)", "    sleep(200)", "    count = count + 1"], answer: 20, why: "Loop 1 from the slides: 0 to 19 is 20 values." },
    { lines: ["count = 0", "while count <= 20:", "    print(count)", "    sleep(200)", "    count = count + 1"], answer: 21, why: "Loop 2: <= includes 20 itself, so it runs for 0 to 20, which is 21 values." },
    { lines: ["count = 1", "while count < 20:", "    print(count)", "    sleep(200)", "    count = count + 1"], answer: 19, why: "Loop 3: starting at 1 instead of 0 gives 1 to 19, which is 19 values." },
    { lines: ["count = 0", "while count == 20:", "    print(count)", "    sleep(200)", "    count = count + 1"], answer: 0, why: "Loop 4: count starts at 0, so count == 20 is False straight away and the body never runs." },
    { lines: ["count = 0", "while count < 20:", "    print(count)", "    sleep(200)", "    count = count + 2"], answer: 10, why: "Loop 5: going up in 2s gives 0, 2, 4 … 18, which is 10 values." },
    { lines: ["count = 10", "while count > 0:", "    print(count)", "    count = count - 1"], answer: 10, why: "Counting down from 10 to 1 is 10 values. At 0, count > 0 is False." },
    { lines: ["count = 0", "while count < 10:", "    print(count)", "    count = count + 3"], answer: 4, why: "count goes 0, 3, 6, 9. The next value, 12, isn't less than 10, so the loop stops after 4 times." },
    { lines: ["count = 0", "while count < 15:", "    print(count)", "    count = count + 5"], answer: 3, why: "count goes 0, 5, 10. At 15, count < 15 is False, so the body runs 3 times." },
    { lines: ["count = 20", "while count > 10:", "    print(count)", "    count = count - 2"], answer: 5, why: "count goes 20, 18, 16, 14, 12. At 10, count > 10 is False: 5 times." },
    { lines: ["lives = 3", "while lives >= 0:", "    display.show(lives)", "    sleep(300)", "    lives = lives - 1"], answer: 4, why: ">= 0 includes 0, so lives is 3, 2, 1 and 0: 4 times." },
    { lines: ["n = 1", "while n < 50:", "    print(n)", "    n = n * 3"], answer: 4, why: "n goes 1, 3, 9, 27. The next value, 81, isn't less than 50, so it runs 4 times." },
    { lines: ["count = 5", "while count < 5:", "    print(count)", "    count = count + 1"], answer: 0, why: "count is already 5, and 5 < 5 is False. The body never runs." },
    { lines: ["count = 0", "while count != 6:", "    print(count)", "    count = count + 2"], answer: 3, why: "count goes 0, 2, 4, then lands exactly on 6 and the loop stops: 3 times." },
    { lines: ["count = 0", "while count < 12:", "    count += 3", "    print(count)"], answer: 4, why: "count += 3 is short for count = count + 3. count is 0, 3, 6, 9 when it's checked, so 4 times." }
  ] },

  w2: { kind: "LinePick", data: [
    { lines: ["count = 0", "MAX_COUNT = 10", "while count < MAX_COUNT:", "    display.show(count)", "    sleep(500)", "    count = count + 1", "display.clear()"], track: 1, check: 3, update: 6,
      hints: { track: "MAX_COUNT never changes: it's the limit. Which variable changes as the loop runs?", check: "The condition is on the while line.", update: "Which line changes count?" },
      why: "count is tracked, the while line checks it, and count = count + 1 updates it. MAX_COUNT is a fixed limit." },
    { lines: ["count = 10", "while count > 0:", "    display.show(count)", "    count = count - 1", "    sleep(300)", "display.show(Image.HAPPY)"], track: 1, check: 2, update: 4,
      hints: { update: "The update doesn't have to add. Which line changes count?" }, why: "Counting down still has all three parts. The update just takes 1 away." },
    { lines: ["lives = 3", "while lives > 0:", "    display.show(lives)", "    sleep(1000)", "    lives = lives - 1", 'display.scroll("Game over")'], track: 1, check: 2, update: 5,
      why: "The tracking variable can have any name. Here it's lives." },
    { lines: ["presses = 0", "while presses < 5:", "    if button_a.was_pressed():", "        presses = presses + 1", "        display.show(presses)", "display.show(Image.HAPPY)"], track: 1, check: 2, update: 4,
      hints: { update: "The update can be inside an if. Which line changes presses?" }, why: "The update is inside an if, so presses only goes up when A is pressed. The loop keeps waiting until 5 presses." },
    { lines: ["temp = temperature()", "while temp < 30:", "    display.scroll(temp)", "    sleep(1000)", "    temp = temperature()", 'display.scroll("Hot!")'], track: 1, check: 2, update: 5,
      hints: { update: "With a sensor, updating means reading it again." }, why: "Reading the sensor again is the update. Without it, temp would never change and the loop would never stop." },
    { lines: ["score = 0", "while score < 50:", "    score = score + 10", "    display.scroll(score)", "display.show(Image.YES)"], track: 1, check: 2, update: 3, why: "The update doesn't have to be the last line in the loop body." },
    { lines: ["MAX_COUNT = 5", "count = 0", "while count < MAX_COUNT:", "    print(count)", "    count = count + 1"], track: 2, check: 3, update: 5, hints: { track: "MAX_COUNT is the limit and never changes. Which variable changes as the loop runs?" }, why: "count is tracked. MAX_COUNT is a fixed limit, written in capitals to show it doesn't change." },
    { lines: ["level = 1", "while level <= 3:", "    display.scroll(\"Level\")", "    display.show(level)", "    sleep(500)", "    level = level + 1"], track: 1, check: 2, update: 6, why: "level is tracked, checked against 3 and goes up by 1 at the end of each trip round." },
    { lines: ["light = display.read_light_level()", "while light < 100:", "    display.show(Image.ASLEEP)", "    sleep(500)", "    light = display.read_light_level()", "display.show(Image.HAPPY)"], track: 1, check: 2, update: 5, hints: { update: "With a sensor, the update is reading it again." }, why: "Reading the light level again is the update. Without it, light would never change." },
    { lines: ["tries = 0", "while tries < 3:", "    print(\"Try again\")", "    tries += 1"], track: 1, check: 2, update: 4, hints: { update: "+= 1 is a short way to add 1." }, why: "tries += 1 does the same job as tries = tries + 1." },
    { lines: ["count = 100", "while count > 0:", "    print(count)", "    count = count - 25"], track: 1, check: 2, update: 4, why: "Counting down in 25s: 100, 75, 50, 25. At 0, count > 0 is False." },
    { lines: ["pressed = 0", "goal = 3", "while pressed < goal:", "    if button_b.was_pressed():", "        pressed = pressed + 1", "display.show(Image.YES)"], track: 1, check: 3, update: 5, hints: { track: "goal is the target. Which variable counts up?", update: "The update is inside the if." }, why: "pressed is tracked. It only goes up when B is pressed, so the loop waits for 3 presses." },
    { lines: ["count = 0", "while count < 10:", "    count = count + 2", "    if count == 6:", "        display.show(Image.HEART)"], track: 1, check: 2, update: 3, why: "The update comes first here, then the if checks the new value." },
    { lines: ["speed = 1", "while speed < 64:", "    print(speed)", "    speed = speed * 2"], track: 1, check: 2, update: 4, hints: { update: "The update can multiply as well as add." }, why: "Doubling is still an update: 1, 2, 4 … 32, then 64 stops the loop." },
    { lines: ["x = 0", "while x < 5:", "    display.show(x)", "    sleep(200)", "    x = x + 1", "display.clear()"], track: 1, check: 2, update: 5, why: "The name doesn't matter: x is tracked, checked and updated just like count." }
  ] },

  w3: { kind: "StopOrNot", data: [
    { lines: ["count = 0", "while count < 5:", "    print(count)", "    count = count - 1"], a: 1, why: "The update goes the wrong way. count goes 0, -1, -2 … and is always less than 5." },
    { lines: ["count = 0", "while count < 5:", "    print(count)"], a: 1, why: "There's no update, so count stays 0 and the condition is True for ever." },
    { lines: ["count = 10", "while count < 5:", "    print(count)", "    count = count + 1"], a: 2, why: "count starts at 10, so count < 5 is False the very first time it's checked." },
    { lines: ["count = 0", "while count != 10:", "    print(count)", "    count = count + 3"], a: 1, why: "count goes 0, 3, 6, 9, 12 … It jumps straight past 10, so count != 10 never becomes False." },
    { lines: ["count = 0", "while count < 10:", "    print(count)", "    count = count + 3"], a: 0, why: "The same steps of 3, but < 10 catches the jump: at 12 the condition is False." },
    { lines: ["count = 5", "while count > 0:", "    print(count)", "    count = count - 2"], a: 0, why: "count goes 5, 3, 1, then -1. -1 > 0 is False, so it stops after 3 times." },
    { lines: ["count = 0", "while count < 3:", "    if count == 1:", '        print("one")', "        count = count + 1"], a: 1, why: "The update is inside the if, which is only True when count is 1. count starts at 0, so it never changes." },
    { lines: ["count = 0", "while count < 5:", "    print(count)", "    count = count + 1"], a: 0, why: "Track, check and update all work together, so count reaches 5 and the loop ends." },
    { lines: ["count = 1", "while count > 0:", "    print(count)", "    count = count + 1"], a: 1, why: "count keeps growing, so it's always bigger than 0." },
    { lines: ["count = 0", "while count > 10:", "    print(count)", "    count = count + 1"], a: 2, why: "0 > 10 is False the first time it's checked, so the body is skipped." },
    { lines: ["count = 10", "while count != 0:", "    print(count)", "    count = count - 2"], a: 0, why: "10 is even, so going down in 2s lands exactly on 0: 10, 8, 6, 4, 2, 0." },
    { lines: ["count = 9", "while count != 0:", "    print(count)", "    count = count - 2"], a: 1, why: "9 is odd: 9, 7, 5, 3, 1, -1 … count jumps past 0 and is never exactly 0." },
    { lines: ["count = 0", "while count < 5:", "    print(count)", "    count = count * 2"], a: 1, why: "0 times 2 is still 0, so count never changes." },
    { lines: ["count = 1", "while count < 100:", "    print(count)", "    count = count * 10"], a: 0, why: "count goes 1, 10, then 100. 100 < 100 is False, so it stops." },
    { lines: ["count = 0", "while count < 3:", "    print(count)", "count = count + 1"], a: 1, why: "The update isn't indented, so it's not part of the loop. count stays 0 inside the loop." }
  ] },

  w9: { kind: "Predict", data: [
    { lines: ["count = 0", "while count < 3:", "    print(count)", "    count = count + 1"], opts: ["0 1 2", "1 2 3", "0 1 2 3"], a: 0, why: "count is printed before it goes up, and 3 < 3 is False." },
    { lines: ["count = 1", "while count <= 4:", "    print(count)", "    count += 1"], opts: ["1 2 3", "1 2 3 4", "0 1 2 3 4"], a: 1, why: "It starts at 1, and <= 4 includes 4." },
    { lines: ["count = 10", "while count > 7:", "    print(count)", "    count -= 1"], opts: ["10 9 8 7", "9 8 7", "10 9 8"], a: 2, why: "count -= 1 takes 1 away. 7 > 7 is False, so 7 isn't printed." },
    { lines: ["count = 0", "while count < 10:", "    print(count)", "    count = count + 4"], opts: ["0 4 8", "0 4 8 12", "4 8"], a: 0, why: "count goes up in 4s. 12 isn't less than 10, so it's never printed." },
    { lines: ["n = 1", "while n < 20:", "    print(n)", "    n = n * 2"], opts: ["2 4 8 16", "1 2 4 8 16", "1 2 4 8 16 32"], a: 1, why: "n doubles each time. 32 is too big, so the loop stops before printing it." },
    { lines: ["count = 0", "while count < 3:", "    count = count + 1", "    print(count)"], opts: ["0 1 2", "0 1 2 3", "1 2 3"], a: 2, why: "The update comes first, so the first number printed is 1, and 3 is printed too." },
    { lines: ["count = 5", "while count < 5:", "    print(count)", "    count = count + 1", "print(\"End\")"], opts: ["End", "5 End", "Nothing"], a: 0, why: "5 < 5 is False, so the loop is skipped. Only the line after it runs." },
    { lines: ["total = 0", "n = 1", "while n <= 3:", "    total = total + n", "    n = n + 1", "print(total)"], opts: ["3", "6", "10"], a: 1, why: "1 + 2 + 3 = 6. print is after the loop, so it runs once." },
    { lines: ["count = 3", "while count > 0:", "    print(\"Beep\")", "    count = count - 1"], opts: ["Beep Beep", "Beep Beep Beep Beep", "Beep Beep Beep"], a: 2, why: "count is 3, 2, 1 when the body runs: three beeps." },
    { lines: ["count = 0", "while count < 10:", "    if count == 4:", "        break", "    print(count)", "    count = count + 1"], opts: ["0 1 2 3", "0 1 2 3 4", "4"], a: 0, why: "break leaves the loop as soon as count is 4, before it's printed." },
    { lines: ["count = 0", "while count < 6:", "    if count % 2 == 0:", "        print(count)", "    count = count + 1"], opts: ["1 3 5", "0 2 4", "0 2 4 6"], a: 1, why: "The if only lets even numbers through, and the loop stops before 6." },
    { lines: ["x = 20", "while x > 0:", "    print(x)", "    x = x - 7"], opts: ["20 13 6 -1", "13 6", "20 13 6"], a: 2, why: "x goes 20, 13, 6, then -1. -1 > 0 is False, so -1 isn't printed." },
    { lines: ["count = 1", "while count < 100:", "    count = count * 5", "print(count)"], opts: ["125", "25", "100"], a: 0, why: "count goes 1, 5, 25, 125. 25 < 100 is True, so it multiplies once more." },
    { lines: ["a = 0", "b = 10", "while a < b:", "    a = a + 2", "    b = b - 2", "print(a, b)"], opts: ["4 6", "6 4", "5 5"], a: 1, why: "a goes up and b comes down: (2, 8), (4, 6), (6, 4). Now a < b is False." },
    { lines: ["count = 0", "while True:", "    count = count + 1", "    if count == 3:", "        break", "print(count)"], opts: ["2", "It never stops", "3"], a: 2, why: "while True keeps going until break. When count reaches 3, break leaves the loop." }
  ] },

  w4: { kind: "FlowTrace", data: [
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 0")], body: [W_(D_("count < 3?")), IO_("Show count"), P_("count = count + 1")], post: [IO_("Clear screen", { clear: true })] },
      situation: "count = 0, then the while loop", visits: [{ q: "count is 0. Is count < 3?", a: true }, { q: "count is now 1. Is count < 3?", a: true }, { q: "count is now 2. Is count < 3?", a: true }, { q: "count is now 3. Is count < 3?", a: false, hint: "3 isn't less than 3." }],
      why: "The diamond is the while line. Yes runs the body; No leaves the loop. The loop-back arrow returns to the diamond, so the condition is checked again every time." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 3")], body: [W_(D_("count > 0?")), IO_("Show count"), P_("count = count - 1")], post: [IO_("Show HAPPY", { img: "HAPPY" })] },
      situation: "A countdown from 3", visits: [{ q: "count is 3. Is count > 0?", a: true }, { q: "count is now 2. Is count > 0?", a: true }, { q: "count is now 1. Is count > 0?", a: true }, { q: "count is now 0. Is count > 0?", a: false, hint: "0 isn't more than 0." }],
      why: "Track (count = 3), check (count > 0?) and update (count - 1): all three parts are on the chart." },
    { chart: { loop: true, loopLabel: "while: check again", body: [W_(D_("Button A\nnot pressed?")), IO_("Show ARROW_W", { img: "ARROW_W" }), P_("Wait 100 ms")], post: [IO_('Scroll "Go"', { scroll: "Go" })] },
      situation: "Waiting for button A", visits: [{ q: "Loop 1: nobody has touched A. Is A not pressed?", a: true }, { q: "Loop 2: still nothing. Is A not pressed?", a: true }, { q: "Loop 3: you press A. Is A not pressed?", a: false, hint: "A is pressed now, so \"not pressed\" is False." }],
      why: "We don't know how many times this will loop. That's exactly when a while loop is the right choice." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 0")], body: [W_(D_("count < 2?")), IO_("Show count"), P_("count = count + 1")], post: [IO_("Show HAPPY", { img: "HAPPY" })] }, situation: "count = 0, then a short loop", visits: [{ q: "count is 0. Is count < 2?", a: true, hint: "0 < 2 is True." }, { q: "count is now 1. Is count < 2?", a: true, hint: "1 < 2 is True." }, { q: "count is now 2. Is count < 2?", a: false, hint: "2 < 2 is False." }], why: "Two Yes answers, then No. The body ran twice, for count 0 and 1." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 1")], body: [W_(D_("count <= 3?")), IO_("Print count"), P_("count = count + 1")], post: [IO_('Print "Done"')] }, situation: "count = 1, and <= includes 3", visits: [{ q: "count is 1. Is count <= 3?", a: true, hint: "1 <= 3 is True." }, { q: "count is now 2. Is count <= 3?", a: true, hint: "2 <= 3 is True." }, { q: "count is now 3. Is count <= 3?", a: true, hint: "3 <= 3 is True." }, { q: "count is now 4. Is count <= 3?", a: false, hint: "4 <= 3 is False." }], why: "<= 3 includes 3, so the body runs for 1, 2 and 3." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("lives = 2")], body: [W_(D_("lives > 0?")), IO_("Show lives"), P_("lives = lives - 1")], post: [IO_('Scroll "Game over"', { scroll: "Game over" })] }, situation: "Two lives left", visits: [{ q: "lives is 2. Is lives > 0?", a: true, hint: "2 > 0 is True." }, { q: "lives is now 1. Is lives > 0?", a: true, hint: "1 > 0 is True." }, { q: "lives is now 0. Is lives > 0?", a: false, hint: "0 > 0 is False." }], why: "Each trip round loses a life. When lives reaches 0 the game is over." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 5")], body: [W_(D_("count < 3?")), IO_("Show count"), P_("count = count + 1")], post: [IO_("Show SAD", { img: "SAD" })] }, situation: "count starts at 5", visits: [{ q: "count is 5. Is count < 3?", a: false, hint: "5 < 3 is False." }], why: "The very first check is No, so the body is skipped completely. A while loop can run 0 times." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("total = 0")], body: [W_(D_("total < 10?")), P_("total = total + 4")], post: [IO_("Show total")] }, situation: "Add 4 until total reaches 10", visits: [{ q: "total is 0. Is total < 10?", a: true, hint: "0 < 10 is True." }, { q: "total is now 4. Is total < 10?", a: true, hint: "4 < 10 is True." }, { q: "total is now 8. Is total < 10?", a: true, hint: "8 < 10 is True." }, { q: "total is now 12. Is total < 10?", a: false, hint: "12 < 10 is False." }], why: "total goes 0, 4, 8, 12. It's checked before each trip, so it overshoots 10 and ends at 12." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("n = 1")], body: [W_(D_("n < 20?")), P_("n = n * 3")], post: [IO_("Show n")] }, situation: "Multiply by 3 until n reaches 20", visits: [{ q: "n is 1. Is n < 20?", a: true, hint: "1 < 20 is True." }, { q: "n is now 3. Is n < 20?", a: true, hint: "3 < 20 is True." }, { q: "n is now 9. Is n < 20?", a: true, hint: "9 < 20 is True." }, { q: "n is now 27. Is n < 20?", a: false, hint: "27 < 20 is False." }], why: "n goes 1, 3, 9, 27. 27 is the first value that isn't less than 20." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 10")], body: [W_(D_("count > 4?")), IO_("Show count"), P_("count = count - 3")], post: [IO_("Clear screen", { clear: true })] }, situation: "Count down from 10 in 3s", visits: [{ q: "count is 10. Is count > 4?", a: true, hint: "10 > 4 is True." }, { q: "count is now 7. Is count > 4?", a: true, hint: "7 > 4 is True." }, { q: "count is now 4. Is count > 4?", a: false, hint: "4 > 4 is False." }], why: "10 and 7 are bigger than 4. 4 > 4 is False: a number is never bigger than itself." },
    { chart: { loop: true, loopLabel: "while: check again", body: [W_(D_("Button B\nnot pressed?")), IO_("Show ARROW_E", { img: "ARROW_E" }), P_("Wait 100 ms")], post: [IO_('Scroll "Go"', { scroll: "Go" })] }, situation: "Waiting for button B", visits: [{ q: "Loop 1: nobody has touched B. Is B not pressed?", a: true }, { q: "Loop 2: still nothing. Is B not pressed?", a: true }, { q: "Loop 3: you press B. Is B not pressed?", a: false, hint: "B is pressed now, so \"not pressed\" is False." }], why: "The loop keeps waiting while B is not pressed. Pressing B makes the condition False, so the program moves on." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("light = light level")], body: [W_(D_("light < 50?")), IO_("Show ASLEEP", { img: "ASLEEP" }), P_("light = light level")], post: [IO_("Show HAPPY", { img: "HAPPY" })] }, situation: "Sleep until the room gets bright", visits: [{ q: "The light level is 10. Is light < 50?", a: true }, { q: "Someone opens the curtains a little: light is 30. Is light < 50?", a: true }, { q: "The lights go on: light is 80. Is light < 50?", a: false, hint: "80 is bigger than 50." }], why: "Reading the sensor again at the end of the body is the update. It's what lets the loop finish." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 0")], body: [W_(D_("count != 4?")), IO_("Show count"), P_("count = count + 2")], post: [IO_("Show YES", { img: "YES" })] }, situation: "count goes up in 2s until it is 4", visits: [{ q: "count is 0. Is count != 4?", a: true, hint: "0 != 4 is True." }, { q: "count is now 2. Is count != 4?", a: true, hint: "2 != 4 is True." }, { q: "count is now 4. Is count != 4?", a: false, hint: "4 != 4 is False." }], why: "!= means \"is not equal to\". count lands exactly on 4, so the condition becomes False." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("temp = temperature")], body: [W_(D_("temp < 25?")), IO_("Show temp"), P_("Wait 1 second"), P_("temp = temperature")], post: [IO_('Scroll "Warm"', { scroll: "Warm" })] }, situation: "Wait for the room to warm up", visits: [{ q: "temp is 18. Is temp < 25?", a: true }, { q: "The heater is on: temp is 22. Is temp < 25?", a: true }, { q: "temp is now 27. Is temp < 25?", a: false, hint: "27 is bigger than 25." }], why: "Nobody knows in advance how long the room will take to warm up, which is why this needs a while loop." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("count = 3")], body: [W_(D_("count >= 0?")), IO_("Show count"), P_("count = count - 1")], post: [IO_("Show HAPPY", { img: "HAPPY" })] }, situation: "Count down to 0, including 0", visits: [{ q: "count is 3. Is count >= 0?", a: true, hint: "3 >= 0 is True." }, { q: "count is now 2. Is count >= 0?", a: true, hint: "2 >= 0 is True." }, { q: "count is now 1. Is count >= 0?", a: true, hint: "1 >= 0 is True." }, { q: "count is now 0. Is count >= 0?", a: true, hint: "0 >= 0 is True." }, { q: "count is now -1. Is count >= 0?", a: false, hint: "-1 >= 0 is False." }], why: ">= 0 includes 0, so the loop shows 3, 2, 1 and 0. It stops at -1." }
  ] },

  w5: { kind: "PseudoTrace", data: [
    { ps: ["SET count TO 0", "REPEAT WHILE count < 3", "    PRINT count", "    ADD 1 TO count", "END REPEAT", 'PRINT "Done"'],
      given: "No input. Follow the loop until the condition is False.", q: "What is printed?", opts: ["0, 1, 2, Done", "0, 1, 2, 3, Done", "1, 2, 3, Done"], a: 0,
      steps: [{ l: 1, vars: { count: "0" } }, { l: 2, check: "0 < 3 → True" }, { l: 3, out: "0" }, { l: 4, vars: { count: "1" } }, { l: 2, check: "1 < 3 → True" }, { l: 3, out: "1" }, { l: 4, vars: { count: "2" } }, { l: 2, check: "2 < 3 → True" }, { l: 3, out: "2" }, { l: 4, vars: { count: "3" } }, { l: 2, check: "3 < 3 → False" }, { l: 6, out: "Done" }],
      why: "count is printed before it goes up. When it reaches 3 the check is False, so 3 is never printed." },
    { ps: ["SET lives TO 3", "REPEAT WHILE lives > 0", "    SUBTRACT 1 FROM lives", "END REPEAT", "DISPLAY lives"],
      given: "No input.", q: "What is displayed at the end?", opts: ["1", "0", "-1"], a: 1,
      steps: [{ l: 1, vars: { lives: "3" } }, { l: 2, check: "3 > 0 → True" }, { l: 3, vars: { lives: "2" } }, { l: 2, check: "2 > 0 → True" }, { l: 3, vars: { lives: "1" } }, { l: 2, check: "1 > 0 → True" }, { l: 3, vars: { lives: "0" } }, { l: 2, check: "0 > 0 → False" }, { l: 5, out: "0" }],
      why: "The loop stops as soon as lives > 0 is False, which first happens at 0." },
    { ps: ["SET total TO 0", "SET n TO 1", "REPEAT WHILE n <= 4", "    ADD n TO total", "    ADD 1 TO n", "END REPEAT", "DISPLAY total"],
      given: "No input. Track both variables.", q: "What is displayed?", opts: ["6", "10", "15"], a: 1,
      steps: [{ l: 1, vars: { total: "0" } }, { l: 2, vars: { n: "1" } }, { l: 3, check: "1 <= 4 → True" }, { l: 4, vars: { total: "1" } }, { l: 5, vars: { n: "2" } }, { l: 3, check: "2 <= 4 → True" }, { l: 4, vars: { total: "3" } }, { l: 5, vars: { n: "3" } }, { l: 3, check: "3 <= 4 → True" }, { l: 4, vars: { total: "6" } }, { l: 5, vars: { n: "4" } }, { l: 3, check: "4 <= 4 → True" }, { l: 4, vars: { total: "10" } }, { l: 5, vars: { n: "5" } }, { l: 3, check: "5 <= 4 → False" }, { l: 7, out: "10" }],
      why: "1 + 2 + 3 + 4 = 10. <= means 4 is included." },
    { ps: ["SET count TO 0", "REPEAT WHILE count < 10", "    ADD 4 TO count", "END REPEAT", "DISPLAY count"],
      given: "No input.", q: "What is displayed?", opts: ["8", "10", "12"], a: 2,
      steps: [{ l: 1, vars: { count: "0" } }, { l: 2, check: "0 < 10 → True" }, { l: 3, vars: { count: "4" } }, { l: 2, check: "4 < 10 → True" }, { l: 3, vars: { count: "8" } }, { l: 2, check: "8 < 10 → True" }, { l: 3, vars: { count: "12" } }, { l: 2, check: "12 < 10 → False" }, { l: 5, out: "12" }],
      why: "The check happens before each trip round, not after every addition. At 8 the loop runs once more, so count ends at 12." },
    { ps: ["SET count TO 1", "REPEAT WHILE count <= 3", "    PRINT count", "    ADD 1 TO count", "END REPEAT"], given: "No input. <= includes the limit.", q: "What is printed?", opts: ["1, 2, 3", "1, 2", "0, 1, 2, 3"], a: 0, steps: [{ l: 1, vars: { count: "1" } }, { l: 2, check: "1 <= 3 → True" }, { l: 3, out: "1" }, { l: 4, vars: { count: "2" } }, { l: 2, check: "2 <= 3 → True" }, { l: 3, out: "2" }, { l: 4, vars: { count: "3" } }, { l: 2, check: "3 <= 3 → True" }, { l: 3, out: "3" }, { l: 4, vars: { count: "4" } }, { l: 2, check: "4 <= 3 → False" }], why: "<= 3 lets 3 through, and count starts at 1, so 0 is never printed." },
    { ps: ["SET count TO 10", "REPEAT WHILE count > 5", "    SUBTRACT 2 FROM count", "END REPEAT", "DISPLAY count"], given: "No input.", q: "What is displayed at the end?", opts: ["6", "4", "5"], a: 1, steps: [{ l: 1, vars: { count: "10" } }, { l: 2, check: "10 > 5 → True" }, { l: 3, vars: { count: "8" } }, { l: 2, check: "8 > 5 → True" }, { l: 3, vars: { count: "6" } }, { l: 2, check: "6 > 5 → True" }, { l: 3, vars: { count: "4" } }, { l: 2, check: "4 > 5 → False" }, { l: 5, out: "4" }], why: "count goes 10, 8, 6, 4. 6 > 5 is still True, so it drops once more to 4." },
    { ps: ["SET total TO 0", "SET n TO 2", "REPEAT WHILE n <= 6", "    ADD n TO total", "    ADD 2 TO n", "END REPEAT", "DISPLAY total"], given: "No input. Track both variables.", q: "What is displayed?", opts: ["6", "20", "12"], a: 2, steps: [{ l: 1, vars: { total: "0" } }, { l: 2, vars: { n: "2" } }, { l: 3, check: "2 <= 6 → True" }, { l: 4, vars: { total: "2" } }, { l: 5, vars: { n: "4" } }, { l: 3, check: "4 <= 6 → True" }, { l: 4, vars: { total: "6" } }, { l: 5, vars: { n: "6" } }, { l: 3, check: "6 <= 6 → True" }, { l: 4, vars: { total: "12" } }, { l: 5, vars: { n: "8" } }, { l: 3, check: "8 <= 6 → False" }, { l: 7, out: "12" }], why: "n is 2, 4 and 6, so total is 2 + 4 + 6 = 12." },
    { ps: ["SET count TO 0", "REPEAT WHILE count < 0", "    PRINT count", "    ADD 1 TO count", "END REPEAT", "PRINT \"Finished\""], given: "No input.", q: "What is printed?", opts: ["Finished", "0, Finished", "Nothing at all"], a: 0, steps: [{ l: 1, vars: { count: "0" } }, { l: 2, check: "0 < 0 → False" }, { l: 6, out: "Finished" }], why: "0 < 0 is False on the first check, so the loop body never runs. Only the line after the loop does." },
    { ps: ["SET score TO 0", "REPEAT WHILE score < 7", "    ADD 3 TO score", "END REPEAT", "DISPLAY score"], given: "No input.", q: "What is displayed?", opts: ["6", "9", "7"], a: 1, steps: [{ l: 1, vars: { score: "0" } }, { l: 2, check: "0 < 7 → True" }, { l: 3, vars: { score: "3" } }, { l: 2, check: "3 < 7 → True" }, { l: 3, vars: { score: "6" } }, { l: 2, check: "6 < 7 → True" }, { l: 3, vars: { score: "9" } }, { l: 2, check: "9 < 7 → False" }, { l: 5, out: "9" }], why: "score goes 0, 3, 6, 9. At 6 the check is still True, so it goes past 7 to 9." },
    { ps: ["SET count TO 3", "REPEAT WHILE count > 0", "    PRINT count", "    SUBTRACT 1 FROM count", "END REPEAT", "PRINT \"Go\""], given: "No input.", q: "What is printed?", opts: ["3, 2, 1, 0, Go", "2, 1, 0, Go", "3, 2, 1, Go"], a: 2, steps: [{ l: 1, vars: { count: "3" } }, { l: 2, check: "3 > 0 → True" }, { l: 3, out: "3" }, { l: 4, vars: { count: "2" } }, { l: 2, check: "2 > 0 → True" }, { l: 3, out: "2" }, { l: 4, vars: { count: "1" } }, { l: 2, check: "1 > 0 → True" }, { l: 3, out: "1" }, { l: 4, vars: { count: "0" } }, { l: 2, check: "0 > 0 → False" }, { l: 6, out: "Go" }], why: "count is printed before it goes down. 0 > 0 is False, so 0 is never printed." },
    { ps: ["SET loops TO 0", "SET count TO 0", "REPEAT WHILE count < 12", "    ADD 4 TO count", "    ADD 1 TO loops", "END REPEAT", "DISPLAY loops"], given: "No input. loops counts the trips round.", q: "What is displayed?", opts: ["3", "4", "12"], a: 0, steps: [{ l: 1, vars: { loops: "0" } }, { l: 2, vars: { count: "0" } }, { l: 3, check: "0 < 12 → True" }, { l: 4, vars: { count: "4" } }, { l: 5, vars: { loops: "1" } }, { l: 3, check: "4 < 12 → True" }, { l: 4, vars: { count: "8" } }, { l: 5, vars: { loops: "2" } }, { l: 3, check: "8 < 12 → True" }, { l: 4, vars: { count: "12" } }, { l: 5, vars: { loops: "3" } }, { l: 3, check: "12 < 12 → False" }, { l: 7, out: "3" }], why: "count goes 4, 8, 12, so the body runs 3 times and loops ends at 3." },
    { ps: ["SET count TO 0", "REPEAT WHILE count < 4", "    ADD 1 TO count", "    PRINT count", "END REPEAT"], given: "No input. Watch the order of the two lines in the loop.", q: "What is printed?", opts: ["0, 1, 2, 3", "1, 2, 3, 4", "1, 2, 3"], a: 1, steps: [{ l: 1, vars: { count: "0" } }, { l: 2, check: "0 < 4 → True" }, { l: 3, vars: { count: "1" } }, { l: 4, out: "1" }, { l: 2, check: "1 < 4 → True" }, { l: 3, vars: { count: "2" } }, { l: 4, out: "2" }, { l: 2, check: "2 < 4 → True" }, { l: 3, vars: { count: "3" } }, { l: 4, out: "3" }, { l: 2, check: "3 < 4 → True" }, { l: 3, vars: { count: "4" } }, { l: 4, out: "4" }, { l: 2, check: "4 < 4 → False" }], why: "The update comes before PRINT, so the first number printed is 1, and 4 is printed too." },
    { ps: ["SET n TO 1", "REPEAT WHILE n < 30", "    SET n TO n * 2", "END REPEAT", "DISPLAY n"], given: "No input.", q: "What is displayed?", opts: ["16", "30", "32"], a: 2, steps: [{ l: 1, vars: { n: "1" } }, { l: 2, check: "1 < 30 → True" }, { l: 3, vars: { n: "2" } }, { l: 2, check: "2 < 30 → True" }, { l: 3, vars: { n: "4" } }, { l: 2, check: "4 < 30 → True" }, { l: 3, vars: { n: "8" } }, { l: 2, check: "8 < 30 → True" }, { l: 3, vars: { n: "16" } }, { l: 2, check: "16 < 30 → True" }, { l: 3, vars: { n: "32" } }, { l: 2, check: "32 < 30 → False" }, { l: 5, out: "32" }], why: "n doubles: 1, 2, 4, 8, 16, 32. 16 < 30 is True, so it doubles once more." },
    { ps: ["SET a TO 3", "SET total TO 0", "REPEAT WHILE a > 0", "    ADD a TO total", "    SUBTRACT 1 FROM a", "END REPEAT", "DISPLAY total"], given: "No input. Track both variables.", q: "What is displayed?", opts: ["6", "5", "3"], a: 0, steps: [{ l: 1, vars: { a: "3" } }, { l: 2, vars: { total: "0" } }, { l: 3, check: "3 > 0 → True" }, { l: 4, vars: { total: "3" } }, { l: 5, vars: { a: "2" } }, { l: 3, check: "2 > 0 → True" }, { l: 4, vars: { total: "5" } }, { l: 5, vars: { a: "1" } }, { l: 3, check: "1 > 0 → True" }, { l: 4, vars: { total: "6" } }, { l: 5, vars: { a: "0" } }, { l: 3, check: "0 > 0 → False" }, { l: 7, out: "6" }], why: "total adds 3, then 2, then 1: 6. When a reaches 0 the loop stops." },
    { ps: ["SET count TO 2", "REPEAT WHILE count != 8", "    ADD 3 TO count", "END REPEAT", "DISPLAY count"], given: "No input.", q: "What is displayed?", opts: ["11", "8", "Nothing: it never stops"], a: 1, steps: [{ l: 1, vars: { count: "2" } }, { l: 2, check: "2 != 8 → True" }, { l: 3, vars: { count: "5" } }, { l: 2, check: "5 != 8 → True" }, { l: 3, vars: { count: "8" } }, { l: 2, check: "8 != 8 → False" }, { l: 5, out: "8" }], why: "count goes 2, 5, 8. It lands exactly on 8, so count != 8 becomes False." }
  ] },

  w6: { kind: "PseudoBug", data: [
    { goal: "Show 0 to 9, then stop.", symptom: "It shows 0, -1, -2, -3 … and never stops.",
      ps: ["SET count TO 0", "REPEAT WHILE count < 10", "    SHOW count", "    SUBTRACT 1 FROM count", "END REPEAT"],
      bug: "    SUBTRACT 1 FROM count", fixes: ["    ADD 1 TO count", "    SET count TO 1", "    SUBTRACT 2 FROM count"], why: "The update has to move count towards the point where the condition becomes False." },
    { goal: "Show 1 to 10.", symptom: "It stops at 9.",
      ps: ["SET count TO 1", "REPEAT WHILE count < 10", "    SHOW count", "    ADD 1 TO count", "END REPEAT"],
      bug: "REPEAT WHILE count < 10", fixes: ["REPEAT WHILE count <= 10", "REPEAT WHILE count < 9", "REPEAT WHILE count > 10"], why: "< 10 leaves out 10. <= 10 includes it." },
    { goal: "Count down 5, 4, 3, 2, 1, then show HAPPY.", symptom: "It shows 5 forever. HAPPY never appears.",
      ps: ["SET count TO 5", "REPEAT WHILE count > 0", "    SHOW count", "    SET count TO 5", "END REPEAT", "SHOW HAPPY"],
      bug: "    SET count TO 5", fixes: ["    SUBTRACT 1 FROM count", "    ADD 1 TO count", "    SET count TO 0"], why: "SET count TO 5 puts it back every time. The update has to take 1 away." },
    { goal: "Wait until button A is pressed, then scroll Go.", symptom: "Go scrolls straight away, before anyone touches A.",
      ps: ["REPEAT WHILE button A is pressed", "    SHOW an arrow", "END REPEAT", 'SCROLL "Go"'],
      bug: "REPEAT WHILE button A is pressed", fixes: ["REPEAT WHILE button A is not pressed", "REPEAT WHILE button B is pressed", "REPEAT FOREVER"], why: "We want to keep waiting while A is not pressed. As soon as it is, the loop ends." },
    { goal: "Count in 2s: 0, 2, 4 … 18.", symptom: "It shows every number: 0, 1, 2, 3 …",
      ps: ["SET count TO 0", "REPEAT WHILE count < 20", "    SHOW count", "    ADD 1 TO count", "END REPEAT"],
      bug: "    ADD 1 TO count", fixes: ["    ADD 2 TO count", "    ADD 20 TO count", "    SET count TO 2"], why: "Counting in 2s means the update adds 2 each time." },
    { goal: "Show 1 to 5.", symptom: "It shows 0, 1, 2, 3, 4, 5.", ps: ["SET count TO 0", "REPEAT WHILE count <= 5", "    SHOW count", "    ADD 1 TO count", "END REPEAT"], bug: "SET count TO 0", fixes: ["SET count TO 1", "SET count TO 5", "SET count TO -1"], why: "The loop starts from whatever count is set to. Starting at 1 leaves out 0." },
    { goal: "Count down 3, 2, 1, then scroll Go.", symptom: "It shows 3, 2, 1, 0, then scrolls Go.", ps: ["SET count TO 3", "REPEAT WHILE count >= 0", "    SHOW count", "    SUBTRACT 1 FROM count", "END REPEAT", "SCROLL \"Go\""], bug: "REPEAT WHILE count >= 0", fixes: ["REPEAT WHILE count > 0", "REPEAT WHILE count < 0", "REPEAT WHILE count != 3"], why: ">= 0 lets 0 through. > 0 stops as soon as count reaches 0." },
    { goal: "Flash the heart until button A is pressed.", symptom: "The heart keeps flashing, even after A is pressed.", ps: ["REPEAT FOREVER", "    SHOW HEART", "    WAIT 200 ms", "    CLEAR the screen", "    WAIT 200 ms", "END REPEAT"], bug: "REPEAT FOREVER", fixes: ["REPEAT WHILE button A is not pressed", "REPEAT WHILE button A is pressed", "REPEAT 5 TIMES"], why: "REPEAT FOREVER never checks the button. A while condition gives the loop a way to end." },
    { goal: "Add up 1 to 5 and display 15.", symptom: "It displays 10.", ps: ["SET total TO 0", "SET n TO 1", "REPEAT WHILE n < 5", "    ADD n TO total", "    ADD 1 TO n", "END REPEAT", "DISPLAY total"], bug: "REPEAT WHILE n < 5", fixes: ["REPEAT WHILE n <= 5", "REPEAT WHILE n < 4", "REPEAT WHILE n <= 4"], why: "< 5 stops before 5 is added. <= 5 includes it: 1 + 2 + 3 + 4 + 5 = 15." },
    { goal: "Show 0, 5, 10, 15, 20, then stop.", symptom: "It shows 0, 5, 10, 15, 20, 25 … and never stops.", ps: ["SET count TO 0", "REPEAT WHILE count != 22", "    SHOW count", "    ADD 5 TO count", "END REPEAT"], bug: "REPEAT WHILE count != 22", fixes: ["REPEAT WHILE count <= 20", "REPEAT WHILE count != 21", "REPEAT WHILE count == 20"], why: "count never lands on 22, so != 22 is always True. <= 20 stops as soon as count goes past 20." },
    { goal: "Keep showing the temperature while it's below 30, then scroll Hot.", symptom: "Hot scrolls straight away, even when it's 20 degrees.", ps: ["SET temp TO the temperature", "REPEAT WHILE temp > 30", "    SHOW temp", "    SET temp TO the temperature", "END REPEAT", "SCROLL \"Hot\""], bug: "REPEAT WHILE temp > 30", fixes: ["REPEAT WHILE temp < 30", "REPEAT WHILE temp == 30", "REPEAT WHILE temp > 20"], why: "The loop should keep going while it's still cool: temp < 30." },
    { goal: "Count down from 10 in 2s: 10, 8, 6, 4, 2.", symptom: "It shows 10, 9, 8, 7 … 1.", ps: ["SET count TO 10", "REPEAT WHILE count > 0", "    SHOW count", "    SUBTRACT 1 FROM count", "END REPEAT"], bug: "    SUBTRACT 1 FROM count", fixes: ["    SUBTRACT 2 FROM count", "    ADD 2 TO count", "    SUBTRACT 10 FROM count"], why: "Counting down in 2s means taking 2 away each time." },
    { goal: "Show the lives left (3, 2, 1), then scroll Game over.", symptom: "It scrolls Game over straight away.", ps: ["SET lives TO 0", "REPEAT WHILE lives > 0", "    SHOW lives", "    SUBTRACT 1 FROM lives", "END REPEAT", "SCROLL \"Game over\""], bug: "SET lives TO 0", fixes: ["SET lives TO 3", "SET lives TO -3", "SET lives TO 1"], why: "lives starts at 0, so lives > 0 is False straight away and the loop is skipped." },
    { goal: "Start at 1, keep doubling until score is at least 100, then display it (128).", symptom: "It never stops, and score stays at 0.", ps: ["SET score TO 0", "REPEAT WHILE score < 100", "    SET score TO score * 2", "END REPEAT", "DISPLAY score"], bug: "SET score TO 0", fixes: ["SET score TO 1", "SET score TO 100", "SET score TO 0 * 2"], why: "0 doubled is still 0. Starting at 1 gives 1, 2, 4 … 64, 128." },
    { goal: "Print 1, 2, 3, then Done.", symptom: "It prints 1, 2, 3, 4, Done.", ps: ["SET count TO 1", "REPEAT WHILE count < 5", "    PRINT count", "    ADD 1 TO count", "END REPEAT", "PRINT \"Done\""], bug: "REPEAT WHILE count < 5", fixes: ["REPEAT WHILE count < 4", "REPEAT WHILE count <= 4", "REPEAT WHILE count < 3"], why: "< 4 lets 3 through and stops before 4." }
  ] },

  w7: { kind: "Quiz", data: [
    { code: "count = 0\nMAX_COUNT = 10\nwhile count < MAX_COUNT:\n    display.show(count)\n    count = count + 1", ask: "How many times does this loop run?", opts: ["9", "10", "11"], a: 1, why: "count takes the values 0 to 9: that's 10 times." },
    { code: "count = 0\nwhile count <= 20:\n    print(count)\n    count = count + 1", ask: "How many times does this loop run?", opts: ["20", "19", "21"], a: 2, why: "0 to 20 inclusive is 21 values." },
    { code: "count = 0\nwhile count == 20:\n    print(count)\n    count = count + 1", ask: "How many times does this loop run?", opts: ["0 times", "1 time", "20 times"], a: 0, why: "count == 20 is False straight away, so the body never runs." },
    { code: "", ask: "What are the three key parts of a while loop?", opts: ["Start, stop, pause", "Track, check, update", "if, elif, else"], a: 1, why: "Track a variable, check it in the condition, and update it inside the loop." },
    { code: "count = 5\nwhile count > 0:\n    count = count - 1\nprint(count)", ask: "What is printed?", opts: ["1", "0", "-1"], a: 1, why: "The loop stops when count > 0 is False, which first happens at 0." },
    { code: "count = 0\nwhile count < 10:\n    print(count)", ask: "Why does this loop never stop?", opts: ["count never changes", "10 is too big", "print() can't be used in a loop"], a: 0, why: "There's no update, so count < 10 is always True." },
    { code: "", ask: "Which line keeps looping until button A is pressed?", opts: ["while button_a.is_pressed():", "while not button_a.is_pressed():", "while button_a:"], a: 1, why: "not flips the condition: keep going while A is NOT pressed." },
    { code: "count = 1\nwhile count < 100:\n    count = count * 2\nprint(count)", ask: "What is printed?", opts: ["64", "100", "128"], a: 2, why: "count doubles: 1, 2, 4 … 64, 128. 64 < 100 is True, so it doubles once more to 128." },
    { code: "count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1", ask: "What is the last number printed?", opts: ["0", "1", "3"], a: 1, why: "count is printed as 3, 2, 1. When it reaches 0 the loop stops before printing." },
    { code: "", ask: "When does a while loop check its condition?", opts: ["Only once, at the start", "Before every trip round the loop", "Only after the loop ends"], a: 1, why: "Python checks the condition each time, before it runs the body." },
    { code: "count = 0\nwhile count < 6:\n    count = count + 2\nprint(count)", ask: "What is printed?", opts: ["8", "4", "6"], a: 2, why: "count goes 0, 2, 4, 6. 6 < 6 is False, so the loop stops and 6 is printed." },
    { code: "", ask: "Which of these loops runs for ever?", opts: ["while True:", "while False:", "while 1 > 2:"], a: 0, why: "True is always True, so the loop never ends by itself. The other two never run at all." },
    { code: "x = 10\nwhile x > 3:\n    x = x - 4\nprint(x)", ask: "What is printed?", opts: ["2", "3", "6"], a: 0, why: "x goes 10, 6, 2. 6 > 3 is True, so it drops once more to 2." },
    { code: "", ask: "What does the update line in a while loop do?", opts: ["Changes the tracked variable", "Checks the condition", "Ends the program"], a: 0, why: "The update moves the variable towards the point where the condition becomes False." },
    { code: "count = 0\nwhile count < 3:\n    print(\"Hi\")\n    count += 1", ask: "How many times is Hi printed?", opts: ["2", "3", "4"], a: 1, why: "count += 1 adds 1, just like count = count + 1. count is 0, 1, 2: three times." }
  ] },

  w8: { kind: "BugHunt", data: [
    { goal: "Show 0 to 9, then stop.", symptom: "Shows 0, then negative numbers forever",
      lines: ["from microbit import *", "", "count = 0", "while count < 10:", "    display.show(count)", "    count = count - 1"],
      bug: "    count = count - 1", fixes: ["    count = count + 1", "    count = count - 2", "    count == count + 1"], why: "The update has to move count up towards 10. count == count + 1 only compares; it doesn't change count.", out: ["0", "1", "2"] },
    { goal: "Print 0 to 4.", symptom: "  File \"main.py\", line 4\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "count = 0", "while count < 5", "    print(count)", "    count = count + 1"],
      bug: "while count < 5", fixes: ["while count < 5:", "while (count < 5)", "while count < 5;"], why: "A while line ends with a colon, just like if.", out: [] },
    { goal: "Show 1 to 10.", symptom: "It stops at 9",
      lines: ["from microbit import *", "", "count = 1", "while count < 10:", "    display.scroll(count)", "    count = count + 1"],
      bug: "while count < 10:", fixes: ["while count <= 10:", "while count < 9:", "while count > 10:"], why: "< 10 leaves out 10. <= 10 includes it.", out: ["10"] },
    { goal: "Print 0, 1, 2.", symptom: "Prints 0 forever",
      lines: ["from microbit import *", "", "count = 0", "while count < 3:", "    print(count)", "count = count + 1"],
      bug: "count = count + 1", fixes: ["    count = count + 1", "count = count + 2", "        count = count + 1"], why: "The update isn't indented, so it's outside the loop and never runs while the loop is going.", out: [] },
    { goal: "Print 0 to 9: keep looping while count is below 10.", symptom: "  File \"main.py\", line 4\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "count = 0", "while count = 10:", "    print(count)", "    count = count + 1"],
      bug: "while count = 10:", fixes: ["while count < 10:", "while count == 10:", "while count => 10:"], why: "= assigns. A condition needs a comparison, and \"below 10\" is < 10.", out: [] },
    { goal: "Print 0 to 4.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nNameError: name 'counter' isn't defined",
      lines: ["from microbit import *", "", "count = 0", "while counter < 5:", "    print(count)", "    count = count + 1"],
      bug: "while counter < 5:", fixes: ["while count < 5:", "while counter == 5:", 'while "count" < 5:'], why: "The condition must use the same variable that's being tracked and updated.", out: [] },
    { goal: "Wait until A is pressed, then show YES.", symptom: "YES shows straight away, without pressing A",
      lines: ["from microbit import *", "", "while button_a.is_pressed():", "    sleep(100)", "display.show(Image.YES)"],
      bug: "while button_a.is_pressed():", fixes: ["while not button_a.is_pressed():", "while button_b.is_pressed():", "if not button_a.is_pressed():"], why: "Keep waiting while A is NOT pressed. An if would only check once and then carry on.", out: [{ img: "YES", ms: 1200 }] },
    { goal: "Count down from 10 in 3s: 10, 7, 4, 1.", symptom: "Prints 10, 7, 4, 1, -2, -5 … and never stops",
      lines: ["from microbit import *", "", "count = 10", "while count != 0:", "    print(count)", "    count = count - 3"],
      bug: "while count != 0:", fixes: ["while count > 0:", "while count != 1:", "while count == 0:"], why: "count jumps from 1 to -2, so it's never exactly 0. > 0 stops it as soon as it drops below 1.", out: [] },
    { goal: "Show 5, 4, 3, 2, 1.", symptom: "Shows 5 forever", lines: ["from microbit import *", "", "count = 5", "while count > 0:", "    display.show(count)", "    sleep(300)", "    count = count"], bug: "    count = count", fixes: ["    count = count - 1", "    count = count + 1", "    count == count - 1"], why: "count = count changes nothing, so count is always 5. == only compares; it doesn't change count.", out: ["5", "4", "3", "2", "1"] },
    { goal: "Scroll the total of 1 + 2 + 3 (6).", symptom: "Scrolls 3", lines: ["from microbit import *", "", "total = 0", "n = 1", "while n <= 3:", "    total = total + 1", "    n = n + 1", "display.scroll(total)"], bug: "    total = total + 1", fixes: ["    total = total + n", "    total = n", "    total = total + 3"], why: "Add n, not 1. Adding 1 just counts the trips round the loop.", out: ["6"] },
    { goal: "Print 0, 2, 4, 6, 8.", symptom: "Prints every number from 0 to 9", lines: ["from microbit import *", "", "count = 0", "while count < 10:", "    print(count)", "    count = count + 1"], bug: "    count = count + 1", fixes: ["    count = count + 2", "    count = count * 2", "    count = count + 3"], why: "Counting in 2s means the update adds 2 each time.", out: [] },
    { goal: "Wait until B is pressed, then show HAPPY.", symptom: "  File \"main.py\", line 3\nSyntaxError: invalid syntax", lines: ["from microbit import *", "", "while not button_b.is_pressed()", "    sleep(100)", "display.show(Image.HAPPY)"], bug: "while not button_b.is_pressed()", fixes: ["while not button_b.is_pressed():", "while not button_b.is_pressed();", "while not (button_b.is_pressed())"], why: "Every while line needs a colon at the end.", out: [{ img: "HAPPY", ms: 1200 }] },
    { goal: "Print 10, 20, 30.", symptom: "  File \"main.py\", line 6\nIndentationError: unexpected indent", lines: ["from microbit import *", "", "count = 10", "while count <= 30:", "    print(count)", "        count = count + 10"], bug: "        count = count + 10", fixes: ["    count = count + 10", "count = count + 10", "        count = count + 1"], why: "Every line in the loop body needs the same indent: 4 spaces.", out: [] },
    { goal: "Count up while count is less than 5: print 0 to 4.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nTypeError: unsupported types for __lt__: 'str', 'int'", lines: ["from microbit import *", "", "count = \"0\"", "while count < 5:", "    print(count)", "    count = count + 1"], bug: "count = \"0\"", fixes: ["count = 0", "count = \"5\"", "count = '0'"], why: "\"0\" in quotes is a string, and a string can't be compared with a number. Take the quotes off.", out: [] },
    { goal: "Show the heart 3 times.", symptom: "Shows the heart 4 times", lines: ["from microbit import *", "", "times = 0", "while times <= 3:", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)", "    times = times + 1"], bug: "while times <= 3:", fixes: ["while times < 3:", "while times <= 4:", "while times > 3:"], why: "<= 3 runs for 0, 1, 2 and 3: four hearts. < 3 gives three.", out: [{ img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }] }
  ] },

  // FOR LOOPS
  r1: { kind: "RangeExplorer", data: [
    { label: "0, 1, 2, 3, 4", vals: [0, 1, 2, 3, 4], why: "range(5) starts at 0 and stops before 5." },
    { label: "1, 2, 3, 4, 5", vals: [1, 2, 3, 4, 5], why: "The stop number is never included, so it has to be 6." },
    { label: "0, 2, 4, 6, 8", vals: [0, 2, 4, 6, 8], why: "The third number is the step." },
    { label: "5, 10, 15, 20", vals: [5, 10, 15, 20], why: "To include 20, the stop has to be past it." },
    { label: "10, 9, 8 … 1 (a countdown)", vals: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], why: "A negative step counts down, and the stop (0) is still left out." },
    { label: "3, 2, 1, 0", vals: [3, 2, 1, 0], why: "To include 0 when counting down, stop at -1." },
    { label: "0, 3, 6, 9", vals: [0, 3, 6, 9], why: "Steps of 3. Any stop from 10 to 12 works." },
    { label: "2, 4, 6, 8, 10", vals: [2, 4, 6, 8, 10], why: "Start at 2 and stop past 10." },
    { label: "1, 3, 5, 7, 9 (the odd numbers)", vals: [1, 3, 5, 7, 9], why: "Start at 1 and step 2 to stay on the odd numbers." },
    { label: "0, 10, 20, 30", vals: [0, 10, 20, 30], why: "Steps of 10. The stop has to be past 30." },
    { label: "7 (just one number)", vals: [7], why: "A range can hold a single number: start at 7, stop at 8." },
    { label: "100, 75, 50, 25", vals: [100, 75, 50, 25], why: "Count down in 25s. The stop, 0, is left out." },
    { label: "-3, -2, -1, 0", vals: [-3, -2, -1, 0], why: "Ranges can start below 0. To include 0, stop at 1." },
    { label: "6, 4, 2", vals: [6, 4, 2], why: "A negative step of 2 counts down in 2s." },
    { label: "1, 4, 7, 10", vals: [1, 4, 7, 10], why: "Steps of 3 from 1. Any stop from 11 to 13 works." }
  ] },

  r2: { kind: "Predict", data: [
    { lines: ["for i in range(5):", "    print(i)"], opts: ["0 1 2 3 4", "1 2 3 4 5", "0 1 2 3 4 5"], a: 0, why: "range(5) gives five numbers, starting at 0." },
    { lines: ["for i in range(1, 6):", "    print(i)"], opts: ["0 1 2 3 4 5", "1 2 3 4 5", "1 2 3 4 5 6"], a: 1, why: "It starts at 1 and stops before 6." },
    { lines: ["for i in range(0, 10, 2):", "    print(i)"], opts: ["0 2 4 6 8", "2 4 6 8 10", "0 2 4 6 8 10"], a: 0, why: "Steps of 2 from 0, stopping before 10." },
    { lines: ["for i in range(3):", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)"], q: "How many times does the heart flash?", opts: ["2", "3", "4"], a: 1, why: "range(3) gives 0, 1, 2: three trips round the loop." },
    { lines: ["total = 0", "for n in range(1, 5):", "    total = total + n", "print(total)"], opts: ["4", "15", "10"], a: 2, why: "n is 1, 2, 3, 4, and 1 + 2 + 3 + 4 = 10. print is after the loop, so it runs once." },
    { lines: ["for i in range(10, 0, -3):", "    print(i)"], opts: ["10 7 4 1", "10 7 4 1 -2", "10 7 4"], a: 0, why: "Counting down in 3s from 10: the next value, -2, is past the stop of 0." },
    { lines: ["for i in range(6):", "    if i % 2 == 0:", "        print(i)"], opts: ["1 3 5", "0 2 4", "0 2 4 6"], a: 1, why: "The if lets only the even numbers through. 6 isn't in range(6)." },
    { lines: ["for i in range(10):", "    if i == 3:", "        break", "    print(i)"], opts: ["0 1 2", "0 1 2 3", "3"], a: 0, why: "break leaves the loop as soon as i is 3, before it's printed." },
    { lines: ["for i in range(2, 5):", "    print(i)"], opts: ["2 3 4 5", "2 3 4", "3 4 5"], a: 1, why: "It starts at 2 and stops before 5." },
    { lines: ["for i in range(3):", "    print(i * 10)"], opts: ["10 20 30", "0 10 20 30", "0 10 20"], a: 2, why: "i is 0, 1, 2, and each one is multiplied by 10." },
    { lines: ["for i in range(5, 0, -1):", "    print(i)"], opts: ["5 4 3 2 1", "5 4 3 2 1 0", "4 3 2 1 0"], a: 0, why: "A step of -1 counts down, and the stop (0) is left out." },
    { lines: ["total = 0", "for i in range(4):", "    total = total + 2", "print(total)"], opts: ["6", "8", "4"], a: 1, why: "2 is added on each of the 4 trips round the loop: 8." },
    { lines: ["count = 0", "for i in range(10):", "    if i % 3 == 0:", "        count = count + 1", "print(count)"], opts: ["3", "10", "4"], a: 2, why: "i % 3 == 0 is True for 0, 3, 6 and 9: 4 numbers." },
    { lines: ["for i in range(0, 20, 5):", "    print(i)"], opts: ["0 5 10 15", "5 10 15 20", "0 5 10 15 20"], a: 0, why: "Steps of 5 from 0, stopping before 20." },
    { lines: ["for i in range(3):", "    print(\"Hi\")", "print(\"Bye\")"], opts: ["Hi Bye Hi Bye Hi Bye", "Hi Hi Hi Bye", "Hi Hi Bye"], a: 1, why: "print(\"Bye\") isn't indented, so it runs once, after the loop." }
  ] },

  r10: { kind: "HowMany", data: [
    { lines: ["for i in range(6):", "    print(i)"], answer: 6, why: "range(6) gives 0 to 5: six numbers." },
    { lines: ["for i in range(2, 7):", "    print(i)"], answer: 5, why: "2, 3, 4, 5, 6: five numbers. The stop, 7, is left out." },
    { lines: ["for i in range(0, 10, 2):", "    print(i)"], answer: 5, why: "0, 2, 4, 6, 8: five numbers." },
    { lines: ["for i in range(1, 10, 3):", "    print(i)"], answer: 3, why: "1, 4, 7. The next one, 10, is the stop, so it's left out." },
    { lines: ["for i in range(10, 0, -1):", "    print(i)"], answer: 10, why: "Counting down from 10 to 1 is ten numbers." },
    { lines: ["for i in range(5, 0):", "    print(i)"], answer: 0, why: "Counting down needs a negative step. range(5, 0) is empty, so the body never runs." },
    { lines: ["for i in range(3, 4):", "    print(i)"], answer: 1, why: "range(3, 4) is just 3: one number." },
    { lines: ["for i in range(0, 100, 25):", "    print(i)"], answer: 4, why: "0, 25, 50, 75. 100 is the stop, so it's left out." },
    { lines: ["for i in range(-2, 3):", "    print(i)"], answer: 5, why: "-2, -1, 0, 1, 2: five numbers." },
    { lines: ["for i in range(20, 0, -5):", "    print(i)"], answer: 4, why: "20, 15, 10, 5: four numbers. 0 is the stop." },
    { lines: ["for i in range(7):", "    display.show(Image.HEART)", "    sleep(100)", "    display.clear()", "    sleep(100)"], answer: 7, why: "range(7) repeats 7 times. i isn't used, but it still counts the trips." },
    { lines: ["for n in range(1, 13):", "    print(n * 7)"], answer: 12, why: "1 to 12 is twelve numbers: a full times table." },
    { lines: ["for i in range(0, 9, 3):", "    print(i)"], answer: 3, why: "0, 3, 6. 9 is the stop, so it's left out." },
    { lines: ["for i in range(4, -1, -1):", "    print(i)"], answer: 5, why: "4, 3, 2, 1, 0: five numbers. Stopping at -1 includes 0." },
    { lines: ["for i in range(0, 5, 10):", "    print(i)"], answer: 1, why: "The first number, 0, is fine, but the next one, 10, is past the stop: just once." }
  ] },

  r3: { kind: "CodeMatch", data: [
    { src: ["count = 0", "while count < 10:", "    display.show(count)", "    count = count + 1"], a: 0,
      options: [["for count in range(10):", "    display.show(count)"], ["for count in range(1, 10):", "    display.show(count)"], ["for count in range(11):", "    display.show(count)"]],
      hints: [null, "This starts at 1, but the while loop starts at 0.", "range(11) includes 10. The while loop stops before 10."], why: "Same numbers, 0 to 9. No count = 0 and no update line needed." },
    { src: ["count = 1", "while count <= 5:", "    print(count)", "    count = count + 1"], a: 2,
      options: [["for count in range(5):", "    print(count)"], ["for count in range(1, 5):", "    print(count)"], ["for count in range(1, 6):", "    print(count)"]],
      hints: ["range(5) is 0 to 4.", "range(1, 5) stops before 5, but <= 5 includes 5."], why: "<= 5 includes 5, so the stop is 6." },
    { src: ["count = 0", "while count < 20:", "    print(count)", "    count = count + 2"], a: 1,
      options: [["for count in range(2, 20, 2):", "    print(count)"], ["for count in range(0, 20, 2):", "    print(count)"], ["for count in range(0, 21, 2):", "    print(count)"]],
      hints: ["This starts at 2, so 0 is missing.", null, "range(0, 21, 2) includes 20, but the while loop stops before 20."], why: "Start 0, stop before 20, step 2." },
    { src: ["count = 10", "while count > 0:", "    print(count)", "    count = count - 1"], a: 2,
      options: [["for count in range(10, 0):", "    print(count)"], ["for count in range(10, -1, -1):", "    print(count)"], ["for count in range(10, 0, -1):", "    print(count)"]],
      hints: ["Without a negative step, range(10, 0) is empty. It can't count down.", "Stopping at -1 includes 0, but count > 0 stops before 0."], why: "Counting down needs a step of -1. It stops before 0." },
    { src: ["times = 0", "while times < 5:", "    display.show(Image.HEART)", "    sleep(200)", "    display.clear()", "    sleep(200)", "    times = times + 1"], a: 0,
      options: [["for times in range(5):", "    display.show(Image.HEART)", "    sleep(200)", "    display.clear()", "    sleep(200)"],
        ["for times in range(4):", "    display.show(Image.HEART)", "    sleep(200)", "    display.clear()", "    sleep(200)"],
        ["for times in range(5, 0):", "    display.show(Image.HEART)", "    sleep(200)", "    display.clear()", "    sleep(200)"]],
      hints: [null, "range(4) only flashes 4 times.", "range(5, 0) is empty, so the heart never flashes."], why: "\"Flash 5 times\" is a known number of repeats, which is perfect for range(5)." },
    { src: ["count = 0", "while count < 3:", "    print(\"Hi\")", "    count = count + 1"], a: 0, options: [["for count in range(3):", "    print(\"Hi\")"], ["for count in range(1, 3):", "    print(\"Hi\")"], ["for count in range(4):", "    print(\"Hi\")"]], hints: [null, "range(1, 3) is only 2 numbers, so Hi prints twice.", "range(4) runs 4 times, one too many."], why: "count is 0, 1, 2 in both: three times round." },
    { src: ["count = 2", "while count < 8:", "    print(count)", "    count = count + 2"], a: 1, options: [["for count in range(0, 8, 2):", "    print(count)"], ["for count in range(2, 8, 2):", "    print(count)"], ["for count in range(2, 9, 2):", "    print(count)"]], hints: ["This starts at 0, but the while loop starts at 2.", null, "range(2, 9, 2) includes 8. The while loop stops before 8."], why: "Start 2, stop before 8, step 2: 2, 4, 6." },
    { src: ["count = 5", "while count >= 1:", "    print(count)", "    count = count - 1"], a: 2, options: [["for count in range(5, 1, -1):", "    print(count)"], ["for count in range(1, 6):", "    print(count)"], ["for count in range(5, 0, -1):", "    print(count)"]], hints: ["Stopping at 1 leaves out 1, but >= 1 includes it.", "These are the right numbers in the wrong order.", null], why: ">= 1 includes 1, so the stop is 0, and counting down needs a step of -1." },
    { src: ["count = 0", "while count <= 10:", "    print(count)", "    count = count + 5"], a: 0, options: [["for count in range(0, 11, 5):", "    print(count)"], ["for count in range(0, 10, 5):", "    print(count)"], ["for count in range(5, 11, 5):", "    print(count)"]], hints: [null, "range(0, 10, 5) stops before 10, but <= 10 includes it.", "This starts at 5, so 0 is missing."], why: "0, 5, 10: <= 10 includes 10, so the stop is 11." },
    { src: ["total = 0", "n = 1", "while n <= 3:", "    total = total + n", "    n = n + 1", "print(total)"], a: 1, options: [["total = 0", "for n in range(3):", "    total = total + n", "print(total)"], ["total = 0", "for n in range(1, 4):", "    total = total + n", "print(total)"], ["total = 0", "for n in range(1, 3):", "    total = total + n", "print(total)"]], hints: ["range(3) is 0, 1, 2, so the total is 3, not 6.", null, "range(1, 3) leaves out 3."], why: "n is 1, 2, 3 in both, so both print 6. n = 1 and n = n + 1 are no longer needed." },
    { src: ["count = 10", "while count > 0:", "    print(count)", "    count = count - 2"], a: 2, options: [["for count in range(10, -1, -2):", "    print(count)"], ["for count in range(0, 10, 2):", "    print(count)"], ["for count in range(10, 0, -2):", "    print(count)"]], hints: ["Stopping at -1 includes 0, but count > 0 stops before 0.", "These count up, not down.", null], why: "10, 8, 6, 4, 2: start 10, stop before 0, step -2." },
    { src: ["i = 1", "while i < 6:", "    display.show(i)", "    sleep(200)", "    i = i + 1"], a: 0, options: [["for i in range(1, 6):", "    display.show(i)", "    sleep(200)"], ["for i in range(6):", "    display.show(i)", "    sleep(200)"], ["for i in range(1, 5):", "    display.show(i)", "    sleep(200)"]], hints: [null, "range(6) starts at 0, but the while loop starts at 1.", "range(1, 5) stops before 5, but < 6 includes 5."], why: "1 to 5 in both: start 1, stop 6." },
    { src: ["count = 3", "while count < 6:", "    print(count)", "    count = count + 1"], a: 2, options: [["for count in range(6):", "    print(count)"], ["for count in range(3, 7):", "    print(count)"], ["for count in range(3, 6):", "    print(count)"]], hints: ["range(6) starts at 0, not 3.", "range(3, 7) includes 6."], why: "3, 4, 5: start 3, stop before 6." },
    { src: ["x = 0", "while x < 15:", "    print(x)", "    x = x + 3"], a: 1, options: [["for x in range(3, 15, 3):", "    print(x)"], ["for x in range(0, 15, 3):", "    print(x)"], ["for x in range(0, 15):", "    print(x)"]], hints: ["This starts at 3, so 0 is missing.", null, "Without a step of 3 this prints every number."], why: "0, 3, 6, 9, 12: start 0, stop before 15, step 3." },
    { src: ["count = 1", "while count <= 4:", "    print(count)", "    count = count + 1"], a: 0, options: [["for count in range(1, 5):", "    print(count)"], ["for count in range(4):", "    print(count)"], ["for count in range(1, 4):", "    print(count)"]], hints: [null, "range(4) is 0 to 3.", "range(1, 4) stops before 4, but <= 4 includes it."], why: "1 to 4: <= 4 includes 4, so the stop is 5." }
  ] },

  r4: { kind: "Quiz", data: [
    { code: "", ask: "Flash a heart exactly 5 times.", opts: ["for loop", "while loop"], a: 0, why: "You know it's 5 times, so use for i in range(5)." },
    { code: "", ask: "Wait until button A is pressed.", opts: ["for loop", "while loop"], a: 1, why: "You don't know how long the user will take. Keep going while A is not pressed." },
    { code: "", ask: "Scroll every number from 1 to 20.", opts: ["for loop", "while loop"], a: 0, why: "A fixed set of numbers: for n in range(1, 21)." },
    { code: "", ask: "Keep beeping while the room is dark.", opts: ["for loop", "while loop"], a: 1, why: "It depends on a sensor, not a count. Repeat while the condition is True." },
    { code: "", ask: "Play a note 3 times.", opts: ["for loop", "while loop"], a: 0, why: "A known number of repeats: for i in range(3)." },
    { code: "", ask: "Keep asking for a password until the right one is typed.", opts: ["for loop", "while loop"], a: 1, why: "Nobody knows how many tries it will take. Loop while the answer is wrong." },
    { code: "", ask: "Show each of the four arrows once: N, E, S, W.", opts: ["for loop", "while loop"], a: 0, why: "There are exactly four things to go through." },
    { code: "", ask: "Keep reading the temperature until it goes above 30.", opts: ["for loop", "while loop"], a: 1, why: "You can't know in advance when it will get hot." },
    { code: "", ask: "Show a 5, 4, 3, 2, 1 countdown.", opts: ["for loop", "while loop"], a: 0, why: "Exactly 5 numbers: for n in range(5, 0, -1)." },
    { code: "", ask: "Keep showing a smiley until the micro:bit is shaken.", opts: ["for loop", "while loop"], a: 1, why: "Nobody knows when it will be shaken, so repeat while it hasn't been." },
    { code: "", ask: "Add up all the numbers from 1 to 100.", opts: ["for loop", "while loop"], a: 0, why: "A fixed set of numbers: for n in range(1, 101)." },
    { code: "", ask: "Keep playing music while button B is held down.", opts: ["for loop", "while loop"], a: 1, why: "It depends on the button, not on a count." },
    { code: "", ask: "Light the 5 LEDs in the top row, one after another.", opts: ["for loop", "while loop"], a: 0, why: "There are exactly 5 LEDs: for x in range(5)." },
    { code: "", ask: "Keep counting presses of A until someone presses B.", opts: ["for loop", "while loop"], a: 1, why: "You can't know how many presses there will be before B." },
    { code: "", ask: "Print the 7 times table, from 7 × 1 to 7 × 12.", opts: ["for loop", "while loop"], a: 0, why: "12 lines, known in advance: for n in range(1, 13)." }
  ] },

  r5: { kind: "FlowTrace", data: [
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(3)?")), P_("i = next number"), IO_("Show HEART", { img: "HEART" }), IO_("Clear screen", { clear: true })], post: [IO_('Scroll "Done"', { scroll: "Done" })] },
      situation: "for i in range(3): flash the heart", visits: [{ q: "Nothing used yet: 0, 1 and 2 are left. Any numbers left?", a: true }, { q: "i was 0. 1 and 2 are left. Any numbers left?", a: true }, { q: "i was 1. Only 2 is left. Any numbers left?", a: true }, { q: "i was 2. All three numbers are used. Any numbers left?", a: false }],
      why: "A for loop handles the tracking and updating for you: it hands out the next number until range(3) runs out." },
    { chart: { loop: true, loopLabel: "for: next number", pre: [P_("total = 0")], body: [W_(D_("Numbers left in\nrange(1, 4)?")), P_("n = next number"), P_("total = total + n")], post: [IO_("Show total")] },
      situation: "Add up 1, 2 and 3", visits: [{ q: "1, 2 and 3 are left. Any numbers left?", a: true }, { q: "n was 1, total is 1. Any numbers left?", a: true }, { q: "n was 2, total is 3. Any numbers left?", a: true }, { q: "n was 3, total is 6. Any numbers left?", a: false }],
      why: "range(1, 4) gives 1, 2 and 3, so the total is 6." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(4)?")), P_("i = next number"), CH_([[D_("i % 2 == 0?"), IO_("Print i")]], null), J_()], post: [IO_('Print "Done"')] },
      situation: "Print only the even numbers", visits: [{ q: "0, 1, 2, 3 are left. Any numbers left?", a: true }, { q: "i is 0. Is 0 % 2 == 0?", a: true }, { q: "Any numbers left?", a: true }, { q: "i is 1. Is 1 % 2 == 0?", a: false, hint: "1 % 2 is 1." }, { q: "Any numbers left?", a: true }, { q: "i is 2. Is 2 % 2 == 0?", a: true }, { q: "Any numbers left?", a: true }, { q: "i is 3. Is 3 % 2 == 0?", a: false }, { q: "All four numbers are used. Any numbers left?", a: false }],
      why: "An if inside a for loop is checked once for every number. Here it prints 0 and 2." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(2)?")), P_("i = next number"), IO_("Show HEART", { img: "HEART" }), IO_("Clear screen", { clear: true })], post: [IO_('Scroll "Done"', { scroll: "Done" })] }, situation: "for i in range(2): flash the heart twice", visits: [{ q: "Nothing used yet: 0 and 1 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 0. Only 1 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1. All two numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "range(2) hands out 0 and 1, so the heart flashes twice." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(1, 4)?")), P_("i = next number"), IO_("Print i")], post: [IO_('Print "Done"')] }, situation: "for i in range(1, 4): print each number", visits: [{ q: "Nothing used yet: 1, 2 and 3 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1. 2 and 3 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 2. Only 3 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 3. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "range(1, 4) starts at 1 and stops before 4: 1, 2, 3." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(0, 6, 2)?")), P_("i = next number"), IO_("Print i")], post: [IO_('Print "Done"')] }, situation: "for i in range(0, 6, 2): the even numbers", visits: [{ q: "Nothing used yet: 0, 2 and 4 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 0. 2 and 4 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 2. Only 4 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 4. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "Steps of 2 from 0, stopping before 6: 0, 2, 4." },
    { chart: { loop: true, loopLabel: "for: next number", pre: [P_("total = 0")], body: [W_(D_("Numbers left in\nrange(3)?")), P_("i = next number"), P_("total = total + 5")], post: [IO_("Show total")] }, situation: "Add 5 three times", visits: [{ q: "Nothing used yet: 0, 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 0, total is 5. 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1, total is 10. Only 2 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 2, total is 15. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "5 is added on each of the 3 trips round, so total is 15." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(3, 0, -1)?")), P_("i = next number"), IO_("Show i")], post: [IO_('Scroll "Go"', { scroll: "Go" })] }, situation: "A countdown: 3, 2, 1, Go", visits: [{ q: "Nothing used yet: 3, 2 and 1 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 3. 2 and 1 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 2. Only 1 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "A step of -1 counts down, and the stop (0) is left out." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(0)?")), P_("i = next number"), IO_("Show HEART", { img: "HEART" })], post: [IO_("Show SAD", { img: "SAD" })] }, situation: "for i in range(0): an empty range", visits: [{ q: "range(0) has no numbers at all. Any numbers left?", a: false, hint: "Every number has been used." }], why: "range(0) has no numbers, so the body never runs. The loop goes straight to the end." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(3)?")), P_("i = next number"), CH_([[D_("i == 1?"), IO_("Show HEART", { img: "HEART" })]], null), J_()], post: [IO_("Clear screen", { clear: true })] }, situation: "Show the heart only when i is 1", visits: [{ q: "Nothing used yet: 0, 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i is 0. Is 0 == 1?", a: false, hint: "0 == 1 is False." }, { q: "i was 0. 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i is 1. Is 1 == 1?", a: true, hint: "1 == 1 is True." }, { q: "i was 1. Only 2 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i is 2. Is 2 == 1?", a: false, hint: "2 == 1 is False." }, { q: "i was 2. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "The if is checked once for each number, but it's only True once." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(3)?")), P_("i = next number"), CH_([[D_("i > 0?"), IO_("Print i")]], null), J_()], post: [IO_('Print "Done"')] }, situation: "Print only the numbers bigger than 0", visits: [{ q: "Nothing used yet: 0, 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i is 0. Is 0 > 0?", a: false, hint: "0 > 0 is False." }, { q: "i was 0. 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i is 1. Is 1 > 0?", a: true, hint: "1 > 0 is True." }, { q: "i was 1. Only 2 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i is 2. Is 2 > 0?", a: true, hint: "2 > 0 is True." }, { q: "i was 2. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "0 > 0 is False, so only 1 and 2 are printed." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(1, 6, 2)?")), P_("i = next number"), IO_("Print i")], post: [IO_('Print "Done"')] }, situation: "for i in range(1, 6, 2): the odd numbers", visits: [{ q: "Nothing used yet: 1, 3 and 5 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1. 3 and 5 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 3. Only 5 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 5. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "Start at 1, step 2, stop before 6: 1, 3, 5." },
    { chart: { loop: true, loopLabel: "for: next number", pre: [P_("n = 1")], body: [W_(D_("Numbers left in\nrange(3)?")), P_("i = next number"), P_("n = n * 2")], post: [IO_("Show n")] }, situation: "Double n three times", visits: [{ q: "Nothing used yet: 0, 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 0, n is 2. 1 and 2 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1, n is 4. Only 2 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 2, n is 8. All three numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "n doubles on each of the 3 trips: 1, 2, 4, 8." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(10, 30, 10)?")), P_("i = next number"), IO_("Scroll i")], post: [IO_("Show YES", { img: "YES" })] }, situation: "for i in range(10, 30, 10)", visits: [{ q: "Nothing used yet: 10 and 20 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 10. Only 20 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 20. All two numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "Steps of 10 from 10, stopping before 30: just 10 and 20." },
    { chart: { loop: true, loopLabel: "for: next number", body: [W_(D_("Numbers left in\nrange(2)?")), P_("i = next number"), IO_("Play a note"), P_("Wait 200 ms")], post: [IO_("Show HAPPY", { img: "HAPPY" })] }, situation: "Beep twice", visits: [{ q: "Nothing used yet: 0 and 1 are left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 0. Only 1 is left. Any numbers left?", a: true, hint: "Look at which numbers are still left." }, { q: "i was 1. All two numbers are used. Any numbers left?", a: false, hint: "Every number has been used." }], why: "i isn't used in the body, but range(2) still controls how many beeps there are." }
  ] },

  r6: { kind: "PseudoTranslate", data: [
    { ps: ["FOR i FROM 0 TO 4", "    SHOW i", "END FOR"], py: ["for i in range(5):", "    display.show(i)", null],
      distractors: ["for i in range(4):", "for i in range(0, 4):", "for i = 0 to 4:"], head: MB_HEAD,
      why: "FROM 0 TO 4 includes 4, so the Python stop is 5." },
    { ps: ["FOR count FROM 1 TO 5", "    PRINT count", "END FOR"], py: ["for count in range(1, 6):", "    print(count)", null],
      distractors: ["for count in range(1, 5):", "for count in range(5):", "print(range(5))"], head: MB_HEAD,
      why: "range(1, 6) gives 1 to 5. The stop is always one past the last number." },
    { ps: ["SET total TO 0", "FOR n FROM 1 TO 10", "    ADD n TO total", "END FOR", "DISPLAY total"], py: ["total = 0", "for n in range(1, 11):", "    total = total + n", null, "display.scroll(total)"],
      distractors: ["for n in range(10):", "total = n", "total == total + n"], head: MB_HEAD,
      why: "DISPLAY total comes after END FOR, so it isn't indented and runs once." },
    { ps: ["REPEAT 3 TIMES", "    SHOW HEART", "    WAIT 300 ms", "    CLEAR the screen", "    WAIT 300 ms", "END REPEAT"], py: ["for i in range(3):", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)", null],
      distractors: ["while True:", "for i in range(4):", "sleep(3)"], head: MB_HEAD,
      why: "REPEAT 3 TIMES is for i in range(3). The loop variable isn't even used, but it's still needed." },
    { ps: ["FOR i FROM 1 TO 3", "    PRINT i", "END FOR"], py: ["for i in range(1, 4):", "    print(i)", null], distractors: ["for i in range(1, 3):", "for i in range(3):", "for i = 1 to 3:"], head: MB_HEAD, why: "FROM 1 TO 3 includes 3, so the Python stop is 4." },
    { ps: ["REPEAT 4 TIMES", "    PRINT \"Hello\"", "END REPEAT"], py: ["for i in range(4):", "    print(\"Hello\")", null], distractors: ["for i in range(5):", "while True:", "for i in range(1, 4):"], head: MB_HEAD, why: "REPEAT 4 TIMES is for i in range(4)." },
    { ps: ["FOR n FROM 0 TO 10 STEP 5", "    SHOW n", "END FOR"], py: ["for n in range(0, 11, 5):", "    display.show(n)", null], distractors: ["for n in range(0, 10, 5):", "for n in range(0, 11):", "for n in range(5, 10):"], head: MB_HEAD, why: "TO 10 includes 10, so the stop is 11. STEP 5 becomes the third number." },
    { ps: ["FOR count FROM 5 TO 1 STEP -1", "    SHOW count", "END FOR", "SHOW HAPPY"], py: ["for count in range(5, 0, -1):", "    display.show(count)", null, "display.show(Image.HAPPY)"], distractors: ["for count in range(5, 1, -1):", "for count in range(1, 5):", "for count in range(5, 0):"], head: MB_HEAD, why: "Counting down to 1 means stopping at 0, with a step of -1." },
    { ps: ["SET total TO 0", "FOR n FROM 1 TO 3", "    ADD n TO total", "END FOR", "PRINT total"], py: ["total = 0", "for n in range(1, 4):", "    total = total + n", null, "print(total)"], distractors: ["for n in range(3):", "total = total + 1", "print(n)"], head: MB_HEAD, why: "PRINT total comes after END FOR, so it isn't indented and runs once." },
    { ps: ["REPEAT 2 TIMES", "    SCROLL \"Hi\"", "END REPEAT", "SHOW HEART"], py: ["for i in range(2):", "    display.scroll(\"Hi\")", null, "display.show(Image.HEART)"], distractors: ["for i in range(1, 2):", "display.show(\"Hi\")", "while i < 2:"], head: MB_HEAD, why: "REPEAT 2 TIMES is for i in range(2). SHOW HEART is after the loop." },
    { ps: ["FOR i FROM 0 TO 4", "    SHOW i", "    WAIT 500 ms", "END FOR", "CLEAR the screen"], py: ["for i in range(5):", "    display.show(i)", "    sleep(500)", null, "display.clear()"], distractors: ["sleep(0.5)", "for i in range(4):", "display.clear(i)"], head: MB_HEAD, why: "sleep() takes milliseconds, so 500 ms is sleep(500)." },
    { ps: ["SET count TO 0", "REPEAT WHILE count < 3", "    PRINT count", "    ADD 1 TO count", "END REPEAT"], py: ["count = 0", "while count < 3:", "    print(count)", "    count = count + 1", null], distractors: ["for count < 3:", "count + 1", "while count <= 3:"], head: MB_HEAD, why: "REPEAT WHILE becomes while. count + 1 on its own works it out but doesn't store it." },
    { ps: ["REPEAT WHILE button A is not pressed", "    SHOW an arrow", "END REPEAT", "SCROLL \"Go\""], py: ["while not button_a.is_pressed():", "    display.show(Image.ARROW_W)", null, "display.scroll(\"Go\")"], distractors: ["while button_a.is_pressed():", "if not button_a.is_pressed():", "display.show(\"Go\")"], head: MB_HEAD, why: "not flips the condition: keep looping while A is not pressed." },
    { ps: ["SET lives TO 3", "REPEAT WHILE lives > 0", "    SHOW lives", "    SUBTRACT 1 FROM lives", "END REPEAT"], py: ["lives = 3", "while lives > 0:", "    display.show(lives)", "    lives = lives - 1", null], distractors: ["while lives >= 0:", "lives - 1", "lives = lives + 1"], head: MB_HEAD, why: "SUBTRACT 1 FROM lives is lives = lives - 1." },
    { ps: ["FOR i FROM 1 TO 5", "    PRINT i * 2", "END FOR"], py: ["for i in range(1, 6):", "    print(i * 2)", null], distractors: ["for i in range(1, 5):", "print(i + 2)", "for i in range(5):"], head: MB_HEAD, why: "i goes 1 to 5, so this prints 2, 4, 6, 8, 10." }
  ] },

  r7: { kind: "PseudoCloze", data: [
    { goal: "Flash a heart 5 times.", ps: ["REPEAT {{5|4|6}} TIMES", "    SHOW HEART", "    WAIT 300 ms", "    {{CLEAR the screen|SHOW HEART|STOP REPEATING}}", "    WAIT 300 ms", "END REPEAT"],
      py: ["for i in range(5):", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)"], why: "REPEAT 5 TIMES becomes for i in range(5)." },
    { goal: "Show 1, 2, 3, 4, 5.", ps: ["FOR n FROM {{1|0|2}} TO {{5|6|4}}", "    SHOW n", "END FOR"],
      py: ["for n in range(1, 6):", "    display.show(n)"], why: "In pseudocode FROM 1 TO 5 includes both ends. In Python that's range(1, 6)." },
    { goal: "Show the even numbers 0, 2, 4, 6, 8.", ps: ["FOR n FROM 0 TO {{8|10|12}} STEP {{2|1|0}}", "    SHOW n", "END FOR"],
      py: ["for n in range(0, 10, 2):", "    display.show(n)"], why: "STEP 2 jumps two at a time, and TO 8 makes 8 the last number." },
    { goal: "Add up 1 to 4 and display the total (10).", ps: ["SET total TO {{0|1|4}}", "FOR n FROM 1 TO 4", "    {{ADD n TO total|SET total TO n|ADD 1 TO total}}", "END FOR", "DISPLAY total"],
      py: ["total = 0", "for n in range(1, 5):", "    total = total + n", "display.scroll(total)"], why: "Start at 0 and add each n: 1 + 2 + 3 + 4 = 10." },
    { goal: "Show 0, 1, 2.", ps: ["FOR n FROM {{0|1|2}} TO {{2|3|1}}", "    SHOW n", "END FOR"], py: ["for n in range(3):", "    display.show(n)"], why: "FROM 0 TO 2 includes both ends. In Python that's range(3)." },
    { goal: "Scroll Hi 3 times, then show HAPPY.", ps: ["REPEAT {{3|2|4}} TIMES", "    SCROLL \"Hi\"", "END REPEAT", "{{SHOW HAPPY|SCROLL \"Hi\"|REPEAT FOREVER}}"], py: ["for i in range(3):", "    display.scroll(\"Hi\")", "display.show(Image.HAPPY)"], why: "SHOW HAPPY comes after END REPEAT, so it happens once." },
    { goal: "Count down 5, 4, 3, 2, 1.", ps: ["FOR n FROM 5 TO {{1|0|5}} STEP {{-1|1|-5}}", "    SHOW n", "END FOR"], py: ["for n in range(5, 0, -1):", "    display.show(n)"], why: "Counting down needs STEP -1, and TO 1 makes 1 the last number." },
    { goal: "Show 10, 20, 30.", ps: ["FOR n FROM {{10|0|20}} TO 30 STEP {{10|1|3}}", "    SHOW n", "END FOR"], py: ["for n in range(10, 31, 10):", "    display.show(n)"], why: "Start at 10 and jump 10 at a time." },
    { goal: "Add up 1 to 3 and display the total (6).", ps: ["SET total TO {{0|1|3}}", "FOR n FROM 1 TO {{3|4|2}}", "    ADD n TO total", "END FOR", "DISPLAY total"], py: ["total = 0", "for n in range(1, 4):", "    total = total + n", "display.scroll(total)"], why: "Start the total at 0, then add 1, 2 and 3." },
    { goal: "Show 0, 1, 2, 3, 4 with a while loop.", ps: ["SET count TO {{0|1|4}}", "REPEAT WHILE count {{<|<=|>}} 5", "    SHOW count", "    {{ADD 1 TO count|SUBTRACT 1 FROM count|SET count TO 5}}", "END REPEAT"], py: ["count = 0", "while count < 5:", "    display.show(count)", "    count = count + 1"], why: "Track (count = 0), check (< 5) and update (add 1)." },
    { goal: "Show 3, 2, 1, then scroll Go.", ps: ["SET count TO 3", "REPEAT WHILE count {{> 0|>= 0|< 0}}", "    SHOW count", "    SUBTRACT 1 FROM count", "END REPEAT", "{{SCROLL \"Go\"|SHOW count|ADD 1 TO count}}"], py: ["count = 3", "while count > 0:", "    display.show(count)", "    count = count - 1", "display.scroll(\"Go\")"], why: "> 0 stops before 0 is shown. Go comes after the loop." },
    { goal: "Show an arrow until button A is pressed, then show YES.", ps: ["REPEAT WHILE button A is {{not pressed|pressed|held down}}", "    SHOW an arrow", "END REPEAT", "SHOW YES"], py: ["while not button_a.is_pressed():", "    display.show(Image.ARROW_W)", "display.show(Image.YES)"], why: "Keep waiting while A is not pressed. Pressing it ends the loop." },
    { goal: "Show the even numbers 2, 4, 6.", ps: ["FOR n FROM {{2|0|1}} TO 6 STEP {{2|1|3}}", "    SHOW n", "END FOR"], py: ["for n in range(2, 7, 2):", "    display.show(n)"], why: "Start at 2 and step 2. TO 6 makes 6 the last number." },
    { goal: "Count presses of A. After 3 presses, show HAPPY.", ps: ["SET presses TO {{0|3|1}}", "REPEAT WHILE presses {{< 3|> 3|== 3}}", "    IF button A was pressed THEN", "        ADD 1 TO presses", "    END IF", "END REPEAT", "SHOW HAPPY"], py: ["presses = 0", "while presses < 3:", "    if button_a.was_pressed():", "        presses = presses + 1", "display.show(Image.HAPPY)"], why: "Start at 0 and keep looping while there have been fewer than 3 presses." },
    { goal: "Start n at 1 and double it until it's at least 50, then display it (64).", ps: ["SET n TO {{1|0|50}}", "REPEAT WHILE n {{< 50|> 50|== 50}}", "    SET n TO n * {{2|1|50}}", "END REPEAT", "DISPLAY n"], py: ["n = 1", "while n < 50:", "    n = n * 2", "display.scroll(n)"], why: "1, 2, 4 … 32, 64. 64 is the first value that isn't less than 50." }
  ] },

  r8: { kind: "Quiz", data: [
    { code: "", ask: "What numbers does range(5) give?", opts: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "0, 1, 2, 3, 4"], a: 2, why: "range(n) starts at 0 and stops before n." },
    { code: 'for i in range(3):\n    print("Hi")', ask: "How many times is Hi printed?", opts: ["2", "3", "4"], a: 1, why: "range(3) gives 0, 1, 2: three times." },
    { code: "", ask: "What does range(2, 6) give?", opts: ["2, 3, 4, 5", "2, 3, 4, 5, 6", "3, 4, 5"], a: 0, why: "It starts at 2 and stops before 6." },
    { code: "for i in range(0, 10, 5):\n    print(i)", ask: "What is printed?", opts: ["5 10", "0 5", "0 5 10"], a: 1, why: "Steps of 5 from 0, stopping before 10." },
    { code: "", ask: "Which loop is best when you know exactly how many times to repeat?", opts: ["A while loop", "A for loop", "while True"], a: 1, why: "for loops are best when you know the number of repetitions." },
    { code: "for count in range(4):\n    pass\nprint(count)", ask: "What is printed after the loop?", opts: ["4", "An error", "3"], a: 2, why: "The loop variable keeps its last value, which is 3." },
    { code: "for count in range(10):", ask: "In this line, what is count?", opts: ["The loop variable", "A keyword", "The number of repeats"], a: 0, why: "for, in and range are fixed; count is the loop variable, and you can choose its name." },
    { code: "", ask: "Which line counts down 5, 4, 3, 2, 1?", opts: ["for i in range(5, 0):", "for i in range(5, 0, -1):", "for i in range(1, 6):"], a: 1, why: "Counting down needs a negative step. range(5, 0) on its own is empty." },
    { code: "", ask: "What numbers does range(1, 4) give?", opts: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"], a: 0, why: "It starts at 1 and stops before 4." },
    { code: "for i in range(4):\n    print(i)", ask: "What is the last number printed?", opts: ["4", "3", "0"], a: 1, why: "range(4) is 0, 1, 2, 3. The stop, 4, is never reached." },
    { code: "", ask: "Which range gives 10, 8, 6, 4, 2?", opts: ["range(10, 0, -2)", "range(10, 2, -2)", "range(2, 11, 2)"], a: 0, why: "Start 10, step -2, stop before 0." },
    { code: "total = 0\nfor i in range(5):\n    total = total + 1\nprint(total)", ask: "What is printed?", opts: ["4", "10", "5"], a: 2, why: "1 is added on each of the 5 trips round the loop." },
    { code: "", ask: "How many numbers does range(0, 10, 2) give?", opts: ["4", "5", "10"], a: 1, why: "0, 2, 4, 6, 8: five numbers. 10 is left out." },
    { code: "", ask: "What does break do inside a loop?", opts: ["Skips one number", "Starts the loop again", "Leaves the loop straight away"], a: 2, why: "break ends the loop at once. The program carries on after it." },
    { code: "for i in range(3):\n    for j in range(2):\n        print(\"*\")", ask: "How many stars are printed?", opts: ["5", "6", "3"], a: 1, why: "The inner loop runs 2 times for each of the 3 outer trips: 3 × 2 = 6." }
  ] },

  r9: { kind: "BugHunt", data: [
    { goal: "Flash the heart 5 times.", symptom: "It only flashes 4 times",
      lines: ["from microbit import *", "", "for i in range(4):", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)"],
      bug: "for i in range(4):", fixes: ["for i in range(5):", "for i in range(6):", "for i in range(1, 5):"], why: "range(5) repeats 5 times. range(1, 5) is still only 4 numbers.", out: [{ img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }] },
    { goal: "Print 0, 1, 2.", symptom: "  File \"main.py\", line 3\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "for i in range(3)", "    print(i)"],
      bug: "for i in range(3)", fixes: ["for i in range(3):", "for i in range 3:", "for (i in range(3)):"], why: "for lines end with a colon, like while and if.", out: [] },
    { goal: "Show 1 to 5.", symptom: "Shows 0, 1, 2, 3, 4",
      lines: ["from microbit import *", "", "for n in range(5):", "    display.show(n)", "    sleep(500)"],
      bug: "for n in range(5):", fixes: ["for n in range(1, 6):", "for n in range(1, 5):", "for n in range(6):"], why: "Start at 1 and stop before 6.", out: ["1", "2", "3", "4", "5"] },
    { goal: "Flash a heart 3 times.", symptom: "  File \"main.py\", line 4\nIndentationError: expected an indented block",
      lines: ["from microbit import *", "", "for i in range(3):", "display.show(Image.HEART)", "    sleep(300)"],
      bug: "display.show(Image.HEART)", fixes: ["    display.show(Image.HEART)", "        display.show(Image.HEART)", "display.show(Image.HEART):"], why: "The body of a for loop must be indented, and every line in it needs the same indent.", out: [{ img: "HEART", ms: 300 }] },
    { goal: "Repeat 5 times.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 3, in <module>\nTypeError: can't convert float to int",
      lines: ["from microbit import *", "", "for i in range(10 / 2):", "    print(i)"],
      bug: "for i in range(10 / 2):", fixes: ["for i in range(5):", "for i in range(10 / 2.0):", 'for i in range("5"):'], why: "/ always gives a decimal (5.0), and range only accepts whole numbers.", out: [] },
    { goal: "Count down 3, 2, 1.", symptom: "Nothing happens",
      lines: ["from microbit import *", "", "for i in range(3, 0):", "    display.show(i)", "    sleep(500)"],
      bug: "for i in range(3, 0):", fixes: ["for i in range(3, 0, -1):", "for i in range(0, 3):", "for i in range(3, 0, 1):"], why: "Counting down needs a negative step. Without it, range(3, 0) is empty.", out: ["3", "2", "1"] },
    { goal: "Add up 1 to 10 and scroll 55.", symptom: "Scrolls 45",
      lines: ["from microbit import *", "", "total = 0", "for n in range(1, 10):", "    total = total + n", "display.scroll(total)"],
      bug: "for n in range(1, 10):", fixes: ["for n in range(1, 11):", "for n in range(10):", "for n in range(1, 10, 1):"], why: "The stop is left out, so to include 10 it has to be 11.", out: ["55"] },
    { goal: "Scroll the total once, at the end (6).", symptom: "Scrolls 1, 3, 6 instead of just 6",
      lines: ["from microbit import *", "", "total = 0", "for n in range(1, 4):", "    total = total + n", "    display.scroll(total)"],
      bug: "    display.scroll(total)", fixes: ["display.scroll(total)", "        display.scroll(total)", "    display.scroll(n)"], why: "Un-indent it so it runs once, after the loop has finished.", out: ["6"] },
    { goal: "Print 2, 4, 6, 8.", symptom: "Prints 2, 3, 4, 5, 6, 7, 8", lines: ["from microbit import *", "", "for n in range(2, 9):", "    print(n)"], bug: "for n in range(2, 9):", fixes: ["for n in range(2, 9, 2):", "for n in range(2, 8, 2):", "for n in range(0, 9, 2):"], why: "A step of 2 skips the odd numbers. The stop has to be past 8.", out: [] },
    { goal: "Show 5, 4, 3, 2, 1.", symptom: "Shows 5, 4, 3, 2", lines: ["from microbit import *", "", "for i in range(5, 1, -1):", "    display.show(i)", "    sleep(300)"], bug: "for i in range(5, 1, -1):", fixes: ["for i in range(5, 0, -1):", "for i in range(5, 1):", "for i in range(5, -1, -1):"], why: "The stop is left out, so to include 1 the stop has to be 0. -1 would include 0 as well.", out: ["5", "4", "3", "2", "1"] },
    { goal: "Print 0 to 4.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nNameError: name 'num' isn't defined", lines: ["from microbit import *", "", "for n in range(5):", "    print(num)"], bug: "    print(num)", fixes: ["    print(n)", "    print(\"n\")", "    print(i)"], why: "Use the loop variable's name exactly: n.", out: [] },
    { goal: "Add up 1 to 5 and print 15.", symptom: "Prints 5", lines: ["from microbit import *", "", "total = 0", "for n in range(1, 6):", "    total = n", "print(total)"], bug: "    total = n", fixes: ["    total = total + n", "    total = total + 1", "    total == total + n"], why: "total = n replaces the total each time. total + n keeps adding to it.", out: [] },
    { goal: "Flash the heart 4 times.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 3, in <module>\nTypeError: can't convert str to int", lines: ["from microbit import *", "", "for i in range(\"4\"):", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)"], bug: "for i in range(\"4\"):", fixes: ["for i in range(4):", "for i in range(\"5\"):", "for i in \"4\":"], why: "\"4\" in quotes is a string. range needs a whole number.", out: [{ img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }] },
    { goal: "Count down 10, 8, 6, 4, 2.", symptom: "Nothing happens", lines: ["from microbit import *", "", "for i in range(10, 0, 2):", "    display.show(i)", "    sleep(300)"], bug: "for i in range(10, 0, 2):", fixes: ["for i in range(10, 0, -2):", "for i in range(10, 0, -1):", "for i in range(0, 10, 2):"], why: "Going from 10 down to 0 needs a negative step. With +2 the range is empty.", out: ["10", "8", "6", "4", "2"] },
    { goal: "Print Hi 3 times, then Bye once.", symptom: "Prints Hi, Bye, Hi, Bye, Hi, Bye", lines: ["from microbit import *", "", "for i in range(3):", "    print(\"Hi\")", "    print(\"Bye\")"], bug: "    print(\"Bye\")", fixes: ["print(\"Bye\")", "        print(\"Bye\")", "    print(\"Hi\")"], why: "Un-indent it so it runs once, after the loop.", out: [] }
  ] }
};

export const challenges = {
  w: [
    { title: "Countdown", level: "Starter",
      steps: ["Use a while loop to count down from 10 to 0.", "Show each number for half a second.", "After the loop, show a happy face."],
      starter: "from microbit import *\n\ncount = 10\n\nwhile count >= 0:\n    # show count, wait, then update it\n    pass\n\n# after the loop\n",
      solution: "from microbit import *\n\ncount = 10\n\nwhile count >= 0:\n    display.scroll(count)\n    sleep(500)\n    count = count - 1\n\ndisplay.show(Image.HAPPY)",
      tip: "This is the first practice idea from the slides. >= 0 makes sure 0 is shown too.",
      check: run => expectShown(run, nums(10, -1, -1), "The countdown")
        || (run.images[run.images.length - 1] === "HAPPY" ? null : "After the loop, show a happy face: display.show(Image.HAPPY)") },
    { title: "Count by 2s", level: "Starter",
      steps: ["Start count at 0.", "While count is less than 20, show it.", "Add 2 each time round: 0, 2, 4 … 18."],
      starter: "from microbit import *\n\ncount = 0\n\nwhile count < 20:\n    pass\n",
      solution: "from microbit import *\n\ncount = 0\n\nwhile count < 20:\n    display.scroll(count)\n    count = count + 2",
      tip: "Practice idea 3 from the slides. Try changing 20 to 21. Does anything change?",
      check: run => expectShown(run, nums(0, 20, 2)) },
    { title: "Press A to start", level: "Core",
      steps: ["Show an arrow while button A is NOT pressed.", "When A is pressed, the loop ends.", "Then scroll \"Go!\"."],
      starter: "from microbit import *\n\nwhile not button_a.is_pressed():\n    pass\n\n",
      solution: "from microbit import *\n\nwhile not button_a.is_pressed():\n    display.show(Image.ARROW_W)\n    sleep(100)\n\ndisplay.scroll(\"Go!\")",
      tip: "We don't know how long the user will wait, which makes this a job for a while loop.",
      check: run => (!run.images.length ? "Show an arrow (or any image) while you wait for A."
        : !run.pressed.a ? "Press A on the board to end the loop."
        : run.texts[run.texts.length - 1] !== "Go!" ? 'After the loop, scroll "Go!".' : null) },
    { title: "Lives game", level: "Stretch",
      steps: ["Start with lives = 3 and show it.", "Each press of B loses a life.", "When lives reaches 0, the loop ends: scroll \"Game over\"."],
      starter: "from microbit import *\n\nlives = 3\ndisplay.show(lives)\n\nwhile lives > 0:\n    pass\n\n",
      solution: "from microbit import *\n\nlives = 3\ndisplay.show(lives)\n\nwhile lives > 0:\n    if button_b.was_pressed():\n        lives = lives - 1\n        display.show(lives)\n\ndisplay.scroll(\"Game over\")",
      tip: "The update is inside an if, so lives only changes when B is pressed.",
      check: run => expectShown(run, ["3", "2", "1", "0", "Game over"], "Starting at 3 and pressing B three times") }
  ],
  r: [
    { title: "Flash 5 times", level: "Starter",
      steps: ["Use a for loop with range(5).", "Inside it, show a heart, wait, clear, wait.", "Count the flashes."],
      starter: "from microbit import *\n\nfor i in range(5):\n    pass\n",
      solution: "from microbit import *\n\nfor i in range(5):\n    display.show(Image.HEART)\n    sleep(300)\n    display.clear()\n    sleep(300)",
      tip: "Practice idea 2 from the slides.",
      check: run => {
        const hearts = run.images.filter(i => i === "HEART").length;
        if (hearts !== 5) return `The heart should flash 5 times. It was shown ${hearts} time${hearts === 1 ? "" : "s"}.`;
        return run.clears >= 4 ? null : "Clear the screen between hearts so each one is a separate flash.";
      } },
    { title: "Convert it", level: "Core",
      steps: ["Start from the while loop counter in the starter code.", "Rewrite it as a for loop.", "Check both show the same numbers."],
      starter: "from microbit import *\n\ncount = 0\nMAX_COUNT = 10\nwhile count < MAX_COUNT:\n    display.show(count)\n    sleep(500)\n    count = count + 1\n",
      solution: "from microbit import *\n\nMAX_COUNT = 10\nfor count in range(MAX_COUNT):\n    display.show(count)\n    sleep(500)",
      tip: "Practice idea 4 from the slides. count = 0 and count = count + 1 both disappear.",
      check: run => (!usesFor(run) ? "Use a for loop with range() instead of the while loop."
        : usesWhile(run) ? "Take the while loop out: the for loop replaces it."
        : expectShown(run, nums(0, 10), "The for loop")) },
    { title: "Times table", level: "Core",
      steps: ["Ask for a number with int(input()).", "Use for n in range(1, 11).", "Scroll number × n each time."],
      starter: "from microbit import *\n\nnumber = int(input(\"Which times table? \"))\n\n",
      solution: "from microbit import *\n\nnumber = int(input(\"Which times table? \"))\n\nfor n in range(1, 11):\n    display.scroll(number * n)\n    sleep(300)",
      tip: "range(1, 11) gives 1 to 10. Print the answers too, so they show in the serial pane.",
      check: run => {
        const n = parseInt(run.inputs[0], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks for the times table.";
        const want = nums(1, 11).map(k => String(n * k));
        return shown(run).join() === want.join() || run.prints.join() === want.join() ? null
          : `The ${n} times table is ${listText(want)}. Yours showed ${listText(shown(run))}.`;
      } },
    { title: "Fill the screen", level: "Stretch",
      steps: ["Use one for loop for the rows (y) and one inside it for the columns (x).", "Light each LED with display.set_pixel(x, y, 9).", "Wait 100 ms after each LED."],
      starter: "from microbit import *\n\nfor y in range(5):\n    # another for loop for x goes here\n    pass\n",
      solution: "from microbit import *\n\nfor y in range(5):\n    for x in range(5):\n        display.set_pixel(x, y, 9)\n        sleep(100)",
      tip: "A loop inside a loop is a nested loop. The inner loop runs all the way through for every trip round the outer one: 5 × 5 = 25 LEDs.",
      check: run => (countFor(run) < 2 ? "Use two for loops, one inside the other: rows (y) outside, columns (x) inside."
        : run.lit !== 25 ? `Every LED should be on at the end. ${run.lit} of 25 are on.` : null) }
  ]
};
