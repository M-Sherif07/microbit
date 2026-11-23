// Content for Practice 2: three client scenarios, each needing every topic in the course.
// Each topic is one scenario. Its `reqs` are the client's requirements (shown as R1, R2 … on the
// page), and every activity brief says which requirements it covers.
// Same shape as loops-lab/content.js. Run `npm run check` after editing.
//
// The simulator runs variables, if/elif/else, while and for loops, int(), str() and input(),
// but not def, lists, len(), string methods or files. Activities that run code (Predict,
// HowMany, BugHunt fixes, challenges) stick to those; functions, lists and files are tested
// with Quiz, PseudoTrace, PseudoBug and PseudoCloze.
import { P_, IO_, D_, W_, CH_ } from "../../lib/flowchart.js";
import { MB_HEAD } from "../../lib/python.js";
import { shown, expectShown, usesFor } from "../../lib/checks.js";

export const meta = {
  "slug": "practice-assessment-2",
  "brand": "ICTPRG302 Practice 2",
  "title": "Practice 2",
  "key": "ictprg302-assessment2-progress",
  "chKey": "ictprg302-assessment2-challenges",
  "next": {
    "href": "../index.html",
    "label": "Back to all labs →"
  },
  "psKeywords": [
    "WHILE",
    "FOR",
    "EACH",
    "FOREVER",
    "FUNCTION",
    "RETURN",
    "OPEN",
    "WRITING",
    "READING",
    "APPENDING"
  ]
};

