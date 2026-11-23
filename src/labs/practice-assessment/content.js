// Content for Practice 1: one topic per part of the course, in course order.
// Same shape as loops-lab/content.js. Each activity is { kind, data }: kind picks the component
// in src/activities, data is its rounds or questions. Run `npm run check` after editing.
//
// The simulator runs variables, if/elif/else, while and for loops, int(), str() and input(),
// but not def, lists, len(), string methods or files. Activities that run code (Predict,
// HowMany, StopOrNot, BugHunt fixes, challenges) stick to those; the later topics use Quiz,
// PseudoTrace, PseudoBug and PseudoCloze instead.
import { P_, IO_, D_, W_, CH_ } from "../../lib/flowchart.js";
import { MB_HEAD } from "../../lib/python.js";
import { nums, shown, listText, expectShown, usesFor } from "../../lib/checks.js";

export const meta = {
  "slug": "practice-assessment",
  "brand": "ICTPRG302 Practice 1",
  "title": "Practice 1",
  "key": "ictprg302-assessment-progress",
  "chKey": "ictprg302-assessment-challenges",
  "next": {
    "href": "../index.html",
    "label": "Back to all labs →"
  },
  "psKeywords": [
    "WHILE",
    "FOR",
    "EACH",
    "TIMES",
    "FOREVER",
    "OPEN",
    "WRITING",
    "READING",
    "APPENDING"
  ]
};

