/* Plan It, Code It: the three client briefs, with a model answer for every step.
   Test inputs are comma-separated, one value for each input() call. Expected output is
   what the micro:bit shows, separated by " | ". Tests marked given show their expected
   result to students; for the rest, students work it out from the brief.
   npm run check runs every model solution against every test. */
export const SCENARIOS = [
  {
    id: "cinema", tab: "Cinema tickets", level: "Selection: if / elif / else",
    ticket: "Sunset Cinemas · Job 01", title: "Ticket price kiosk",
    lead: "One input, five possible answers. Plan the decisions in the right order before you write any Python.",
    brief: `<p>Sunset Cinemas wants a micro:bit kiosk in the foyer. A customer types their age and the kiosk scrolls the ticket price.</p>
      <ul>
        <li>Under 5: <b>Free</b></li>
        <li>5 to 15: <b>$12</b> (child)</li>
        <li>16 to 64: <b>$18</b> (adult)</li>
        <li>65 and over: <b>$10</b> (senior)</li>
      </ul>
      <p>An age below 0 or above 120 is a typing mistake. The kiosk scrolls <b>Check age</b> instead of a price.</p>`,
    ipo: { in: "The customer's age, a whole number typed in.", proc: "Check the age isn't below 0, then that it isn't above 120. Then compare it with the band edges 5, 16 and 65, starting from the youngest band.", out: "One message: Free, $12, $18, $10 or Check age." },
    pseudo: `INPUT age
IF age < 0 THEN
    DISPLAY "Check age"
ELSE IF age > 120 THEN
    DISPLAY "Check age"
ELSE IF age < 5 THEN
    DISPLAY "Free"
ELSE IF age < 16 THEN
    DISPLAY "$12"
ELSE IF age < 65 THEN
    DISPLAY "$18"
ELSE
    DISPLAY "$10"
END IF`,
    pseudoNeeds: [
      [/^\s*INPUT\b/m, "INPUT the age at the start"],
      [/ELSE IF/i, "ELSE IF for each price band after the first"],
      [/\b0\b[\s\S]*\b120\b|\b120\b[\s\S]*\b0\b/, "Catches typing mistakes: below 0 or above 120"],
      [/\b5\b/, "Uses the age 5 (free / child edge)"],
      [/\b1[56]\b/, "Uses the child / adult edge (15 or 16)"],
      [/\b6[45]\b/, "Uses the adult / senior edge (64 or 65)"],
      [/free/i, "DISPLAYs Free"], [/\$12/, "DISPLAYs $12"], [/\$18/, "DISPLAYs $18"], [/\$10/, "DISPLAYs $10"], [/check age/i, "DISPLAYs Check age"]
    ],
    flow: [
      { k: "input", t: "Input age" },
      { k: "decision", t: "age < 0?", yes: [{ k: "output", t: "Scroll \"Check age\"" }], no: [
        { k: "decision", t: "age > 120?", yes: [{ k: "output", t: "Scroll \"Check age\"" }], no: [
          { k: "decision", t: "age < 5?", yes: [{ k: "output", t: "Scroll \"Free\"" }], no: [
            { k: "decision", t: "age < 16?", yes: [{ k: "output", t: "Scroll \"$12\"" }], no: [
              { k: "decision", t: "age < 65?", yes: [{ k: "output", t: "Scroll \"$18\"" }], no: [{ k: "output", t: "Scroll \"$10\"" }] }
            ] }
          ] }
        ] }
      ] }
    ],
    flowNeeds: [
      [s => s.input >= 1, "An Input step for the age"],
      [s => s.decision >= 5, "5 decisions: too low?, too high?, and one for each of the 3 band edges"],
      [s => s.output >= 5, "An Output step for each result: Free, $12, $18, $10 and Check age"]
    ],
    code: `from microbit import *

age = int(input("Age: "))
if age < 0:
    display.scroll("Check age")
elif age > 120:
    display.scroll("Check age")
elif age < 5:
    display.scroll("Free")
elif age < 16:
    display.scroll("$12")
elif age < 65:
    display.scroll("$18")
else:
    display.scroll("$10")`,
    runIn: "30",
    hints: {
      understand: ["How many things does the customer type in? That's your input list.", "Count every different message the kiosk can scroll. The brief lists five.", "Processing is the comparing. Which numbers in the brief are the edges between two prices?"],
      pseudo: ["Start with INPUT age. Everything after it decides what to DISPLAY.", "Deal with typing mistakes first: IF age < 0 THEN, then ELSE IF age > 120 THEN. Both DISPLAY \"Check age\".", "Then check the bands youngest first: ELSE IF age < 5 THEN, then ELSE IF age < 16 THEN, and so on.", "The last band (65 and over) needs no question. It goes under ELSE. Finish with one END IF."],
      flow: ["Each line of your pseudocode becomes one shape. INPUT and DISPLAY are parallelograms.", "Each IF or ELSE IF becomes a decision. Add the next decision on the No branch of the one before it.", "ELSE has no decision of its own. It's what goes on the last No branch."],
      code: ["Read the age with age = int(input(\"Age: \")). Without int() you can't compare it with a number.", "IF … THEN becomes if …:, ELSE IF becomes elif …:, and each line inside is indented 4 spaces.", "Check the spelling and capitals in each display.scroll(\"…\"). The tests compare the exact words."],
      test: ["Fill in Expected from the brief, not from your code. What does a 5-year-old pay?", "An edge test sits exactly on a number from the brief (5, 16, 65). That's where mistakes like < instead of <= show up.", "For your own test, try 0 or 120: the edges of the ages that are allowed."]
    },
    tests: [
      { in: "30", exp: "$18", given: true, why: "A normal adult" },
      { in: "70", exp: "$10", given: true, why: "A normal senior" },
      { in: "4", exp: "Free", why: "Just under the child edge" },
      { in: "5", exp: "$12", why: "Exactly on the child edge" },
      { in: "15", exp: "$12", why: "Last child age" },
      { in: "16", exp: "$18", why: "First adult age" },
      { in: "64", exp: "$18", why: "Last adult age" },
      { in: "65", exp: "$10", why: "First senior age" },
      { in: "-1", exp: "Check age", why: "Invalid: too low" },
      { in: "121", exp: "Check age", why: "Invalid: too high" }
    ]
  },
  {
    id: "canteen", tab: "Canteen till", level: "Loops with a running total",
    ticket: "Ridgeview High Canteen · Job 02", title: "Canteen order till",
    lead: "The number of inputs depends on the first input. Plan the loop and the running total before you code.",
    brief: `<p>The school canteen wants a micro:bit till. The staff member types how many items are in the order, then the price of each item in whole dollars. The till adds up the prices.</p>
      <ul>
        <li>Orders of $30 or more get $5 off.</li>
        <li>The till then scrolls the total, for example <b>Total $27</b>.</li>
        <li>If the staff member types 0 items (or less), the till scrolls <b>No items</b> and asks for nothing else.</li>
      </ul>`,
    ipo: { in: "The number of items, then one price per item (whole dollars).", proc: "Check there is at least 1 item. Start a total at 0 and add each price in a loop. If the total is 30 or more, take 5 off.", out: "Total $<amount>, or No items." },
    pseudo: `INPUT items
IF items <= 0 THEN
    DISPLAY "No items"
ELSE
    SET total TO 0
    FOR i FROM 1 TO items
        INPUT price
        SET total TO total + price
    END FOR
    IF total >= 30 THEN
        SET total TO total - 5
    END IF
    DISPLAY "Total $" + total
END IF`,
    pseudoNeeds: [
      [/(^\s*INPUT\b[\s\S]*){2}/m, "Two INPUTs: the number of items, and each price"],
      [/^\s*(FOR|REPEAT)\b/m, "A FOR or REPEAT loop to ask for each price"],
      [/SET\s+\w+\s+TO\s+0\b/i, "Starts the total at 0 (SET total TO 0)"],
      [/\b30\b/, "Checks for orders of $30 or more"],
      [/-\s*5\b|\b5\s+off|SUBTRACT\s+5/i, "Takes $5 off"],
      [/no items/i, "DISPLAYs No items"],
      [/"Total \$|Total \$/i, "DISPLAYs Total $ and the amount"]
    ],
    flow: [
      { k: "input", t: "Input items" },
      { k: "decision", t: "items <= 0?", yes: [{ k: "output", t: "Scroll \"No items\"" }], no: [
        { k: "process", t: "total = 0" },
        { k: "loop", t: "For each item (range(items))", body: [
          { k: "input", t: "Input price" },
          { k: "process", t: "total = total + price" }
        ] },
        { k: "decision", t: "total >= 30?", yes: [{ k: "process", t: "total = total - 5" }], no: [] },
        { k: "output", t: "Scroll \"Total $\" + total" }
      ] }
    ],
    flowNeeds: [
      [s => s.input >= 2, "Two Input steps: the number of items, and the price"],
      [s => s.loop >= 1 && s.inputInLoop >= 1, "The price Input sits inside a loop, so it's asked once per item"],
      [s => s.process >= 2, "Process steps that set the total to 0 and add each price"],
      [s => s.decision >= 2, "Two decisions: any items at all? and total $30 or more?"],
      [s => s.output >= 2, "Output steps for Total $... and No items"]
    ],
    code: `from microbit import *

items = int(input("Items: "))
if items <= 0:
    display.scroll("No items")
else:
    total = 0
    for i in range(items):
        price = int(input("Price: "))
        total = total + price
    if total >= 30:
        total = total - 5
    display.scroll("Total $" + str(total))`,
    runIn: "2, 4, 6",
    hints: {
      understand: ["There are two kinds of input. One is typed once, the other once per item.", "The till has to remember a running total. What number does it start at?", "There are two possible messages: Total $… and No items."],
      pseudo: ["Check for an empty order first: IF items <= 0 THEN DISPLAY \"No items\".", "Under ELSE, SET total TO 0 before the loop, not inside it.", "Inside FOR i FROM 1 TO items: INPUT price, then SET total TO total + price.", "After END FOR, check the discount: IF total >= 30 THEN SET total TO total - 5."],
      flow: ["SET total TO 0 is a Process rectangle. INPUT price is a parallelogram.", "Put the price input and the adding step under the loop's \"Repeat these steps\".", "The discount decision goes after the loop. Its No branch can stay empty."],
      code: ["FOR i FROM 1 TO items becomes for i in range(items):. The loop runs items times.", "Join text and a number with str(): \"Total $\" + str(total).", "If you get a TypeError, check you used int() around every input()."]
      ,
      test: ["Add up the prices yourself, then take $5 off if the total is 30 or more.", "One test totals exactly $30. Does $30 get the discount? Re-read the brief.", "For your own test, try more items, or a total of $31."]
    },
    tests: [
      { in: "2, 4, 6", exp: "Total $10", given: true, why: "A small order" },
      { in: "4, 5, 5, 5, 5", exp: "Total $20", given: true, why: "More items, no discount" },
      { in: "2, 15, 14", exp: "Total $29", why: "Total $29: just under the discount" },
      { in: "2, 15, 15", exp: "Total $25", why: "Total $30: exactly on the discount" },
      { in: "3, 10, 10, 11", exp: "Total $26", why: "Over the discount" },
      { in: "1, 30", exp: "Total $25", why: "One item that earns the discount" },
      { in: "0", exp: "No items", why: "Empty order" },
      { in: "-2", exp: "No items", why: "Invalid item count" }
    ]
  },
  {
    id: "locker", tab: "PIN locker", level: "Loops with break",
    ticket: "Peak Fitness Gym · Job 03", title: "Locker PIN lock",
    lead: "The program repeats until something happens: the right PIN, or three wrong tries. Plan how the loop ends.",
    brief: `<p>A gym locker is guarded by a micro:bit. The PIN is <b>2580</b>. The user types a PIN.</p>
      <ul>
        <li>Right PIN: scroll <b>Unlocked</b> and stop asking.</li>
        <li>Wrong PIN: scroll <b>Wrong</b> and let them try again.</li>
        <li>They get 3 tries. After the third wrong try, scroll <b>Locked</b> and stop asking.</li>
      </ul>`,
    ipo: { in: "A PIN, typed up to 3 times.", proc: "Count the tries. Compare each PIN with 2580. Leave the loop when it matches or when the count reaches 3.", out: "Wrong after each wrong PIN, then Unlocked or Locked." },
    pseudo: `SET tries TO 0
REPEAT FOREVER
    INPUT pin
    SET tries TO tries + 1
    IF pin = 2580 THEN
        DISPLAY "Unlocked"
        STOP REPEATING
    END IF
    DISPLAY "Wrong"
    IF tries = 3 THEN
        DISPLAY "Locked"
        STOP REPEATING
    END IF
END REPEAT`,
    pseudoNeeds: [
      [/SET\s+\w+\s+TO\s+0\b/i, "Starts a try counter at 0"],
      [/^\s*(REPEAT|FOR)\b/m, "A REPEAT (or FOR) loop"],
      [/^\s+INPUT\b/m, "INPUT pin is indented inside the loop"],
      [/2580/, "Compares with the PIN 2580"],
      [/\b3\b/, "Allows 3 tries"],
      [/STOP REPEATING|REPEAT WHILE|REPEAT UNTIL|FOR\s+\w+\s+FROM/i, "Says how the loop ends (STOP REPEATING, or a loop condition)"],
      [/unlocked/i, "DISPLAYs Unlocked"], [/wrong/i, "DISPLAYs Wrong"], [/\blocked\b/i, "DISPLAYs Locked"]
    ],
    flow: [
      { k: "process", t: "tries = 0" },
      { k: "loop", t: "Repeat forever", body: [
        { k: "input", t: "Input pin" },
        { k: "process", t: "tries = tries + 1" },
        { k: "decision", t: "pin == 2580?", yes: [{ k: "output", t: "Scroll \"Unlocked\"" }, { k: "break", t: "Stop repeating" }], no: [] },
        { k: "output", t: "Scroll \"Wrong\"" },
        { k: "decision", t: "tries == 3?", yes: [{ k: "output", t: "Scroll \"Locked\"" }, { k: "break", t: "Stop repeating" }], no: [] }
      ] }
    ],
    flowNeeds: [
      [s => s.loop >= 1 && s.inputInLoop >= 1, "A loop with the PIN Input inside it"],
      [s => s.process >= 2, "Process steps that set tries to 0 and add 1 each time"],
      [s => s.decision >= 2, "Two decisions: is the PIN right? and was that the third try?"],
      [s => s.brk >= 1 || s.loopCond >= 1, "A Stop repeating step, or a loop condition, so the loop can end"],
      [s => s.output >= 3, "Output steps for Unlocked, Wrong and Locked"]
    ],
    code: `from microbit import *

tries = 0
while True:
    pin = int(input("PIN: "))
    tries = tries + 1
    if pin == 2580:
        display.scroll("Unlocked")
        break
    display.scroll("Wrong")
    if tries == 3:
        display.scroll("Locked")
        break`,
    runIn: "1234, 2580",
    hints: {
      understand: ["The user may type a PIN once, twice or three times. It's one input, asked again and again.", "Something has to count the tries. That's part of the processing.", "There are three messages: Wrong, Unlocked and Locked."],
      pseudo: ["SET tries TO 0 before the loop. Inside REPEAT FOREVER, INPUT pin and add 1 to tries.", "IF pin = 2580 THEN DISPLAY \"Unlocked\" and STOP REPEATING, then END IF.", "If the program gets past that IF, the PIN was wrong: DISPLAY \"Wrong\".", "Last, IF tries = 3 THEN DISPLAY \"Locked\" and STOP REPEATING."],
      flow: ["Use a Loop shape with the words Repeat forever. Everything that happens on each try goes inside it.", "End each Yes branch that finishes the program with a Stop repeating step.", "There are two decisions inside the loop. Both of their No branches can stay empty."],
      code: ["REPEAT FOREVER becomes while True:, and STOP REPEATING becomes break.", "To test whether two values are equal, use ==, not =.", "If a test says the program asked for more input, your loop isn't stopping after 3 tries."],
      test: ["Follow the brief one try at a time. Write each message the micro:bit shows, separated by |.", "After 3 wrong tries the program must stop, even if a 4th PIN is typed.", "For your own test, try a PIN that's close but wrong, like 2508."]
    },
    tests: [
      { in: "2580", exp: "Unlocked", given: true, why: "Right first time" },
      { in: "1234, 2580", exp: "Wrong | Unlocked", given: true, why: "Right on the second try" },
      { in: "1, 2, 2580", exp: "Wrong | Wrong | Unlocked", why: "Right on the last try" },
      { in: "1, 2, 3", exp: "Wrong | Wrong | Wrong | Locked", why: "Three wrong tries" },
      { in: "1, 2, 3, 2580", exp: "Wrong | Wrong | Wrong | Locked", why: "Must not allow a 4th try" },
      { in: "2581, 2580", exp: "Wrong | Unlocked", why: "Off by one digit" }
    ]
  }
];

export const STEPS = [["understand", "Understand"], ["pseudo", "Pseudocode"], ["flow", "Flowchart"], ["code", "Code"], ["test", "Test"]];
export const KINDS = [
  ["input", "Input ▱"], ["output", "Output ▱"], ["process", "Process ▭"],
  ["decision", "Decision ◇"], ["loop", "Loop ↻"], ["break", "Stop repeating"]
];
export const PLACEHOLDER = {
  input: "e.g. Input age", output: "e.g. Scroll \"Free\"", process: "e.g. total = 0",
  decision: "e.g. age < 5?", loop: "e.g. Repeat forever, or tries < 3?", break: "Stop repeating"
};