export const topics = [
  {
    "id": "greenhouse",
    "label": "Greenhouse",
    "eyebrow": "Scenario 1",
    "title": "Greenhouse monitor",
    "lead": "Over the long weekend the school greenhouse overheated, and the community garden lost a whole tray of seedlings. Nobody found out until Tuesday. The garden coordinator wants a micro:bit on the potting bench that warns anyone walking past when it's too hot or too cold. It should also keep a record, so next time they can see what happened while the school was empty.",
    "reqs": [
      "Read the temperature every 10 seconds, for as long as the micro:bit is switched on.",
      "Over 30 °C, scroll \"HOT\". Under 10 °C, scroll \"COLD\". Otherwise show a happy face.",
      "Keep every reading in a list.",
      "When button A is pressed, scroll the average of the readings, worked out by a function, as \"Avg: 22\".",
      "When button B is pressed, save the readings to readings.txt, one per line, without losing readings saved earlier."
    ],
    "acts": [
      { "id": "g1", "tag": "Question 1", "title": "Plan from the brief", "brief": "Pick the Python feature that meets each requirement. Covers R1 to R5. Answer all of them correctly to finish." },
      { "id": "g2", "tag": "Question 2", "title": "Follow the flowchart", "brief": "This is the monitor's event loop. Answer each decision for the temperature given. Covers R1 and R2.", "roundLabel": "Chart", "nextLabel": "Next chart →" },
      { "id": "g3", "tag": "Question 3", "title": "Dry run the average", "brief": "Predict what the average function gives, then watch the trace table fill in. Covers R3 and R4.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "g4", "tag": "Question 4", "title": "Read the code", "brief": "Pieces of the finished program. Pick what each one does. Covers R3 to R5. Answer all of them correctly to finish." },
      { "id": "g5", "tag": "Question 5", "title": "Spot the bug", "brief": "The first version of the monitor has bugs. Click the line, then choose the fix. Covers R1 and R2.", "roundLabel": "Bug", "nextLabel": "Next bug →" },
      { "id": "g6", "tag": "Question 6", "title": "Complete the plan", "brief": "Fill the blanks so the plan for saving the readings meets R5.", "roundLabel": "Plan", "nextLabel": "Next plan →" }
    ],
    "real": {
      "key": "g",
      "title": "Greenhouse tasks",
      "intro": "Build parts of the monitor. The simulator's temperature sensor reads 21 °C."
    }
  },
  {
    "id": "laps",
    "label": "Lap counter",
    "eyebrow": "Scenario 2",
    "title": "Cross-country lap counter",
    "lead": "Marshals at the school cross-country carnival count laps on clipboards, and every year a few counts go missing. This year the PE department is trying one micro:bit per runner, clipped to the marshal's lanyard. The marshal presses a button each time the runner comes past. When the race is over, the runner's laps and fastest lap go into a results file that all the counters share.",
    "reqs": [
      "At the start, ask for the runner's name and store it in capitals.",
      "Each time the runner passes, the marshal presses button B: add 1 to the lap count and show it.",
      "After 4 laps, scroll \"FINISHED\" and stop counting.",
      "Keep each lap time, in seconds, in a list, and use a function to find the fastest lap.",
      "When button A is pressed, add a line like MIA,4,95 to results.txt, keeping every other runner's result."
    ],
    "acts": [
      { "id": "c1", "tag": "Question 7", "title": "Plan from the brief", "brief": "Pick the Python feature that meets each requirement. Covers R1 to R5. Answer all of them correctly to finish." },
      { "id": "c2", "tag": "Question 8", "title": "How many laps?", "brief": "Work out how many times each version of the lap loop runs. Only one meets R3. Type your answer, then run it.", "roundLabel": "Version", "nextLabel": "Next version →" },
      { "id": "c3", "tag": "Question 9", "title": "Dry run the fastest lap", "brief": "Predict what the fastest-lap function returns, then watch the trace table fill in. Covers R4.", "roundLabel": "Plan", "nextLabel": "Next plan →" },
      { "id": "c4", "tag": "Question 10", "title": "Predict the output", "brief": "Pieces of the lap counter. Pick what each one prints, then run it. Covers R2 to R4.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "c5", "tag": "Question 11", "title": "Read the code", "brief": "Strings, lists and the results file. Pick what each piece does. Covers R1, R4 and R5. Answer all of them correctly to finish." },
      { "id": "c6", "tag": "Question 12", "title": "Spot the bug", "brief": "Testing at a practice run found these bugs. Click the line, then choose the fix. Covers R2 and R3.", "roundLabel": "Bug", "nextLabel": "Next bug →" }
    ],
    "real": {
      "key": "c",
      "title": "Lap counter tasks",
      "intro": "In the simulator, press B on the board for each lap."
    }
  },
  {
    "id": "buzzer",
    "label": "Quiz buzzer",
    "eyebrow": "Scenario 3",
    "title": "Trivia club buzzer",
    "lead": "Arguments about who buzzed first have taken over the library's lunchtime trivia club. The librarian has asked for two micro:bit buttons as team buzzers, with the scores on the screen where everyone can see them. The micro:bit gets unplugged at the end of every lunch, so the season's results have to be saved in a file.",
    "reqs": [
      "At the start, ask the quizmaster how many points win the game.",
      "In the game loop, button A gives Team A a point and button B gives Team B a point. Show the scores after each point.",
      "The first team to reach the target wins: stop the game and scroll \"A WINS\" or \"B WINS\".",
      "Keep a list of who scored each point, like [\"A\", \"B\", \"B\"], and use a function to count one team's points from it.",
      "At the end of each game, add a line like A 5 - B 3 to season.txt. Never wipe earlier games."
    ],
    "acts": [
      { "id": "q1", "tag": "Question 13", "title": "Plan from the brief", "brief": "Pick the Python feature that meets each requirement. Covers R1 to R5. Answer all of them correctly to finish." },
      { "id": "q2", "tag": "Question 14", "title": "Follow the flowchart", "brief": "Play a short game, first to 2. Answer each decision as the buzzer goes round its loop. Covers R2 and R3.", "roundLabel": "Chart", "nextLabel": "Next chart →" },
      { "id": "q3", "tag": "Question 15", "title": "Predict the output", "brief": "Pieces of the scoreboard. Pick what each one prints, then run it. Covers R2, R3 and R5.", "roundLabel": "Program", "nextLabel": "Next program →" },
      { "id": "q4", "tag": "Question 16", "title": "Read the code", "brief": "The points list, the counting function and the season file. Covers R4 and R5. Answer all of them correctly to finish." },
      { "id": "q5", "tag": "Question 17", "title": "Spot the bug", "brief": "The trivia club found these bugs in the first week. Click the line, then choose the fix. Covers R1 to R3.", "roundLabel": "Bug", "nextLabel": "Next bug →" },
      { "id": "q6", "tag": "Question 18", "title": "Find the error in the plan", "brief": "Each plan has one mistake that breaks a requirement. Click the line, then choose the fix.", "roundLabel": "Plan", "nextLabel": "Next plan →" }
    ],
    "real": {
      "key": "q",
      "title": "Buzzer tasks",
      "intro": "In the simulator, press A and B on the board to score points."
    }
  }
];

export const activities = {
  /* ---------- Scenario 1: Greenhouse monitor ---------- */
  g1: { kind: "Quiz", data: [
    { code: "", ask: "R1: read the temperature every 10 seconds, for as long as it's switched on.", opts: ["for i in range(10):", "while True: with sleep(10000) inside", "if temperature() > 10:"], a: 1, why: "It has to run forever, so it's an event loop. sleep() takes milliseconds: 10 seconds is 10000." },
    { code: "", ask: "R2: HOT over 30, COLD under 10, otherwise a happy face.", opts: ["if / elif / else", "Three separate if statements", "A for loop"], a: 0, why: "Exactly one of the three should happen. if / elif / else picks one; three separate ifs could also run the happy face when it's hot." },
    { code: "", ask: "R3: keep every reading.", opts: ["A variable called temp, set each time", "A list, with readings.append(temp)", "A string, with + temp"], a: 1, why: "A single variable only holds the latest reading. A list keeps them all, in order." },
    { code: "", ask: "R4: the average, worked out by a function.", opts: ["def average(readings): that returns total / len(readings)", "def average(): that prints the readings", "A variable called average set to 0"], a: 0, why: "The function takes the list as a parameter and returns the answer, so the event loop can scroll it." },
    { code: "", ask: "R4: scroll the average as \"Avg: 22\".", opts: ['"Avg: " + avg', '"Avg: " + str(avg)', 'int("Avg: ") + avg'], a: 1, why: "You can only join a string to a string. str() turns the number into text." },
    { code: "", ask: "R5: save the readings without losing ones saved earlier.", opts: ['open("readings.txt", "w")', 'open("readings.txt", "r")', 'open("readings.txt", "a")'], a: 2, why: "\"a\" appends to the end. \"w\" would wipe Friday's readings when you save on Saturday." }
  ] },

  g2: { kind: "FlowTrace", data: [
    { chart: { loop: true, loopLabel: "while True: loop again", body: [P_("temp = temperature()"), CH_([[D_("temp > 30?"), IO_('Scroll "HOT"', { scroll: "HOT" })], [D_("temp < 10?"), IO_('Scroll "COLD"', { scroll: "COLD" })]], IO_("Show HAPPY", { img: "HAPPY" })), P_("Wait 10 seconds")] },
      situation: "Saturday: a hot afternoon, then a cold night, then a mild morning", visits: [
        { q: "2 pm: temp is 34. Is temp > 30?", a: true, hint: "34 is more than 30." },
        { q: "3 am: temp is 8. Is temp > 30?", a: false, hint: "8 is nowhere near 30." },
        { q: "Is temp < 10?", a: true, hint: "8 is less than 10." },
        { q: "9 am: temp is 22. Is temp > 30?", a: false, hint: "22 isn't more than 30." },
        { q: "Is temp < 10?", a: false, hint: "22 isn't less than 10, so else runs." }],
      why: "Each trip round reads a new temperature, then exactly one of HOT, COLD or the happy face runs." },
    { chart: { loop: true, loopLabel: "while True: loop again", body: [P_("temp = temperature()"), CH_([[D_("temp > 30?"), IO_('Scroll "HOT"', { scroll: "HOT" })], [D_("temp < 10?"), IO_('Scroll "COLD"', { scroll: "COLD" })]], IO_("Show HAPPY", { img: "HAPPY" })), P_("Wait 10 seconds")] },
      situation: "Testing the boundaries: exactly 30, then exactly 10", visits: [
        { q: "temp is 30. Is temp > 30?", a: false, hint: "30 isn't more than itself." },
        { q: "Is temp < 10?", a: false, hint: "30 isn't less than 10." },
        { q: "temp is 10. Is temp > 30?", a: false, hint: "10 isn't more than 30." },
        { q: "Is temp < 10?", a: false, hint: "10 isn't less than itself." }],
      why: "R2 says \"over 30\" and \"under 10\", so exactly 30 and exactly 10 both get the happy face. Always test the boundaries." }
  ] },

  g3: { kind: "PseudoTrace", data: [
    { ps: ["FUNCTION average WITH readings", "    SET total TO 0", "    FOR EACH t IN readings", "        ADD t TO total", "    END FOR", "    RETURN total / LENGTH(readings)", "END FUNCTION", "SET avg TO average([20, 24, 22])", 'SCROLL "Avg: " + avg'],
      given: "Three readings: 20, 24 and 22.", q: "What scrolls?", opts: ["Avg: 66", "Avg: 22", "Avg: 3"], a: 1,
      steps: [{ l: 8 }, { l: 2, vars: { total: "0" } }, { l: 3, vars: { t: "20" } }, { l: 4, vars: { total: "20" } }, { l: 3, vars: { t: "24" } }, { l: 4, vars: { total: "44" } }, { l: 3, vars: { t: "22" } }, { l: 4, vars: { total: "66" } }, { l: 6, check: "66 / 3 → 22" }, { l: 8, vars: { avg: "22" } }, { l: 9, out: "Avg: 22" }],
      why: "The loop adds up all three readings (66), then RETURN divides by how many there are (3)." },
    { ps: ["FUNCTION average WITH readings", "    SET total TO 0", "    FOR EACH t IN readings", "        ADD t TO total", "    END FOR", "    RETURN total / LENGTH(readings)", "END FUNCTION", "SET avg TO average([31, 29])", 'SCROLL "Avg: " + avg'],
      given: "Two readings: 31 and 29.", q: "What scrolls?", opts: ["Avg: 30", "Avg: 60", "Avg: 29"], a: 0,
      steps: [{ l: 8 }, { l: 2, vars: { total: "0" } }, { l: 3, vars: { t: "31" } }, { l: 4, vars: { total: "31" } }, { l: 3, vars: { t: "29" } }, { l: 4, vars: { total: "60" } }, { l: 6, check: "60 / 2 → 30" }, { l: 8, vars: { avg: "30" } }, { l: 9, out: "Avg: 30" }],
      why: "The same function works for any number of readings, because LENGTH(readings) counts them." }
  ] },

  g4: { kind: "Quiz", data: [
    { code: "readings = []\nwhile True:\n    temp = temperature()\n    readings.append(temp)\n    sleep(10000)", ask: "The first three readings are 21, 23 and 25. What is readings after 3 trips?", opts: ["[25]", "[21, 23, 25]", "[25, 23, 21]"], a: 1, why: "append() adds each new reading to the end, so the list keeps them in order." },
    { code: "readings = []\nwhile True:\n    readings = []\n    readings.append(temperature())\n    sleep(10000)", ask: "Why does the average only ever use one reading?", opts: ["append() only works once", "readings = [] is inside the loop, so the list is emptied every trip", "sleep() deletes the list"], a: 1, why: "Create the list once, before the loop." },
    { code: "def average(readings):\n    total = 0\n    for t in readings:\n        total = total + t\n    return total / len(readings)\n\nprint(average([20, 25]))", ask: "What is printed?", opts: ["22", "22.5", "45"], a: 1, why: "45 / 2 is 22.5. In Python, / always gives a float." },
    { code: "if button_a.was_pressed():\n    avg = average(readings)\n    display.scroll(\"Avg: \" + str(round(avg)))", ask: "Why is round() there?", opts: ["To scroll Avg: 23 instead of Avg: 22.5", "To make the average more accurate", "Because str() needs a whole number"], a: 0, why: "round() gives a whole number, which is easier to read as it scrolls past." },
    { code: "if button_a.was_pressed():\n    avg = average(readings)", ask: "Someone presses A before the first reading is taken. What happens?", opts: ["It scrolls Avg: 0", "ZeroDivisionError: len(readings) is 0", "Nothing happens"], a: 1, why: "An empty list has length 0, and you can't divide by 0. Check len(readings) > 0 first." },
    { code: "if button_b.was_pressed():\n    with open(\"readings.txt\", \"a\") as f:\n        for t in readings:\n            f.write(str(t) + \"\\n\")\n    readings = []", ask: "Why empty the list after saving?", opts: ["So the next save doesn't write the same readings again", "Because the file can't hold numbers", "To make the average 0"], a: 0, why: "Without it, every press of B appends all the old readings a second time." }
  ] },

  g5: { kind: "BugHunt", data: [
    { goal: "At 21 °C, show a happy face.", symptom: "At 21 °C it scrolls HOT.",
      lines: ["from microbit import *", "", "temp = temperature()", "if temp < 30:", '    display.scroll("HOT")', "elif temp < 10:", '    display.scroll("COLD")', "else:", "    display.show(Image.HAPPY)"],
      bug: "if temp < 30:", fixes: ["if temp > 30:", "if temp <= 30:", "if temp == 30:"], why: "HOT is for over 30, so the comparison is >.", out: [{ img: "HAPPY", ms: 700 }] },
    { goal: "Take a reading every 10 seconds.", symptom: "A new reading scrolls straight after the last one, not every 10 seconds.",
      lines: ["from microbit import *", "", "while True:", "    temp = temperature()", "    display.scroll(temp)", "    sleep(10)"],
      bug: "    sleep(10)", fixes: ["    sleep(10000)", "    sleep(10 * 60)", "    sleep(1)"], why: "sleep() counts in milliseconds. 10 seconds is 10 × 1000 = 10000.", out: ["21", "21"] },
    { goal: "Scroll Temp: 21.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nTypeError: can't convert 'int' object to str implicitly",
      lines: ["from microbit import *", "", "temp = temperature()", 'display.scroll("Temp: " + temp)'],
      bug: 'display.scroll("Temp: " + temp)', fixes: ['display.scroll("Temp: " + str(temp))', 'display.scroll("Temp: " + int(temp))', 'display.scroll("Temp: " + "temp")'], why: "temperature() gives a number. str() turns it into text so it can be joined.", out: ["Temp: 21"] }
  ] },

  g6: { kind: "PseudoCloze", data: [
    { goal: "R5: when B is pressed, add every reading to readings.txt, one per line, keeping what's there.",
      ps: ["IF button B was pressed THEN", "    OPEN readings.txt FOR {{APPENDING|WRITING|READING}}", "    FOR EACH t IN {{readings|temp|readings.txt}}", '        WRITE t AS TEXT AND "⏎"', "    END FOR", "END IF"],
      py: ["if button_b.was_pressed():", '    with open("readings.txt", "a") as f:', "        for t in readings:", '            f.write(str(t) + "\\n")'], why: "APPENDING keeps the earlier readings. The loop goes through the list, not the file." },
    { goal: "R2: HOT over 30, COLD under 10, otherwise a happy face.",
      ps: ["SET temp TO the temperature", "IF temp {{> 30|>= 30|< 30}} THEN", '    SCROLL "HOT"', "{{ELSE IF|IF|ELSE}} temp < 10 THEN", '    SCROLL "COLD"', "ELSE", "    SHOW HAPPY", "END IF"],
      py: ["temp = temperature()", "if temp > 30:", '    display.scroll("HOT")', "elif temp < 10:", '    display.scroll("COLD")', "else:", "    display.show(Image.HAPPY)"], why: "\"Over 30\" means > 30. ELSE IF makes sure only one message shows." }
  ] },

  /* ---------- Scenario 2: Lap counter ---------- */
  c1: { kind: "Quiz", data: [
    { code: "", ask: "R1: ask for the runner's name and store it in capitals.", opts: ['name = input("Name? ").upper()', 'name = int(input("Name? "))', 'name = "NAME"'], a: 0, why: "input() gives a string and .upper() turns it into capitals: mia becomes MIA." },
    { code: "", ask: "R2: add 1 to the lap count each time B is pressed.", opts: ["if button_b.is_pressed(): laps = 1", "if button_b.was_pressed(): laps = laps + 1", "laps = button_b + 1"], a: 1, why: "was_pressed() counts each press once. laps = laps + 1 adds to the old count." },
    { code: "", ask: "R3: stop counting after 4 laps.", opts: ["while laps < 4:", "while laps <= 4:", "for laps in range(4):"], a: 0, why: "The loop keeps waiting for presses while laps is under 4, and ends when the 4th lap is counted. A for loop wouldn't wait for presses." },
    { code: "", ask: "R4: keep each lap time.", opts: ["lap_time = lap_time + t", "times.append(t)", "times = t"], a: 1, why: "A list keeps every lap time, so the function can look through them all." },
    { code: "", ask: "R4: find the fastest lap with a function.", opts: ["def fastest(times): that returns the smallest time", "def fastest(): that prints 4", "A variable called fastest"], a: 0, why: "The list goes in as a parameter and the answer comes back with return." },
    { code: "", ask: "R5: add the result without losing other runners' results.", opts: ['open("results.txt", "w")', 'open("results.txt", "a")', 'open("results.txt", "r")'], a: 1, why: "Every runner's micro:bit adds a line. \"w\" would wipe the runners before them." }
  ] },

  c2: { kind: "HowMany", data: [
    { lines: ["laps = 0", "while laps < 4:", "    laps = laps + 1", "    display.show(laps)"], answer: 4, why: "laps is 0, 1, 2, 3 when it's checked. This one meets R3." },
    { lines: ["laps = 0", "while laps <= 4:", "    laps = laps + 1", "    display.show(laps)"], answer: 5, why: "<= 4 lets it run when laps is 4 too, so it counts a 5th lap." },
    { lines: ["laps = 1", "while laps < 4:", "    laps = laps + 1", "    display.show(laps)"], answer: 3, why: "Starting at 1 means one lap is counted before the runner has run it." },
    { lines: ["laps = 0", "while laps != 4:", "    laps = laps + 2", "    display.show(laps)"], answer: 2, why: "Going up in 2s happens to land on 4, but it only runs twice: it's counting two laps per press." }
  ] },

  c3: { kind: "PseudoTrace", data: [
    { ps: ["FUNCTION fastest WITH times", "    SET best TO 999", "    FOR EACH t IN times", "        IF t < best THEN", "            SET best TO t", "        END IF", "    END FOR", "    RETURN best", "END FUNCTION", "SET quickest TO fastest([102, 95, 99])", 'SCROLL "Best: " + quickest + "s"'],
      given: "Mia's lap times: 102, 95 and 99 seconds.", q: "What scrolls?", opts: ["Best: 102s", "Best: 95s", "Best: 99s"], a: 1,
      steps: [{ l: 10 }, { l: 2, vars: { best: "999" } }, { l: 3, vars: { t: "102" } }, { l: 4, check: "102 < 999 → True" }, { l: 5, vars: { best: "102" } }, { l: 3, vars: { t: "95" } }, { l: 4, check: "95 < 102 → True" }, { l: 5, vars: { best: "95" } }, { l: 3, vars: { t: "99" } }, { l: 4, check: "99 < 95 → False" }, { l: 8 }, { l: 10, vars: { quickest: "95" } }, { l: 11, out: "Best: 95s" }],
      why: "best starts higher than any real lap. Each faster lap replaces it, so the smallest time is left at the end." },
    { ps: ["FUNCTION fastest WITH times", "    SET best TO 999", "    FOR EACH t IN times", "        IF t < best THEN", "            SET best TO t", "        END IF", "    END FOR", "    RETURN best", "END FUNCTION", "SET quickest TO fastest([88, 91, 90])", 'SCROLL "Best: " + quickest + "s"'],
      given: "Jay's lap times: 88, 91 and 90 seconds.", q: "What scrolls?", opts: ["Best: 90s", "Best: 91s", "Best: 88s"], a: 2,
      steps: [{ l: 10 }, { l: 2, vars: { best: "999" } }, { l: 3, vars: { t: "88" } }, { l: 4, check: "88 < 999 → True" }, { l: 5, vars: { best: "88" } }, { l: 3, vars: { t: "91" } }, { l: 4, check: "91 < 88 → False" }, { l: 3, vars: { t: "90" } }, { l: 4, check: "90 < 88 → False" }, { l: 8 }, { l: 10, vars: { quickest: "88" } }, { l: 11, out: "Best: 88s" }],
      why: "Jay's first lap was the fastest, so best never changes after it." }
  ] },

  c4: { kind: "Predict", data: [
    { lines: ["laps = 0", "for i in range(4):", "    laps = laps + 1", "    if laps == 4:", '        print("FINISHED")', "    else:", "        print(laps)"], opts: ["1 2 3 4", "1 2 3 FINISHED", "0 1 2 3 FINISHED"], a: 1, why: "On the 4th lap the if is True, so FINISHED is printed instead of 4." },
    { lines: ["best = 100", "lap = 95", "if lap < best:", "    best = lap", 'print("Best: " + str(best) + "s")'], opts: ["Best: 100s", "Best: 95s", "Best: best s"], a: 1, why: "95 is faster than 100, so best is replaced. str() lets it join onto the text." },
    { lines: ['runner = "MIA"', "laps = 4", "best = 95", 'print(runner + "," + str(laps) + "," + str(best))'], opts: ["MIA,4,95", "MIA 4 95", "runner,laps,best"], a: 0, why: "This is the R5 results line. The commas are joined in as text, with no spaces." },
    { lines: ["total = 0", "total = total + 102", "total = total + 95", "total = total + 99", "print(total)"], opts: ["99", "296", "102 95 99"], a: 1, why: "A running total: 102 + 95 + 99 = 296 seconds for the whole race." }
  ] },

  c5: { kind: "Quiz", data: [
    { code: 'name = input("Name? ").upper()\nprint(name)', ask: "The marshal types mia. What is printed?", opts: ["mia", "Mia", "MIA"], a: 2, why: ".upper() makes every letter a capital, which meets R1." },
    { code: "times = [102, 95, 99]\nprint(len(times))", ask: "What is printed?", opts: ["3", "296", "99"], a: 0, why: "len() counts the items in the list: three lap times." },
    { code: "times = [102, 95, 99]\nprint(times[0])", ask: "What is printed?", opts: ["95", "102", "99"], a: 1, why: "Index 0 is the first lap." },
    { code: "times = [102, 95, 99]\nprint(min(times))", ask: "Python has a built-in that does the same job as the fastest() function. What does this print?", opts: ["102", "95", "3"], a: 1, why: "min() gives the smallest item. Writing fastest() yourself shows how it works." },
    { code: 'line = name + "," + str(laps) + "," + str(best)\nwith open("results.txt", "a") as f:\n    f.write(line + "\\n")', ask: "Why is \"\\n\" added to the end?", opts: ["So each runner's result is on its own line", "To make the file save faster", "Because write() needs it"], a: 0, why: "Without \\n, the next runner's result would start on the same line." },
    { code: 'with open("results.txt", "r") as f:\n    rows = f.readlines()\nprint(len(rows))', ask: "results.txt has a line for each of 12 runners. What is printed?", opts: ["1", "12", "0"], a: 1, why: "readlines() gives a list with one string per line, so len() counts the runners." }
  ] },

  c6: { kind: "BugHunt", data: [
    { goal: "Scroll FINISHED after the 4th lap.", symptom: "  File \"main.py\", line 5\nSyntaxError: invalid syntax",
      lines: ["from microbit import *", "", "laps = 3", "laps = laps + 1", "if laps = 4:", '    display.scroll("FINISHED")'],
      bug: "if laps = 4:", fixes: ["if laps == 4:", "if laps => 4:", "if (laps = 4):"], why: "= stores a value; == compares two values. laps goes from 3 to 4, so FINISHED scrolls.", out: ["FINISHED"] },
    { goal: "Count a lap only when the marshal presses B.", symptom: "FINISHED scrolls straight away, before anyone presses B.",
      lines: ["from microbit import *", "", "laps = 0", "while laps < 4:", "    if button_b.was_pressed():", "        display.show(Image.ARROW_N)", "    laps = laps + 1", 'display.scroll("FINISHED")'],
      bug: "    laps = laps + 1", fixes: ["        laps = laps + 1", "    laps = laps - 1", "    laps == laps + 1"], why: "The update has to be indented under the if, so it only runs when B is pressed. Here it runs every trip round the loop.", out: [{ img: "ARROW_N", ms: 400 }, { img: "ARROW_N", ms: 400 }, { img: "ARROW_N", ms: 400 }, { img: "ARROW_N", ms: 400 }, "FINISHED"] },
    { goal: "Show Laps: 3 on the screen.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 4, in <module>\nTypeError: can't convert 'int' object to str implicitly",
      lines: ["from microbit import *", "", "laps = 3", 'display.scroll("Laps: " + laps)'],
      bug: 'display.scroll("Laps: " + laps)', fixes: ['display.scroll("Laps: " + str(laps))', 'display.scroll("Laps: " + int(laps))', 'display.scroll("Laps: " + "laps")'], why: "str() turns the number into text so it can be joined.", out: ["Laps: 3"] }
  ] },

  /* ---------- Scenario 3: Trivia buzzer ---------- */
  q1: { kind: "Quiz", data: [
    { code: "", ask: "R1: ask how many points win the game.", opts: ['target = input("Points to win? ")', 'target = int(input("Points to win? "))', "target = 5"], a: 1, why: "input() gives a string. int() turns it into a number so it can be compared with the scores." },
    { code: "", ask: "R2 and R3: keep checking the buttons until a team reaches the target.", opts: ["while a < target and b < target:", "while a < target or b < target:", "for i in range(target):"], a: 0, why: "The game goes on only while both teams are under the target. With or, it would keep going after one team had won." },
    { code: "", ask: "R3: once the loop ends, which message?", opts: ['if a == target: scroll "A WINS", else scroll "B WINS"', 'Always scroll "A WINS"', 'A for loop over the scores'], a: 0, why: "The loop ended because one team reached the target. One if / else works out which." },
    { code: "", ask: "R4: keep a record of who scored each point.", opts: ['history.append("A") when A scores', 'history = "A"', "history = history + 1"], a: 0, why: "append() adds each point to the end of the list, so the whole game is kept in order." },
    { code: "", ask: "R4: count one team's points from the list with a function.", opts: ["def count_points(history, team): that returns how many times team appears", "def count_points(): that scrolls the score", "print(history)"], a: 0, why: "Two parameters: the list to look through, and which team to count." },
    { code: "", ask: "R5: add each game to the season record.", opts: ['open("season.txt", "w")', 'open("season.txt", "a")', 'open("season.txt", "r")'], a: 1, why: "\"a\" adds a line and keeps every earlier game." }
  ] },

  q2: { kind: "FlowTrace", data: [
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("a = 0, b = 0, target = 2")], body: [W_(D_("a < target and\nb < target?")), CH_([[D_("A pressed?"), P_("a = a + 1")], [D_("B pressed?"), P_("b = b + 1")]]), IO_("Show scores")], post: [IO_('Scroll the winner', { scroll: "A WINS" })] },
      situation: "First to 2. Team A buzzes, then Team B, then Team A again.", visits: [
        { q: "a is 0, b is 0. Are both under 2?", a: true, hint: "0 and 0 are both less than 2." },
        { q: "Team A buzzes. Was A pressed?", a: true, hint: "Team A pressed their buzzer." },
        { q: "a is 1, b is 0. Are both under 2?", a: true, hint: "1 and 0 are both less than 2." },
        { q: "Team B buzzes. Was A pressed?", a: false, hint: "It was B this time." },
        { q: "Was B pressed?", a: true, hint: "Team B pressed their buzzer." },
        { q: "a is 1, b is 1. Are both under 2?", a: true, hint: "1 and 1 are both less than 2." },
        { q: "Team A buzzes again. Was A pressed?", a: true, hint: "Team A pressed again." },
        { q: "a is 2, b is 1. Are both under 2?", a: false, hint: "a is 2, and 2 isn't less than 2." }],
      why: "The and condition becomes False the moment either team reaches 2, so the game ends and the winner scrolls." },
    { chart: { loop: true, loopLabel: "while: check again", pre: [P_("a = 0, b = 0, target = 1")], body: [W_(D_("a < target and\nb < target?")), CH_([[D_("A pressed?"), P_("a = a + 1")], [D_("B pressed?"), P_("b = b + 1")]]), IO_("Show scores")], post: [IO_('Scroll the winner', { scroll: "B WINS" })] },
      situation: "Sudden death, first to 1. Nobody buzzes, then Team B buzzes.", visits: [
        { q: "a is 0, b is 0. Are both under 1?", a: true, hint: "0 is less than 1." },
        { q: "Nobody buzzes. Was A pressed?", a: false, hint: "Nobody pressed anything." },
        { q: "Was B pressed?", a: false, hint: "Nobody pressed anything." },
        { q: "Still 0 and 0. Are both under 1?", a: true, hint: "Nothing has changed." },
        { q: "Team B buzzes. Was A pressed?", a: false, hint: "It was B." },
        { q: "Was B pressed?", a: true, hint: "Team B buzzed." },
        { q: "a is 0, b is 1. Are both under 1?", a: false, hint: "b is 1, and 1 isn't less than 1." }],
      why: "Trips where nobody buzzes just go round again. That's the event loop waiting for something to happen." }
  ] },

  q3: { kind: "Predict", data: [
    { lines: ["a = 2", "b = 3", "target = 3", "if a == target:", '    print("A WINS")', "elif b == target:", '    print("B WINS")', "else:", '    print("Keep going")'], opts: ["A WINS", "B WINS", "Keep going"], a: 1, why: "a isn't 3, but b is, so the elif runs." },
    { lines: ["a = 0", "b = 0", "for i in range(5):", "    if i % 2 == 0:", "        a = a + 1", "    else:", "        b = b + 1", "print(a, b)"], opts: ["2 3", "3 2", "5 0"], a: 1, why: "i is 0, 1, 2, 3, 4. The even ones (0, 2, 4) go to A: 3 points to 2." },
    { lines: ["a = 5", "b = 3", 'print("A " + str(a) + " - B " + str(b))'], opts: ["A 5 - B 3", "A5-B3", "A a - B b"], a: 0, why: "This is the R5 season line. The spaces are inside the strings." },
    { lines: ["a = 1", "b = 1", "target = 3", "while a < target and b < target:", "    a = a + 1", "print(a, b)"], opts: ["3 1", "2 1", "3 3"], a: 0, why: "Only a goes up here. When a reaches 3, a < 3 is False, so the and is False and the loop stops." }
  ] },

  q4: { kind: "Quiz", data: [
    { code: 'history = []\nhistory.append("A")\nhistory.append("B")\nhistory.append("B")', ask: "What is history now?", opts: ['["A", "B", "B"]', '["B", "B", "A"]', '["B"]'], a: 0, why: "Each append() adds to the end, so the list is in the order the points were scored." },
    { code: 'def count_points(history, team):\n    n = 0\n    for p in history:\n        if p == team:\n            n = n + 1\n    return n\n\nprint(count_points(["A", "B", "B", "A", "B"], "B"))', ask: "What is printed?", opts: ["2", "3", "5"], a: 1, why: "The loop looks at every point and counts the ones that are \"B\": three of them." },
    { code: 'history = ["A", "B", "B", "A", "B"]\nprint(history[-1])', ask: "What is printed?", opts: ["A", "B", "5"], a: 1, why: "-1 is the last item: who scored the winning point." },
    { code: 'with open("season.txt", "a") as f:\n    f.write("A " + str(a) + " - B " + str(b) + "\\n")', ask: "season.txt already has 3 games in it. How many lines does it have after this runs?", opts: ["1", "3", "4"], a: 2, why: "\"a\" adds one line to the end and keeps the three already there." },
    { code: 'with open("season.txt", "r") as f:\n    games = f.readlines()\ndisplay.scroll("Game " + str(len(games) + 1))', ask: "season.txt has 4 lines. What scrolls when the micro:bit starts?", opts: ["Game 4", "Game 5", "Game 1"], a: 1, why: "4 games have been played, so this is game 5. It still works after being unplugged, because the file keeps the record." },
    { code: 'with open("season.txt", "w") as f:\n    f.write("A 5 - B 3\\n")', ask: "What goes wrong if the program uses this at the end of each game?", opts: ["Nothing", "Each game wipes the season record, so only the last game is kept", "It can't write numbers"], a: 1, why: "\"w\" starts the file again from empty. R5 needs \"a\"." }
  ] },

  q5: { kind: "BugHunt", data: [
    { goal: "Ask for the target and compare the scores with it.", symptom: "Traceback (most recent call last):\n  File \"main.py\", line 5, in <module>\nTypeError: unsupported types for __lt__: 'int', 'str'",
      lines: ["from microbit import *", "", 'target = input("Points to win? ")', "a = 0", "if a < target:", '    display.scroll("Play!")'],
      bug: 'target = input("Points to win? ")', fixes: ['target = int(input("Points to win? "))', 'target = str(input("Points to win? "))', 'target = input(int("Points to win? "))'], why: "input() gives a string. int() turns it into a number you can compare.", out: ["Play!"] },
    { goal: "End the game as soon as either team reaches 3.", symptom: "Team A reaches 3 but the game keeps going until Team B gets there too.",
      lines: ["from microbit import *", "", "a = 0", "b = 0", "while a < 3 or b < 3:", "    if button_a.was_pressed():", "        a = a + 1", "    if button_b.was_pressed():", "        b = b + 1", 'display.scroll("Game over")'],
      bug: "while a < 3 or b < 3:", fixes: ["while a < 3 and b < 3:", "while a < 3:", "while a <= 3 or b <= 3:"], why: "or stays True while either team is under 3. and becomes False as soon as one team reaches it.", out: ["Game over"] },
    { goal: "Scroll the right winner.", symptom: "Team B wins 3 to 1, but it scrolls A WINS.",
      lines: ["from microbit import *", "", "a = 1", "b = 3", "if a > b:", '    display.scroll("A WINS")', "else:", '    display.scroll("A WINS")'],
      bug: 8, fixes: ['    display.scroll("B WINS")', '    display.scroll(b)', '    display.scroll("WINS")'], why: "The else branch is for when A didn't win. Copying and pasting the if branch left the wrong team in it.", out: ["B WINS"] }
  ] },

  q6: { kind: "PseudoBug", data: [
    { goal: "R5: add each game to season.txt, keeping every earlier game.", symptom: "On Friday, season.txt only has Friday's game in it.",
      ps: ["OPEN season.txt FOR WRITING", '    WRITE "A " + a + " - B " + b + "⏎"'],
      bug: "OPEN season.txt FOR WRITING", fixes: ["OPEN season.txt FOR APPENDING", "OPEN season.txt FOR READING", "OPEN results.txt FOR WRITING"], why: "WRITING starts the file again. APPENDING adds to the end." },
    { goal: "R4: count how many points one team scored.", symptom: "It always gives 1 or 0.",
      ps: ["FUNCTION count_points WITH history, team", "    SET n TO 0", "    FOR EACH p IN history", "        IF p = team THEN", "            SET n TO 1", "        END IF", "    END FOR", "    RETURN n", "END FUNCTION"],
      bug: "            SET n TO 1", fixes: ["            ADD 1 TO n", "            SET n TO 0", "            RETURN n"], why: "SET n TO 1 replaces the count each time. ADD 1 TO n keeps a running count." },
    { goal: "R3: stop the game when a team reaches the target.", symptom: "The game never ends.",
      ps: ["SET a TO 0", "SET b TO 0", "REPEAT WHILE a < target AND b < target", "    IF button A was pressed THEN", "        SET a TO 0", "    END IF", "    IF button B was pressed THEN", "        ADD 1 TO b", "    END IF", "END REPEAT"],
      bug: "        SET a TO 0", fixes: ["        ADD 1 TO a", "        ADD 1 TO b", "        SET a TO target"], why: "A press has to add a point. SET a TO 0 throws Team A's points away, so if Team B never buzzes, the game can't end." }
  ] }
};