export const topics = [
  {
    "id": "variables",
    "label": "Variables",
    "eyebrow": "Topic 01",
    "title": "Variables",
    "lead": "A variable is a named box that holds a value. Setting it again replaces what was in the box. This part checks you can read code line by line and keep track of every variable.",
    "acts": [
      { "id": "pv1", "tag": "Question 1", "title": "Predict the output", "brief": "Read the program and pick what it prints. Then run it to check.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "pv2", "tag": "Question 2", "title": "Quiz: variables", "brief": "Names, values and assignment. Answer all of them correctly to finish." },
      { "id": "pv3", "tag": "Question 3", "title": "Spot the bug", "brief": "Each program has one bug. Click the line, then choose the fix.", "roundLabel": "Bug", "nextLabel": "Next bug →" }
    ],
    "real": {
      "key": "v",
      "title": "Variable tasks",
      "intro": "Write each program in the editor below and run it. When it passes, test it on a real micro:bit and tick it off."
    }
  },
  {
    "id": "functions",
    "label": "Functions",
    "eyebrow": "Topic 02",
    "title": "Functions",
    "lead": "A function is a named block of code you can run again and again. Parameters bring values in, and return sends a value back to the line that called it.",
    "acts": [
      { "id": "pf1", "tag": "Question 4", "title": "Follow the calls", "brief": "Read each function and its call, then pick what happens. Answer all of them correctly to finish." },
      { "id": "pf2", "tag": "Question 5", "title": "Quiz: functions", "brief": "Parameters, arguments, return and print. Answer all of them correctly to finish." },
      { "id": "pf3", "tag": "Question 6", "title": "Find the bug", "brief": "Each function has one mistake. Pick the line that's wrong. Answer all of them correctly to finish." }
    ]
  },
  {
    "id": "event-loop",
    "label": "Event loop",
    "eyebrow": "Topic 03",
    "title": "The event loop",
    "lead": "A micro:bit program usually runs forever inside while True:. Every trip round the loop it checks the buttons and sensors and reacts. Code before the loop runs once; code inside it runs again and again.",
    "acts": [
      { "id": "pe1", "tag": "Question 7", "title": "Follow the flowchart", "brief": "Answer each decision as the program goes round the event loop.", "roundLabel": "Chart", "nextLabel": "Next chart →" },
      { "id": "pe2", "tag": "Question 8", "title": "Will it ever stop?", "brief": "Decide whether each loop stops, runs forever or never runs. The simulator gives up after 25 times round.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "pe3", "tag": "Question 9", "title": "Quiz: the event loop", "brief": "Inside or outside the loop, was_pressed() or is_pressed(), and break. Answer all of them correctly to finish." },
      { "id": "pe4", "tag": "Question 10", "title": "Spot the bug", "brief": "Each program has one bug. Click the line, then choose the fix.", "roundLabel": "Bug", "nextLabel": "Next bug →" }
    ],
    "real": {
      "key": "e",
      "title": "Event loop tasks",
      "intro": "Each task uses while True:. In the simulator, press the buttons on the board while it runs."
    }
  },
  {
    "id": "selection",
    "label": "Selection",
    "eyebrow": "Topics 04 and 05",
    "title": "Selection",
    "lead": "if, elif and else choose which code runs. Python checks each condition from the top and runs the first one that's True. else catches everything left over.",
    "acts": [
      { "id": "ps1", "tag": "Question 11", "title": "Follow the flowchart", "brief": "Each diamond is a condition. Answer Yes or No to follow the path the program takes.", "roundLabel": "Chart", "nextLabel": "Next chart →" },
      { "id": "ps2", "tag": "Question 12", "title": "Predict the output", "brief": "Pick which branch runs and what it prints. Then run it to check.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "ps3", "tag": "Question 13", "title": "Dry run the plan", "brief": "Predict what the plan does with the given input, then watch the trace table fill in.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "ps4", "tag": "Question 14", "title": "Find the error in the plan", "brief": "Each plan has one mistake that stops it meeting its goal. Click the line, then choose the fix.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "ps5", "tag": "Question 15", "title": "Spot the bug", "brief": "Each program has one bug. Click the line, then choose the fix.", "roundLabel": "Bug", "nextLabel": "Next bug →" }
    ],
    "real": {
      "key": "s",
      "title": "Selection tasks",
      "intro": "These use input(). Type an answer in the serial pane when the program asks, and try several values, including the boundaries."
    }
  },
  {
    "id": "loops",
    "label": "Loops",
    "eyebrow": "Topics 06 and 07",
    "title": "Loops",
    "lead": "A while loop repeats while its condition is True. A for loop with range() repeats a set number of times. range() never includes its stop number.",
    "acts": [
      { "id": "pl1", "tag": "Question 16", "title": "How many times?", "brief": "Work out how many times the loop body runs, type your answer, then run it.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "pl2", "tag": "Question 17", "title": "Predict the output", "brief": "Read the loop and pick what it prints. Then run it to check.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "pl3", "tag": "Question 18", "title": "Translate it", "brief": "Choose the Python for each line of the plan. FROM 1 TO 5 includes 5; range() stops one before.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "pl4", "tag": "Question 19", "title": "Complete the plan", "brief": "Choose the right number or keyword for each blank so the plan meets its goal.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "pl5", "tag": "Question 20", "title": "Spot the bug", "brief": "Each loop has one bug. Click the line, then choose the fix.", "roundLabel": "Bug", "nextLabel": "Next bug →" }
    ],
    "real": {
      "key": "l",
      "title": "Loop tasks",
      "intro": "Pick the right loop for each task: for when you know how many times, while when you don't."
    }
  },
  {
    "id": "data-types",
    "label": "Types",
    "eyebrow": "Topics 08 and 09",
    "title": "Data types and strings",
    "lead": "Every value has a type: int, float, str or bool. + adds numbers but joins strings, and input() always gives you a string. Strings also have their own tools, like len(), slicing and .upper().",
    "acts": [
      { "id": "pd1", "tag": "Question 21", "title": "What type is it?", "brief": "Pick the type of each value or result. Answer all of them correctly to finish." },
      { "id": "pd2", "tag": "Question 22", "title": "Add or join?", "brief": "Pick what each program prints. Watch out for quotes. Then run it to check.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "pd3", "tag": "Question 23", "title": "Quiz: strings", "brief": "len(), indexes, slices and string functions. Answer all of them correctly to finish." },
      { "id": "pd4", "tag": "Question 24", "title": "Spot the bug", "brief": "Each program has one bug, usually a type problem. Click the line, then choose the fix.", "roundLabel": "Bug", "nextLabel": "Next bug →" }
    ],
    "real": {
      "key": "d",
      "title": "Data type tasks",
      "intro": "Convert with int() and str() so numbers and text work together."
    }
  },
  {
    "id": "lists",
    "label": "Lists",
    "eyebrow": "Topic 10",
    "title": "Lists",
    "lead": "A list holds many values in one variable, in order. Indexes start at 0. append() adds to the end, and a for loop can visit every item in turn.",
    "acts": [
      { "id": "pa1", "tag": "Question 25", "title": "What's at that index?", "brief": "Pick the value each expression gives. Answer all of them correctly to finish." },
      { "id": "pa2", "tag": "Question 26", "title": "Predict the list", "brief": "Pick what the list looks like after the code runs. Answer all of them correctly to finish." },
      { "id": "pa3", "tag": "Question 27", "title": "Dry run the plan", "brief": "Predict what the plan does, then watch the trace table fill in as it goes through the list.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "pa4", "tag": "Question 28", "title": "Find the bug", "brief": "Each program has one mistake. Pick the line that's wrong. Answer all of them correctly to finish." }
    ]
  },
  {
    "id": "files",
    "label": "Files",
    "eyebrow": "Topic 11",
    "title": "Files",
    "lead": "open() takes a file name and a mode: \"r\" to read, \"w\" to write (wiping what was there) and \"a\" to append to the end. Using with closes the file for you.",
    "acts": [
      { "id": "pg1", "tag": "Question 29", "title": "Which mode?", "brief": "Pick the mode each job needs. Answer all of them correctly to finish." },
      { "id": "pg2", "tag": "Question 30", "title": "Predict the file", "brief": "Pick what is in the file, or what is printed, after the code runs. Answer all of them correctly to finish." },
      { "id": "pg3", "tag": "Question 31", "title": "Dry run the plan", "brief": "Follow the plan and predict what ends up in the file.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "pg4", "tag": "Question 32", "title": "Find the bug", "brief": "Each program has one mistake. Pick the line that's wrong. Answer all of them correctly to finish." }
    ]
  }
];

export const activities = {
  /* ---------- 1 Variables ---------- */
  pv1: { kind: "Predict", data: [
    { lines: ["score = 5", "score = 8", "print(score)"], opts: ["5", "8", "13"], a: 1, why: "Setting score again replaces the 5. A variable only holds its latest value." },
    { lines: ["a = 4", "b = a", "a = 10", "print(b)"], opts: ["4", "10", "a"], a: 0, why: "b = a copies the value 4 into b. Changing a afterwards doesn't change b." },
    { lines: ["lives = 3", "lives = lives - 1", "lives = lives - 1", "print(lives)"], opts: ["3", "2", "1"], a: 2, why: "Each line takes 1 away from the current value: 3, then 2, then 1." },
    { lines: ["x = 7", "y = 2", "print(x + y, x * y)"], opts: ["9 14", "72 14", "9 72"], a: 0, why: "x + y is 9 and x * y is 14. print puts a space between them." },
    { lines: ['name = "Kai"', 'print("Hi " + name)'], opts: ["Hi name", "Hi Kai", "HiKai"], a: 1, why: "name holds \"Kai\", and the space is inside the first string." },
    { lines: ["total = 10", "total += 5", "total -= 3", "print(total)"], opts: ["12", "15", "18"], a: 0, why: "+= 5 makes it 15, then -= 3 makes it 12." }
  ] },

  pv2: { kind: "Quiz", data: [
    { code: "", ask: "Which of these is a valid Python variable name?", opts: ["2nd_score", "player score", "player_score"], a: 2, why: "Names can't start with a digit or contain spaces. Use underscores instead." },
    { code: "", ask: "What does the = sign do in Python?", opts: ["Checks if two values are equal", "Stores the value on the right in the variable on the left", "Adds two values"], a: 1, why: "= is assignment. == is the one that compares." },
    { code: "count = 0\ncount = count + 1", ask: "What value is in count at the end?", opts: ["0", "1", "count + 1"], a: 1, why: "Python works out count + 1 using the old value (0), then stores the answer, 1." },
    { code: "", ask: "Which name best describes what it stores?", opts: ["x", "temp_in_c", "thing"], a: 1, why: "A good name says what's in the box, so the code explains itself." },
    { code: "", ask: "Python names are case-sensitive. Are Score and score the same variable?", opts: ["Yes", "No"], a: 1, why: "Score and score are two different variables." },
    { code: 'a = 3\nb = 9\na = b\nb = a', ask: "What are a and b at the end?", opts: ["a is 9, b is 3", "a is 3, b is 9", "a is 9, b is 9"], a: 2, why: "a = b makes a 9, then b = a copies that 9 back. Swapping needs a third variable." }
  ] },

  pv3: { kind: "BugHunt", data: [
    { goal: "Show the score, 10.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nNameError: name 'scor' isn't defined",
      lines: ["from microbit import *", "", "score = 10", "display.scroll(scor)"],
      bug: "display.scroll(scor)", fixes: ["display.scroll(score)", 'display.scroll("scor")', "display.scroll(Score)"], why: "The name has to be spelt exactly the same every time, including capitals.", out: ["10"] },
    { goal: "Show the number of lives, 3.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nNameError: name 'lives' isn't defined",
      lines: ["from microbit import *", "", "Lives = 3", "display.scroll(lives)"],
      bug: "Lives = 3", fixes: ["lives = 3", "lives == 3", "\"lives\" = 3"], why: "Names are case-sensitive: Lives and lives are different variables.", out: ["3"] },
    { goal: "Add 5 to the score and show 15.", symptom: "It shows 10.",
      lines: ["from microbit import *", "", "score = 10", "score + 5", "display.scroll(score)"],
      bug: "score + 5", fixes: ["score = score + 5", "score == score + 5", "5 = score + 5"], why: "score + 5 works out 15 and throws it away. Store it with score = score + 5.", out: ["15"] },
    { goal: "Scroll Hello.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 3, in <module>\nNameError: name 'Hello' isn't defined",
      lines: ["from microbit import *", "", "display.scroll(Hello)"],
      bug: "display.scroll(Hello)", fixes: ['display.scroll("Hello")', "display.scroll(hello)", "display.scroll[Hello]"], why: "Text needs quotes. Without them, Python looks for a variable called Hello.", out: ["Hello"] }
  ] },

  /* ---------- 2 Functions ---------- */
  pf1: { kind: "Quiz", data: [
    { code: 'def greet(name):\n    print("Hi " + name)\n\ngreet("Ana")\ngreet("Ben")', ask: "What is printed?", opts: ["Hi name, Hi name", "Hi Ana, Hi Ben", "Nothing: greet is never called"], a: 1, why: "Each call passes a different argument into the name parameter." },
    { code: "def add(a, b):\n    return a + b\n\nresult = add(4, 6)\nprint(result)", ask: "What is printed?", opts: ["10", "46", "a + b"], a: 0, why: "add returns 4 + 6, and that 10 is stored in result." },
    { code: "def double(n):\n    return n * 2\n\nprint(double(double(3)))", ask: "What is printed?", opts: ["6", "9", "12"], a: 2, why: "The inner call gives 6, then the outer call doubles that to 12." },
    { code: 'def beat():\n    print("Boom")\n\nprint("Start")', ask: "What is printed?", opts: ["Boom", "Start", "Start, Boom"], a: 1, why: "Defining a function doesn't run it. beat() is never called." },
    { code: "def area(w, h):\n    return w * h\n\nprint(area(3, 5) + 1)", ask: "What is printed?", opts: ["15", "16", "18"], a: 1, why: "area(3, 5) returns 15. Adding 1 gives 16." }
  ] },

  pf2: { kind: "Quiz", data: [
    { code: "def greet(name):\n    print(\"Hi \" + name)\n\ngreet(\"Ana\")", ask: "In this code, which is the parameter?", opts: ["name", "\"Ana\"", "greet"], a: 0, why: "The parameter is the variable in the def line. \"Ana\" is the argument passed in." },
    { code: "", ask: "What does return do?", opts: ["Prints a value on the screen", "Sends a value back to the line that called the function", "Restarts the function"], a: 1, why: "return hands a value back. print only shows it." },
    { code: "", ask: "Which keyword starts a function definition?", opts: ["function", "def", "func"], a: 1, why: "Python uses def, then the name, brackets and a colon." },
    { code: "", ask: "Why use a function?", opts: ["To run the same code in many places without copying it", "To make the program run faster", "Because every program must have one"], a: 0, why: "Write it once, call it as often as you need." },
    { code: "def half(n):\n    print(n / 2)\n\nx = half(8)", ask: "What value is stored in x?", opts: ["4.0", "8", "None"], a: 2, why: "half prints 4.0 but doesn't return anything, so x gets None." }
  ] },

  pf3: { kind: "Quiz", data: [
    { code: "def square(n)\n    return n * n", ask: "Which line has the bug?", opts: ["Line 1", "Line 2", "There's no bug"], a: 0, why: "The def line needs a colon at the end: def square(n):" },
    { code: "def add(a, b):\nreturn a + b", ask: "Which line has the bug?", opts: ["Line 1", "Line 2", "There's no bug"], a: 1, why: "The body of a function has to be indented under the def line." },
    { code: "def add(a, b):\n    return a + b\n\nprint(add(2))", ask: "Which line has the bug?", opts: ["Line 1", "Line 2", "Line 4"], a: 2, why: "add needs two arguments but only gets one. add(2, 3) would work." },
    { code: "def double(n):\n    total = n * 2\n\nprint(double(5))", ask: "It prints None instead of 10. Which line needs to change?", opts: ["Line 1", "Line 2", "Line 4"], a: 1, why: "The answer is stored but never sent back. return n * 2 fixes it." }
  ] },

  /* ---------- 3 Event loop ---------- */
  pe1: { kind: "FlowTrace", data: [
    { chart: { loop: true, loopLabel: "while True: loop again", body: [CH_([[D_("Button A\npressed?"), IO_("Show HEART", { img: "HEART" })]], IO_("Clear screen", { clear: true }))] },
      situation: "An event loop that checks button A every time round", visits: [
        { q: "Trip 1: nobody is pressing A. Is A pressed?", a: false, hint: "Nobody is touching it." },
        { q: "Trip 2: you're holding A. Is A pressed?", a: true, hint: "You're holding it down." },
        { q: "Trip 3: you let go. Is A pressed?", a: false, hint: "You let go." }],
      why: "There's no way out of while True. The loop checks the button again on every trip." },
    { chart: { loop: true, loopLabel: "while True: loop again", body: [CH_([[D_("Button A\npressed?"), IO_("Show ARROW_W", { img: "ARROW_W" })], [D_("Button B\npressed?"), IO_("Show ARROW_E", { img: "ARROW_E" })]], IO_("Show HAPPY", { img: "HAPPY" }))] },
      situation: "Two buttons: A points left, B points right", visits: [
        { q: "Trip 1: you press B only. Is A pressed?", a: false, hint: "Only B is pressed." },
        { q: "Is B pressed?", a: true, hint: "You're pressing B." },
        { q: "Trip 2: no buttons. Is A pressed?", a: false, hint: "No buttons this time." },
        { q: "Is B pressed?", a: false, hint: "No buttons, so this goes to else." }],
      why: "elif is only checked when the if before it was False. else runs when no button is pressed." },
    { chart: { loop: true, loopLabel: "while True: loop again", pre: [P_("count = 0")], body: [CH_([[D_("Button A\nwas pressed?"), P_("count = count + 1")]]), IO_("Show count")] },
      situation: "Counting presses of A", visits: [
        { q: "Trip 1: you press A. Was A pressed?", a: true, hint: "You pressed it." },
        { q: "count is now 1. Trip 2: no press. Was A pressed?", a: false, hint: "Nothing was pressed this time." },
        { q: "Trip 3: you press A again. Was A pressed?", a: true, hint: "You pressed it again." }],
      why: "count = 0 is before the loop, so it only runs once. If it were inside, count would reset every trip." }
  ] },

  pe2: { kind: "StopOrNot", data: [
    { lines: ["while True:", "    display.show(Image.HEART)", "    sleep(200)"], a: 1, why: "while True is always True, and there's no break." },
    { lines: ["count = 0", "while True:", "    count = count + 1", "    if count == 5:", "        break"], a: 0, why: "break leaves the loop as soon as count reaches 5." },
    { lines: ["count = 0", "while True:", "    if count == 5:", "        break", "    print(count)"], a: 1, why: "Nothing changes count, so count == 5 is never True and break never runs." },
    { lines: ["on = False", "while on:", "    display.show(Image.YES)"], a: 2, why: "on is False the first time it's checked, so the body never runs." },
    { lines: ["count = 10", "while True:", "    count = count - 2", "    if count == 3:", "        break"], a: 1, why: "count goes 8, 6, 4, 2, 0 … It's always even, so it never equals 3." }
  ] },

  pe3: { kind: "Quiz", data: [
    { code: "", ask: "Where should code go that only needs to run once, when the micro:bit starts?", opts: ["Inside while True:", "Before while True:", "After while True:"], a: 1, why: "Code before the loop runs once. Code after while True only runs if the loop breaks." },
    { code: "", ask: "What's the difference between button_a.was_pressed() and button_a.is_pressed()?", opts: ["They do the same thing", "was_pressed() remembers a press since the last check; is_pressed() is only True while held down", "is_pressed() remembers a press; was_pressed() is only True while held"], a: 1, why: "was_pressed() catches quick taps. is_pressed() is for holding a button down." },
    { code: "while True:\n    display.show(Image.HEART)\ndisplay.scroll(\"Bye\")", ask: "When does Bye scroll?", opts: ["After the first heart", "Never", "When you press A"], a: 1, why: "There's no break, so the loop never ends and the line after it never runs." },
    { code: "", ask: "What does break do?", opts: ["Stops the micro:bit", "Leaves the loop it is in, and carries on after it", "Skips to the next trip round"], a: 1, why: "break jumps out of the nearest loop." },
    { code: "while True:\n    score = 0\n    if button_a.was_pressed():\n        score = score + 1\n    display.show(score)", ask: "Why does the score never get past 1?", opts: ["score = 0 is inside the loop, so it resets every trip", "was_pressed() only works once", "display.show() can't show numbers"], a: 0, why: "Move score = 0 above the loop so it's only set once." }
  ] },

  pe4: { kind: "BugHunt", data: [
    { goal: "Show a heart while A is held, otherwise clear the screen.", symptom: "  File \"main.py\", line 3\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "while True", "    if button_a.is_pressed():", "        display.show(Image.HEART)", "    else:", "        display.clear()"],
      bug: "while True", fixes: ["while True:", "while true:", "while (True)"], why: "Every while line ends with a colon.", out: [{ img: "HEART", ms: 700 }] },
    { goal: "Flash a happy face forever.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 3, in <module>\nNameError: name 'true' isn't defined",
      lines: ["from microbit import *", "", "while true:", "    display.show(Image.HAPPY)", "    sleep(500)", "    display.clear()", "    sleep(500)"],
      bug: "while true:", fixes: ["while True:", "while TRUE:", "while \"true\":"], why: "True needs a capital T.", out: [{ img: "HAPPY", ms: 500 }, { img: "HAPPY", ms: 500 }] },
    { goal: "Show a heart each time A is pressed, otherwise clear the screen.", symptom: "The heart shows all the time, even when A isn't pressed.",
      lines: ["from microbit import *", "", "while True:", "    if button_a.was_pressed:", "        display.show(Image.HEART)", "        sleep(300)", "    else:", "        display.clear()"],
      bug: "    if button_a.was_pressed:", fixes: ["    if button_a.was_pressed():", "    if button_a.was_pressed == True:", "    if button_a:"], why: "Without the brackets the function is never called, and a function on its own always counts as True.", out: [{ img: "HEART", ms: 500 }] }
  ] },

  /* ---------- 4 Selection ---------- */
  ps1: { kind: "FlowTrace", data: [
    { chart: { body: [P_("age = 16"), CH_([[D_("age >= 18?"), IO_('Scroll "Adult"', { scroll: "Adult" })], [D_("age >= 13?"), IO_('Scroll "Teen"', { scroll: "Teen" })]], IO_('Scroll "Child"', { scroll: "Child" }))] },
      situation: "age is 16", visits: [{ q: "Is 16 >= 18?", a: false, hint: "16 is less than 18." }, { q: "Is 16 >= 13?", a: true, hint: "16 is more than 13." }],
      why: "The first condition is False, so Python tries the elif. That's True, so Teen scrolls and else is skipped." },
    { chart: { body: [P_("temp = 30"), CH_([[D_("temp > 25?"), IO_('Scroll "Hot"', { scroll: "Hot" })], [D_("temp > 15?"), IO_('Scroll "Warm"', { scroll: "Warm" })]], IO_('Scroll "Cold"', { scroll: "Cold" }))] },
      situation: "temp is 30", visits: [{ q: "Is 30 > 25?", a: true, hint: "30 is bigger than 25." }],
      why: "The first True condition wins. 30 > 15 is True too, but it's never checked." },
    { chart: { body: [P_("score = 50"), CH_([[D_("score > 50?"), IO_('Scroll "Pass"', { scroll: "Pass" })]], IO_('Scroll "Fail"', { scroll: "Fail" }))] },
      situation: "score is exactly 50", visits: [{ q: "Is 50 > 50?", a: false, hint: "A number is never bigger than itself." }],
      why: "50 is the boundary. > 50 leaves it out; >= 50 would let it pass. Always test the boundary." }
  ] },

  ps2: { kind: "Predict", data: [
    { lines: ["x = 7", "if x > 5:", '    print("Big")', "else:", '    print("Small")'], opts: ["Big", "Small", "Big Small"], a: 0, why: "7 > 5 is True, so the if branch runs and else is skipped." },
    { lines: ["mark = 65", "if mark >= 80:", '    print("A")', "elif mark >= 50:", '    print("B")', "else:", '    print("C")'], opts: ["A", "B", "C"], a: 1, why: "65 isn't >= 80, but it is >= 50." },
    { lines: ["n = 4", "if n % 2 == 0:", '    print("Even")', "else:", '    print("Odd")'], opts: ["Even", "Odd", "0"], a: 0, why: "4 % 2 is the remainder, 0, so n is even." },
    { lines: ["temp = 20", "if temp > 10:", '    print("Warm")', "if temp > 15:", '    print("Hot")'], opts: ["Warm", "Hot", "Warm Hot"], a: 2, why: "These are two separate ifs, not if/elif, so both are checked and both are True." },
    { lines: ["age = 15", "if age >= 13 and age <= 19:", '    print("Teen")', "else:", '    print("Not teen")'], opts: ["Teen", "Not teen", "Nothing"], a: 0, why: "and needs both sides True: 15 >= 13 and 15 <= 19." },
    { lines: ['answer = "yes"', 'if answer == "Yes":', '    print("OK")', "else:", '    print("No")'], opts: ["OK", "No", "yes"], a: 1, why: "Comparing strings is case-sensitive: \"yes\" isn't the same as \"Yes\"." }
  ] },

  ps3: { kind: "PseudoTrace", data: [
    { ps: ["INPUT age", "IF age >= 18 THEN", '    DISPLAY "You can vote"', "ELSE", '    DISPLAY "Too young"', "END IF"],
      given: "The user types 17.", q: "What is displayed?", opts: ["You can vote", "Too young", "Both"], a: 1,
      steps: [{ l: 1, vars: { age: "17" } }, { l: 2, check: "17 >= 18 → False" }, { l: 5, out: "Too young" }],
      why: "17 >= 18 is False, so the ELSE branch runs." },
    { ps: ["INPUT speed", "IF speed > 60 THEN", '    DISPLAY "Slow down"', "ELSE IF speed > 40 THEN", '    DISPLAY "OK"', "ELSE", '    DISPLAY "Speed up"', "END IF"],
      given: "The user types 60.", q: "What is displayed?", opts: ["Slow down", "OK", "Speed up"], a: 1,
      steps: [{ l: 1, vars: { speed: "60" } }, { l: 2, check: "60 > 60 → False" }, { l: 4, check: "60 > 40 → True" }, { l: 5, out: "OK" }],
      why: "60 is the boundary: 60 > 60 is False, so it falls through to the ELSE IF." },
    { ps: ["SET total TO 0", "INPUT price", "IF price > 100 THEN", "    SET total TO price - 10", "ELSE", "    SET total TO price", "END IF", "DISPLAY total"],
      given: "The user types 120.", q: "What is displayed?", opts: ["120", "110", "10"], a: 1,
      steps: [{ l: 1, vars: { total: "0" } }, { l: 2, vars: { price: "120" } }, { l: 3, check: "120 > 100 → True" }, { l: 4, vars: { total: "110" } }, { l: 8, out: "110" }],
      why: "Over 100 gets $10 off: 120 - 10 = 110." }
  ] },

  ps4: { kind: "PseudoBug", data: [
    { goal: "Display Pass for a mark of 50 or more, otherwise Fail.", symptom: "A mark of exactly 50 shows Fail.",
      ps: ["INPUT mark", "IF mark > 50 THEN", '    DISPLAY "Pass"', "ELSE", '    DISPLAY "Fail"', "END IF"],
      bug: "IF mark > 50 THEN", fixes: ["IF mark >= 50 THEN", "IF mark < 50 THEN", "IF mark = 50 THEN"], why: "\"50 or more\" includes 50, so it needs >=." },
    { goal: "Display Hot over 30, Warm over 20, otherwise Cold.", symptom: "25 shows Cold.",
      ps: ["INPUT temp", "IF temp > 30 THEN", '    DISPLAY "Hot"', "ELSE IF temp < 20 THEN", '    DISPLAY "Warm"', "ELSE", '    DISPLAY "Cold"', "END IF"],
      bug: "ELSE IF temp < 20 THEN", fixes: ["ELSE IF temp > 20 THEN", "ELSE IF temp > 30 THEN", "IF temp < 20 THEN"], why: "Warm means over 20, so the condition needs >. With < 20, 25 matches nothing and falls through to Cold." },
    { goal: "Display Even for even numbers, otherwise Odd.", symptom: "Every number shows Odd.",
      ps: ["INPUT n", "IF n MOD 2 = 1 THEN", '    DISPLAY "Even"', "ELSE", '    DISPLAY "Odd"', "END IF"],
      bug: "IF n MOD 2 = 1 THEN", fixes: ["IF n MOD 2 = 0 THEN", "IF n MOD 1 = 2 THEN", "IF n = 2 THEN"], why: "An even number leaves no remainder when divided by 2." }
  ] },

  ps5: { kind: "BugHunt", data: [
    { goal: "Scroll Match if guess is 5.", symptom: "  File \"main.py\", line 4\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "guess = 5", "if guess = 5:", '    display.scroll("Match")'],
      bug: "if guess = 5:", fixes: ["if guess == 5:", "if guess => 5:", "if (guess = 5):"], why: "= stores a value. == compares two values.", out: ["Match"] },
    { goal: "Show a heart when it's warmer than 20 degrees.", symptom: "  File \"main.py\", line 5\nIndentationError: expected an indented block",
      lines: ["from microbit import *", "", "temp = temperature()", "if temp > 20:", "display.show(Image.HEART)"],
      bug: "display.show(Image.HEART)", fixes: ["    display.show(Image.HEART)", "display.show(Image.HEART):", "  if display.show(Image.HEART)"], why: "The code that belongs to an if has to be indented under it.", out: [{ img: "HEART", ms: 700 }] },
    { goal: "Scroll Low under 10, Mid under 20, otherwise High.", symptom: "  File \"main.py\", line 6\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "n = 15", "if n < 10:", '    display.scroll("Low")', "else n < 20:", '    display.scroll("Mid")', "else:", '    display.scroll("High")'],
      bug: "else n < 20:", fixes: ["elif n < 20:", "else if n < 20:", "elseif n < 20:"], why: "A second condition uses elif. else never has a condition.", out: ["Mid"] }
  ] },

  /* ---------- 5 Loops ---------- */
  pl1: { kind: "HowMany", data: [
    { lines: ["count = 0", "while count < 6:", "    print(count)", "    count = count + 1"], answer: 6, why: "count is 0 to 5: 6 values." },
    { lines: ["for i in range(2, 8):", "    print(i)"], answer: 6, why: "range(2, 8) gives 2, 3, 4, 5, 6, 7: 8 - 2 = 6 numbers." },
    { lines: ["for i in range(0, 10, 3):", "    print(i)"], answer: 4, why: "0, 3, 6, 9. 12 would be past the stop." },
    { lines: ["n = 20", "while n > 0:", "    print(n)", "    n = n - 5"], answer: 4, why: "n is 20, 15, 10, 5. At 0, n > 0 is False." },
    { lines: ["for i in range(5, 0, -1):", "    print(i)"], answer: 5, why: "Counting down: 5, 4, 3, 2, 1. It stops before 0." }
  ] },

  pl2: { kind: "Predict", data: [
    { lines: ["for i in range(3):", "    print(i)"], opts: ["1 2 3", "0 1 2", "0 1 2 3"], a: 1, why: "range(3) starts at 0 and stops before 3." },
    { lines: ["total = 0", "for n in range(1, 5):", "    total = total + n", "print(total)"], opts: ["10", "15", "6"], a: 0, why: "1 + 2 + 3 + 4 = 10. 5 isn't included." },
    { lines: ["for i in range(10, 0, -3):", "    print(i)"], opts: ["10 7 4 1", "10 7 4", "9 6 3"], a: 0, why: "Down in 3s from 10: 10, 7, 4, 1. The next, -2, is past 0." },
    { lines: ["count = 1", "while count < 30:", "    count = count * 2", "print(count)"], opts: ["16", "30", "32"], a: 2, why: "1, 2, 4, 8, 16, 32. 16 < 30 is True, so it doubles once more." },
    { lines: ["for i in range(1, 4):", "    print(i * i)"], opts: ["1 2 3", "1 4 9", "2 4 6"], a: 1, why: "i is 1, 2, 3, so i * i is 1, 4, 9." }
  ] },

  pl3: { kind: "PseudoTranslate", data: [
    { ps: ["FOR n FROM 1 TO 10", "    PRINT n", "END FOR"], py: ["for n in range(1, 11):", "    print(n)", null],
      distractors: ["for n in range(1, 10):", "for n in range(10):", "for n = 1 to 10:"], head: MB_HEAD,
      why: "FROM 1 TO 10 includes 10, so the Python stop is 11." },
    { ps: ["SET count TO 0", "REPEAT WHILE count < 5", "    SHOW count", "    ADD 1 TO count", "END REPEAT"], py: ["count = 0", "while count < 5:", "    display.show(count)", "    count = count + 1", null],
      distractors: ["while count <= 5:", "count == count + 1", "for count < 5:"], head: MB_HEAD,
      why: "REPEAT WHILE becomes a while loop, and ADD 1 TO count is count = count + 1." }
  ] },

  pl4: { kind: "PseudoCloze", data: [
    { goal: "Show 2, 4, 6, 8, 10.", ps: ["FOR n FROM {{2|0|1}} TO {{10|11|8}} STEP {{2|1|10}}", "    SHOW n", "END FOR"],
      py: ["for n in range(2, 11, 2):", "    display.show(n)"], why: "Start at 2, go up in 2s, and include 10. In Python the stop is 11." },
    { goal: "Count down from 5 to 1, then show a happy face.", ps: ["SET count TO {{5|0|1}}", "REPEAT WHILE count {{> 0|< 0|= 0}}", "    SHOW count", "    {{SUBTRACT 1 FROM count|ADD 1 TO count|SET count TO 0}}", "END REPEAT", "SHOW HAPPY"],
      py: ["count = 5", "while count > 0:", "    display.show(count)", "    count = count - 1", "display.show(Image.HAPPY)"], why: "Track, check and update: start at 5, keep going while above 0, and take 1 away each time." }
  ] },

  pl5: { kind: "BugHunt", data: [
    { goal: "Show 1 to 5.", symptom: "It shows 1 to 4.",
      lines: ["from microbit import *", "", "for i in range(1, 5):", "    display.show(i)", "    sleep(300)"],
      bug: "for i in range(1, 5):", fixes: ["for i in range(1, 6):", "for i in range(0, 5):", "for i in range(5):"], why: "range() stops one before the stop number.", out: ["1", "2", "3", "4", "5"] },
    { goal: "Show 0 to 4, then stop.", symptom: "It shows 0 forever.",
      lines: ["from microbit import *", "", "count = 0", "while count < 5:", "    display.show(count)", "    sleep(300)"],
      bug: "    sleep(300)", fixes: ["    count = count + 1", "    sleep(500)", "    count == count + 1"], why: "Without an update, count stays 0 and the loop never ends.", out: ["0", "1", "2", "3", "4"] },
    { goal: "Flash a heart 3 times.", symptom: "  File \"main.py\", line 3\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "for i in range(3)", "    display.show(Image.HEART)", "    sleep(300)", "    display.clear()", "    sleep(300)"],
      bug: "for i in range(3)", fixes: ["for i in range(3):", "for i in 3:", "for (i in range(3)):"], why: "A for line ends with a colon.", out: [{ img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }, { img: "HEART", ms: 300 }] }
  ] },

  /* ---------- 6 Data types and strings ---------- */
  pd1: { kind: "Quiz", data: [
    { code: "", ask: "What type is 42?", opts: ["int", "float", "str"], a: 0, why: "A whole number with no quotes is an int." },
    { code: "", ask: "What type is 3.5?", opts: ["int", "float", "bool"], a: 1, why: "A number with a decimal point is a float." },
    { code: "", ask: "What type is \"42\"?", opts: ["int", "str", "float"], a: 1, why: "Anything in quotes is a string, even if it looks like a number." },
    { code: "", ask: "What type is True?", opts: ["str", "int", "bool"], a: 2, why: "True and False are the two bool values." },
    { code: "x = 7 / 2", ask: "What type is x?", opts: ["int", "float", "str"], a: 1, why: "/ always gives a float: 3.5. // would give the int 3." },
    { code: 'age = input("Age? ")', ask: "The user types 16. What type is age?", opts: ["int", "str", "bool"], a: 1, why: "input() always gives back a string. Use int(input(...)) to get a number." }
  ] },

  pd2: { kind: "Predict", data: [
    { lines: ['print("5" + "5")'], opts: ["10", "55", "Error"], a: 1, why: "Both are strings, so + joins them." },
    { lines: ["print(5 + 5)"], opts: ["10", "55", "Error"], a: 0, why: "Both are numbers, so + adds them." },
    { lines: ['print(int("5") + 5)'], opts: ["10", "55", "Error"], a: 0, why: "int(\"5\") turns the string into the number 5 first." },
    { lines: ['print(str(5) + "5")'], opts: ["10", "55", "Error"], a: 1, why: "str(5) turns the number into the string \"5\", so + joins." },
    { lines: ["score = 12", 'print("Score: " + str(score))'], opts: ["Score: 12", "Score: score", "Error"], a: 0, why: "str() lets you join a number onto text." },
    { lines: ["print(17 % 5)"], opts: ["3", "2", "3.4"], a: 1, why: "% gives the remainder: 17 is 3 fives (15) with 2 left over." }
  ] },

  pd3: { kind: "Quiz", data: [
    { code: 'word = "micro"\nprint(len(word))', ask: "What is printed?", opts: ["4", "5", "6"], a: 1, why: "len() counts the characters: m, i, c, r, o." },
    { code: 'word = "micro"\nprint(word[0])', ask: "What is printed?", opts: ["m", "i", "o"], a: 0, why: "Indexes start at 0, so word[0] is the first character." },
    { code: 'word = "micro"\nprint(word[-1])', ask: "What is printed?", opts: ["m", "r", "o"], a: 2, why: "-1 counts from the end: the last character." },
    { code: 'word = "micro"\nprint(word[1:3])', ask: "What is printed?", opts: ["ic", "icr", "mi"], a: 0, why: "A slice starts at index 1 and stops before index 3." },
    { code: 'name = "sam"\nprint(name.upper())', ask: "What is printed?", opts: ["sam", "Sam", "SAM"], a: 2, why: "upper() gives every letter as a capital." },
    { code: 'msg = "cat"\nprint(msg.replace("c", "b"))', ask: "What is printed?", opts: ["bat", "cat", "cbt"], a: 0, why: "replace() swaps every c for b." }
  ] },

  pd4: { kind: "BugHunt", data: [
    { goal: "Ask for an age and scroll Adult if it's 18 or more.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nTypeError: unsupported types for __ge__: 'str', 'int'",
      lines: ["from microbit import *", "", 'age = input("Age? ")', "if age >= 18:", '    display.scroll("Adult")'],
      bug: 'age = input("Age? ")', fixes: ['age = int(input("Age? "))', 'age = str(input("Age? "))', 'age = input(int("Age? "))'], why: "input() gives a string. Wrap it in int() to compare it with a number.", out: ["Adult"] },
    { goal: "Scroll Score: 7.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nTypeError: can't convert 'int' object to str implicitly",
      lines: ["from microbit import *", "", "score = 7", 'display.scroll("Score: " + score)'],
      bug: 'display.scroll("Score: " + score)', fixes: ['display.scroll("Score: " + str(score))', 'display.scroll("Score: " + int(score))', 'display.scroll("Score: " + "score")'], why: "You can only join a string to a string. str(score) turns 7 into \"7\".", out: ["Score: 7"] },
    { goal: "Ask for two numbers and show their total.", symptom: "Typing 2 and 3 shows 23.",
      lines: ["from microbit import *", "", 'a = input("First? ")', 'b = input("Second? ")', "display.scroll(a + b)"],
      bug: "display.scroll(a + b)", fixes: ["display.scroll(int(a) + int(b))", "display.scroll(str(a) + str(b))", 'display.scroll(a + "+" + b)'], why: "Both answers are strings, so + joins \"2\" and \"3\" into \"23\". int() turns them into numbers first, so + adds them.", out: ["5"] },
  ] },

  /* ---------- 7 Lists ---------- */
  pa1: { kind: "Quiz", data: [
    { code: 'pets = ["cat", "dog", "fish"]\nprint(pets[1])', ask: "What is printed?", opts: ["cat", "dog", "fish"], a: 1, why: "Indexes start at 0: cat is 0, dog is 1." },
    { code: 'pets = ["cat", "dog", "fish"]\nprint(pets[-1])', ask: "What is printed?", opts: ["cat", "fish", "An error"], a: 1, why: "-1 is the last item." },
    { code: 'pets = ["cat", "dog", "fish"]\nprint(len(pets))', ask: "What is printed?", opts: ["2", "3", "11"], a: 1, why: "len() counts the items in the list." },
    { code: 'pets = ["cat", "dog", "fish"]\nprint(pets[3])', ask: "What happens?", opts: ["It prints fish", "It prints cat", "IndexError: the list only goes up to index 2"], a: 2, why: "3 items means indexes 0, 1 and 2. There's no index 3." },
    { code: "nums = [4, 9, 2]\nprint(nums[0] + nums[2])", ask: "What is printed?", opts: ["6", "13", "11"], a: 0, why: "nums[0] is 4 and nums[2] is 2." }
  ] },

  pa2: { kind: "Quiz", data: [
    { code: "nums = [1, 2]\nnums.append(3)", ask: "What is nums now?", opts: ["[3, 1, 2]", "[1, 2, 3]", "[1, 2]"], a: 1, why: "append() adds to the end." },
    { code: 'colours = ["red", "blue", "green"]\ncolours.remove("blue")', ask: "What is colours now?", opts: ['["red", "green"]', '["blue"]', '["red", "blue"]'], a: 0, why: "remove() takes out the first item that matches." },
    { code: "nums = [5, 6, 7]\nnums[0] = 9", ask: "What is nums now?", opts: ["[5, 6, 7, 9]", "[9, 5, 6, 7]", "[9, 6, 7]"], a: 2, why: "Assigning to an index replaces the item there." },
    { code: "nums = [3, 1, 2]\nnums.sort()", ask: "What is nums now?", opts: ["[1, 2, 3]", "[3, 2, 1]", "[3, 1, 2]"], a: 0, why: "sort() puts the list in order, smallest first." },
    { code: "nums = [8, 4, 6]\nnums.pop()", ask: "What is nums now?", opts: ["[4, 6]", "[8, 4]", "[8, 6]"], a: 1, why: "pop() with no index takes off the last item." },
    { code: "temps = []\nfor n in range(3):\n    temps.append(n * 10)", ask: "What is temps now?", opts: ["[10, 20, 30]", "[0, 10, 20]", "[30]"], a: 1, why: "n is 0, 1, 2, so 0, 10 and 20 are appended in turn." }
  ] },

  pa3: { kind: "PseudoTrace", data: [
    { ps: ["SET total TO 0", "FOR EACH n IN [3, 5, 7]", "    ADD n TO total", "END FOR", "PRINT total"],
      given: "No input. The loop visits each item in turn.", q: "What is printed?", opts: ["7", "15", "357"], a: 1,
      steps: [{ l: 1, vars: { total: "0" } }, { l: 2, vars: { n: "3" } }, { l: 3, vars: { total: "3" } }, { l: 2, vars: { n: "5" } }, { l: 3, vars: { total: "8" } }, { l: 2, vars: { n: "7" } }, { l: 3, vars: { total: "15" } }, { l: 5, out: "15" }],
      why: "3 + 5 + 7 = 15. total keeps a running sum." },
    { ps: ["SET count TO 0", "FOR EACH t IN [18, 26, 31, 22]", "    IF t > 25 THEN", "        ADD 1 TO count", "    END IF", "END FOR", "PRINT count"],
      given: "No input. Count the temperatures over 25.", q: "What is printed?", opts: ["1", "2", "3"], a: 1,
      steps: [{ l: 1, vars: { count: "0" } }, { l: 2, vars: { t: "18" } }, { l: 3, check: "18 > 25 → False" }, { l: 2, vars: { t: "26" } }, { l: 3, check: "26 > 25 → True" }, { l: 4, vars: { count: "1" } }, { l: 2, vars: { t: "31" } }, { l: 3, check: "31 > 25 → True" }, { l: 4, vars: { count: "2" } }, { l: 2, vars: { t: "22" } }, { l: 3, check: "22 > 25 → False" }, { l: 7, out: "2" }],
      why: "Only 26 and 31 are over 25." }
  ] },

  pa4: { kind: "Quiz", data: [
    { code: 'pets = ["cat", "dog"]\npets.add("fish")', ask: "It crashes with an AttributeError. Which line is wrong, and what should it use?", opts: ["Line 2: use append()", "Line 1: use round brackets", "Line 2: use insert() with no index"], a: 0, why: "pets.append(\"fish\") adds to the end of a list." },
    { code: "nums = [2, 4, 6]\nfor i in range(4):\n    print(nums[i])", ask: "It crashes with IndexError. Which line is wrong?", opts: ["Line 1", "Line 2", "Line 3"], a: 1, why: "There are only 3 items. range(len(nums)), or for n in nums:, stops at the right place." },
    { code: "scores = [7, 9, 5]\ntotal = 0\nfor s in scores:\n    total = s\nprint(total)", ask: "It should print the total, 21, but prints 5. Which line is wrong?", opts: ["Line 2", "Line 4", "Line 5"], a: 1, why: "total = s replaces the total each time. It should be total = total + s." },
    { code: 'names = ["Ana", "Ben"]\nprint(names[2])', ask: "It should print Ben. Which line is wrong?", opts: ["Line 1", "Line 2"], a: 1, why: "Ben is at index 1, not 2." }
  ] },

  /* ---------- 8 Files ---------- */
  pg1: { kind: "Quiz", data: [
    { code: "", ask: "Read the high score saved in a file.", opts: ['"r"', '"w"', '"a"'], a: 0, why: "\"r\" opens a file for reading." },
    { code: "", ask: "Add today's temperature to the end of a log, keeping the old readings.", opts: ['"r"', '"w"', '"a"'], a: 2, why: "\"a\" appends to the end and keeps what's there." },
    { code: "", ask: "Save a brand new settings file, replacing the old one.", opts: ['"r"', '"w"', '"a"'], a: 1, why: "\"w\" writes a fresh file, wiping anything already in it." },
    { code: "", ask: "What happens if you open a file that doesn't exist with \"r\"?", opts: ["It creates an empty file", "You get an error (the file isn't found)", "It reads an empty string"], a: 1, why: "Reading needs the file to exist. \"w\" and \"a\" create it if it's missing." },
    { code: "", ask: "Why use with open(...) as f:?", opts: ["It closes the file for you when the block ends", "It makes the file read faster", "It's the only way to write"], a: 0, why: "with closes the file automatically, even if something goes wrong." }
  ] },

  pg2: { kind: "Quiz", data: [
    { code: 'with open("log.txt", "w") as f:\n    f.write("Hi")\nwith open("log.txt", "w") as f:\n    f.write("Bye")', ask: "What is in log.txt at the end?", opts: ["Hi", "Bye", "HiBye"], a: 1, why: "The second \"w\" wipes the file before writing Bye." },
    { code: 'with open("log.txt", "w") as f:\n    f.write("Hi")\nwith open("log.txt", "a") as f:\n    f.write("Bye")', ask: "What is in log.txt at the end?", opts: ["Hi", "Bye", "HiBye"], a: 2, why: "\"a\" adds to the end. There's no \\n, so they end up on the same line." },
    { code: 'with open("log.txt", "w") as f:\n    f.write("12")\nwith open("log.txt", "r") as f:\n    text = f.read()\nprint(text + "3")', ask: "What is printed?", opts: ["15", "123", "An error"], a: 1, why: "read() always gives a string, so + joins. Use int(text) to do maths." },
    { code: 'with open("log.txt", "w") as f:\n    for n in range(3):\n        f.write(str(n) + "\\n")', ask: "What is in log.txt?", opts: ["0, 1 and 2, each on its own line", "3", "012 on one line"], a: 0, why: "\\n starts a new line after each number." },
    { code: "import os\nprint(os.listdir())", ask: "What does this print?", opts: ["What's inside every file", "A list of the file names on the device", "The size of the disk"], a: 1, why: "os.listdir() lists the names of the files." }
  ] },

  pg3: { kind: "PseudoTrace", data: [
    { ps: ["OPEN log.txt FOR WRITING", '    WRITE "A"', "OPEN log.txt FOR APPENDING", '    WRITE "B"', "OPEN log.txt FOR READING", "    PRINT everything in the file"],
      given: "log.txt starts with \"Old\" in it.", q: "What is printed?", opts: ["OldAB", "AB", "B"], a: 1,
      steps: [{ l: 1, vars: { file: "(empty)" } }, { l: 2, vars: { file: "A" } }, { l: 3, vars: { file: "A" } }, { l: 4, vars: { file: "AB" } }, { l: 5, vars: { file: "AB" } }, { l: 6, out: "AB" }],
      why: "Opening for writing wipes \"Old\". Appending then adds B after A." },
    { ps: ["OPEN log.txt FOR WRITING", "    FOR n FROM 1 TO 3", "        WRITE n AS TEXT", "    END FOR", "OPEN log.txt FOR READING", "    PRINT everything in the file"],
      given: "No input.", q: "What is printed?", opts: ["3", "123", "6"], a: 1,
      steps: [{ l: 1, vars: { file: "(empty)" } }, { l: 2, vars: { n: "1" } }, { l: 3, vars: { file: "1" } }, { l: 2, vars: { n: "2" } }, { l: 3, vars: { file: "12" } }, { l: 2, vars: { n: "3" } }, { l: 3, vars: { file: "123" } }, { l: 5, vars: { file: "123" } }, { l: 6, out: "123" }],
      why: "The file stays open for the whole loop, so each write adds on. Nothing is added up: 1, 2 and 3 are written as text." }
  ] },

  pg4: { kind: "Quiz", data: [
    { code: 'with open("log.txt", "r") as f:\n    f.write("Hi")', ask: "It crashes. Which line is wrong?", opts: ["Line 1: write needs \"w\" or \"a\"", "Line 2: write() should be read()", "There's no bug"], a: 0, why: "A file opened with \"r\" can only be read." },
    { code: 'with open("log.txt", "w") as f:\n    f.write(25)', ask: "It crashes with a TypeError. Which line is wrong?", opts: ["Line 1", "Line 2: write() needs a string, so use str(25)"], a: 1, why: "write() only takes strings." },
    { code: 'temp = temperature()\nwith open("log.txt", "w") as f:\n    f.write(str(temp) + "\\n")', ask: "It's run every minute but the log only ever has one reading. Which line is wrong?", opts: ["Line 1", "Line 2: use \"a\" to keep the old readings", "Line 3"], a: 1, why: "\"w\" wipes the file each time. \"a\" appends." },
    { code: 'f = open("log.txt", "r")\ntext = f.read()\nprint(text)', ask: "It works, but what's missing?", opts: ["f.close(), or use with, which closes it for you", "f.save()", "Nothing"], a: 0, why: "A file you open yourself should be closed when you're done with it." }
  ] }
};

export const challenges = {
  v: [
    { title: "About me", level: "Starter",
      steps: ["Make a variable called name holding your name.", "Make a variable called age holding your age as a number.", "Scroll the name, then the age."],
      starter: "from microbit import *\n\n# make name and age here\n",
      solution: "from microbit import *\n\nname = \"Sam\"\nage = 16\ndisplay.scroll(name)\ndisplay.scroll(age)",
      tip: "Text needs quotes; numbers don't.",
      check: run => (shown(run).length < 2 ? "Scroll two things: the name, then the age."
        : !/^\d+$/.test(shown(run)[1]) ? "The second thing shown should be the age, a number." : null) },
    { title: "Score keeper", level: "Core",
      steps: ["Start score at 0.", "Add 10 to score, then add 5.", "Scroll the final score, 15."],
      starter: "from microbit import *\n\nscore = 0\n",
      solution: "from microbit import *\n\nscore = 0\nscore = score + 10\nscore = score + 5\ndisplay.scroll(score)",
      tip: "score = score + 10 uses the old value to work out the new one.",
      check: run => expectShown(run, ["15"], "The program") }
  ],
  e: [
    { title: "Hearts until B", level: "Core",
      steps: ["In a while True: loop, show a heart.", "If button B was pressed, break out of the loop.", "After the loop, scroll \"Bye\"."],
      starter: "from microbit import *\n\nwhile True:\n    pass\n",
      solution: "from microbit import *\n\nwhile True:\n    display.show(Image.HEART)\n    if button_b.was_pressed():\n        break\n\ndisplay.scroll(\"Bye\")",
      tip: "break leaves the loop, so the code after it can run.",
      check: run => (!/while True:/.test(run.source) ? "Use a while True: loop."
        : !run.images.includes("HEART") ? "Show a heart inside the loop."
        : !run.pressed.b ? "Press B on the board to end the loop."
        : run.texts[run.texts.length - 1] !== "Bye" ? 'After the loop, scroll "Bye".' : null) },
    { title: "Left or right", level: "Stretch",
      steps: ["In a while True: loop, show ARROW_E if B was pressed.", "Use elif: if A was pressed, show ARROW_W and break out of the loop.", "Otherwise clear the screen. After the loop, scroll \"Done\"."],
      starter: "from microbit import *\n\nwhile True:\n    pass\n",
      solution: "from microbit import *\n\nwhile True:\n    if button_b.was_pressed():\n        display.show(Image.ARROW_E)\n    elif button_a.was_pressed():\n        display.show(Image.ARROW_W)\n        break\n    else:\n        display.clear()\n\ndisplay.scroll(\"Done\")",
      tip: "if, elif and else inside the event loop pick one thing to do each trip round.",
      check: run => (!/elif/.test(run.source) ? "Use elif for the second button."
        : !run.images.includes("ARROW_W") ? "Show Image.ARROW_W when A is pressed."
        : !run.images.includes("ARROW_E") ? "Show Image.ARROW_E when B is pressed."
        : run.texts[run.texts.length - 1] !== "Done" ? 'Break out of the loop and scroll "Done".' : null) }
  ],
  s: [
    { title: "Pass or fail", level: "Starter",
      steps: ["Ask for a mark with int(input()).", "If the mark is 50 or more, scroll \"Pass\".", "Otherwise scroll \"Fail\"."],
      starter: "from microbit import *\n\nmark = int(input(\"Mark? \"))\n",
      solution: "from microbit import *\n\nmark = int(input(\"Mark? \"))\nif mark >= 50:\n    display.scroll(\"Pass\")\nelse:\n    display.scroll(\"Fail\")",
      tip: "Test it with 49, 50 and 51: 50 is the boundary.",
      check: run => {
        const n = parseInt(run.inputs[0], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks for the mark.";
        return expectShown(run, [n >= 50 ? "Pass" : "Fail"], `A mark of ${n}`);
      } },
    { title: "Grade it", level: "Core",
      steps: ["Ask for a mark with int(input()).", "80 or more scrolls \"A\", 50 or more scrolls \"B\".", "Anything else scrolls \"C\"."],
      starter: "from microbit import *\n\nmark = int(input(\"Mark? \"))\n",
      solution: "from microbit import *\n\nmark = int(input(\"Mark? \"))\nif mark >= 80:\n    display.scroll(\"A\")\nelif mark >= 50:\n    display.scroll(\"B\")\nelse:\n    display.scroll(\"C\")",
      tip: "Check the highest grade first.",
      check: run => {
        const n = parseInt(run.inputs[0], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks for the mark.";
        if (!/elif/.test(run.source)) return "Use elif for the middle grade.";
        return expectShown(run, [n >= 80 ? "A" : n >= 50 ? "B" : "C"], `A mark of ${n}`);
      } }
  ],
  l: [
    { title: "Count in 5s", level: "Starter",
      steps: ["Use a for loop with range().", "Show 0, 5, 10 … all the way to 50.", "Wait a little after each number."],
      starter: "from microbit import *\n\n",
      solution: "from microbit import *\n\nfor n in range(0, 51, 5):\n    display.scroll(n)\n    sleep(200)",
      tip: "range(start, stop, step). The stop isn't included, so it has to be past 50.",
      check: run => (!usesFor(run) ? "Use a for loop with range()." : expectShown(run, nums(0, 51, 5), "The loop")) },
    { title: "Add them up", level: "Core",
      steps: ["Ask for a number n with int(input()).", "Use a loop to add up 1 to n.", "Print the total once, after the loop."],
      starter: "from microbit import *\n\nn = int(input(\"Up to? \"))\ntotal = 0\n",
      solution: "from microbit import *\n\nn = int(input(\"Up to? \"))\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(total)",
      tip: "range(1, n + 1) includes n. Typing 4 should give 1 + 2 + 3 + 4 = 10.",
      check: run => {
        const n = parseInt(run.inputs[0], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks.";
        const want = String(n * (n + 1) / 2);
        return shown(run).join() === want ? null : `Adding 1 to ${n} gives ${want}. Yours showed ${listText(shown(run))}.`;
      } }
  ],
  d: [
    { title: "Next year", level: "Starter",
      steps: ["Ask for an age with int(input()).", "Add 1 to it.", "Scroll \"Next year: \" joined to the new age."],
      starter: "from microbit import *\n\nage = input(\"Age? \")\n",
      solution: "from microbit import *\n\nage = int(input(\"Age? \"))\ndisplay.scroll(\"Next year: \" + str(age + 1))",
      tip: "int() to do the maths, then str() to join it to the text.",
      check: run => {
        const n = parseInt(run.inputs[0], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks for the age.";
        return expectShown(run, ["Next year: " + (n + 1)], `An age of ${n}`);
      } }
  ]
};