export const challenges = {
  g: [
    { title: "Warning light", level: "Starter",
      steps: ["Read the temperature into a variable called temp.", "Over 30, scroll \"HOT\". Under 10, scroll \"COLD\".", "Otherwise show a happy face. (R2)"],
      starter: "from microbit import *\n\ntemp = temperature()\n",
      solution: "from microbit import *\n\ntemp = temperature()\nif temp > 30:\n    display.scroll(\"HOT\")\nelif temp < 10:\n    display.scroll(\"COLD\")\nelse:\n    display.show(Image.HAPPY)",
      tip: "The simulator reads 21 °C, so you should see the happy face. Change the numbers in your conditions to test the other branches.",
      check: run => (!/elif/.test(run.source) ? "Use if, elif and else so only one message shows."
        : !/temperature\(\)/.test(run.source) ? "Read the sensor with temperature()."
        : run.images[run.images.length - 1] !== "HAPPY" ? "At 21 °C it should show a happy face: display.show(Image.HAPPY)" : null) },
    { title: "Reading log", level: "Core",
      steps: ["Use a for loop to take 5 readings.", "Each time, scroll \"Temp: \" joined to the reading.", "After the loop, scroll \"Done\". (R1)"],
      starter: "from microbit import *\n\n",
      solution: "from microbit import *\n\nfor i in range(5):\n    temp = temperature()\n    display.scroll(\"Temp: \" + str(temp))\n    sleep(1000)\n\ndisplay.scroll(\"Done\")",
      tip: "The real monitor uses while True and sleep(10000). A for loop keeps the test short.",
      check: run => (!usesFor(run) ? "Use a for loop with range(5)."
        : expectShown(run, ["Temp: 21", "Temp: 21", "Temp: 21", "Temp: 21", "Temp: 21", "Done"], "The log")) }
  ],
  c: [
    { title: "Count the laps", level: "Core",
      steps: ["Start laps at 0.", "While laps is under 4, add 1 and show laps each time B is pressed. (R2)", "After the loop, scroll \"FINISHED\". (R3)"],
      starter: "from microbit import *\n\nlaps = 0\n",
      solution: "from microbit import *\n\nlaps = 0\nwhile laps < 4:\n    if button_b.was_pressed():\n        laps = laps + 1\n        display.show(laps)\n\ndisplay.scroll(\"FINISHED\")",
      tip: "The update goes inside the if, so a lap only counts when B is pressed.",
      check: run => (!run.pressed.b ? "Press B on the board for each lap."
        : expectShown(run, ["1", "2", "3", "4", "FINISHED"], "Pressing B four times")) },
    { title: "Runner card", level: "Starter",
      steps: ["Ask for the runner's name with input().", "Ask for the number of laps with int(input()).", "Scroll the name, then \": \", then the laps, then \" laps\". For example: Mia: 4 laps"],
      starter: "from microbit import *\n\nname = input(\"Name? \")\n",
      solution: "from microbit import *\n\nname = input(\"Name? \")\nlaps = int(input(\"Laps? \"))\ndisplay.scroll(name + \": \" + str(laps) + \" laps\")",
      tip: "laps is a number, so it needs str() to join onto the text.",
      check: run => {
        if (run.inputs.length < 2) return "Ask two questions with input(): the name, then the laps.";
        const n = parseInt(run.inputs[1], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks for the laps.";
        return expectShown(run, [`${run.inputs[0]}: ${n} laps`], "The runner card");
      } }
  ],
  q: [
    { title: "Points to win", level: "Starter",
      steps: ["Ask how many points win with int(input()). (R1)", "Scroll \"First to \" joined to the target.", "For example: First to 5"],
      starter: "from microbit import *\n\ntarget = input(\"Points to win? \")\n",
      solution: "from microbit import *\n\ntarget = int(input(\"Points to win? \"))\ndisplay.scroll(\"First to \" + str(target))",
      tip: "int() to make it a number, str() to join it onto the text.",
      check: run => {
        const n = parseInt(run.inputs[0], 10);
        if (Number.isNaN(n)) return "Type a whole number when input() asks for the target.";
        if (!/int\(/.test(run.source)) return "Turn the answer into a number with int(input(...)).";
        return expectShown(run, ["First to " + n], `A target of ${n}`);
      } },
    { title: "Buzzers", level: "Stretch",
      steps: ["Start a and b at 0. Loop while both are under 3.", "A adds 1 to a, B adds 1 to b. Show a after A scores and b after B scores. (R2)", "After the loop, scroll \"A WINS\" or \"B WINS\". (R3)"],
      starter: "from microbit import *\n\na = 0\nb = 0\n",
      solution: "from microbit import *\n\na = 0\nb = 0\nwhile a < 3 and b < 3:\n    if button_a.was_pressed():\n        a = a + 1\n        display.show(a)\n    if button_b.was_pressed():\n        b = b + 1\n        display.show(b)\n\nif a == 3:\n    display.scroll(\"A WINS\")\nelse:\n    display.scroll(\"B WINS\")",
      tip: "and makes the game stop as soon as either team reaches 3.",
      check: run => {
        const last = shown(run)[shown(run).length - 1];
        if (!/ and /.test(run.source)) return "Loop while a < 3 and b < 3.";
        if (last !== "A WINS" && last !== "B WINS") return 'After the loop, scroll "A WINS" or "B WINS".';
        if (run.pressed.a >= 3 && run.pressed.b >= 3) return null; // both pressed 3+ times: either could have got there first
        const want = run.pressed.a >= 3 ? "A WINS" : "B WINS";
        return last === want ? null : `Team ${want[0]} reached 3 first, so it should scroll ${want}.`;
      } }
  ]
};
