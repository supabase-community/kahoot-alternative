-- ============================================================================
-- HackYourFuture Data Track — Week 1 Quiz
-- ============================================================================
-- 26 multiple-choice questions covering chapters 1-9 of Week 1 (Python
-- Foundations). Authored from the `## 🧠 Knowledge Check` sections of each
-- chapter. Run order matches the curriculum so the quiz doubles as a recap.
--
-- To regenerate the database from this seed:
--     supabase db reset
-- ============================================================================

insert into public.quiz_sets (id, name, description) values (
    'aaaaaaaa-bbbb-cccc-dddd-000000000001',
    'HYF Data Track — Week 1: Python Foundations',
    '26 multiple-choice questions covering chapters 1-9 (Python setup, data types, control flow, functions/modules, type hints, CLI habits, errors/debugging, logging, file operations).'
);


-- ----------------------------------------------------------------------------
-- Ch1: Python Setup
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why use a virtual environment (venv) for each Python project?',
    "order"     => 0,
    choices     => array[
        '{"body": "So different projects can pin different package versions without conflicts", "is_correct": true}'::json,
        '{"body": "To make Python run faster", "is_correct": false}'::json,
        '{"body": "To save disk space", "is_correct": false}'::json,
        '{"body": "Because Python refuses to run scripts outside a venv", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What does `source venv/bin/activate` actually do?',
    "order"     => 1,
    choices     => array[
        '{"body": "Installs the packages from requirements.txt", "is_correct": false}'::json,
        '{"body": "Updates Python to the latest version", "is_correct": false}'::json,
        '{"body": "Points your shell at the venv\u2019s Python and packages instead of the system ones", "is_correct": true}'::json,
        '{"body": "Permanently changes your default Python interpreter", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'You see `ModuleNotFoundError: pandas` even though `pip install pandas` succeeded. Most likely fix?',
    "order"     => 2,
    choices     => array[
        '{"body": "Reinstall Python", "is_correct": false}'::json,
        '{"body": "Run `Python: Select Interpreter` in VS Code and pick the one inside your venv", "is_correct": true}'::json,
        '{"body": "`pip install --force-reinstall pandas`", "is_correct": false}'::json,
        '{"body": "Restart your computer", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch2: Data Types and Variables
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'After `a = [1, 2]; b = a; b.append(3)`, what is `a`?',
    "order"     => 3,
    choices     => array[
        '{"body": "[1, 2] — only `b` was modified", "is_correct": false}'::json,
        '{"body": "[1, 2, 3] — `b = a` makes both names point at the same list object", "is_correct": true}'::json,
        '{"body": "[3] — append replaces the list", "is_correct": false}'::json,
        '{"body": "Raises a TypeError", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why is `0.1 + 0.2 == 0.3` False in Python?',
    "order"     => 4,
    choices     => array[
        '{"body": "It is a Python bug from 1991 nobody has fixed", "is_correct": false}'::json,
        '{"body": "Floats are stored in binary; 0.1 and 0.2 cannot be represented exactly, so the sum is slightly off", "is_correct": true}'::json,
        '{"body": "`==` does not work on floats; you must use `is`", "is_correct": false}'::json,
        '{"body": "Python rounds all decimals to integers internally", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Which of these is a valid Python variable name?',
    "order"     => 5,
    choices     => array[
        '{"body": "user_count", "is_correct": true}'::json,
        '{"body": "user-count", "is_correct": false}'::json,
        '{"body": "2users", "is_correct": false}'::json,
        '{"body": "class", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch3: Control Flow
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What is the truthiness of an empty list `[]` in Python?',
    "order"     => 6,
    choices     => array[
        '{"body": "True — every list is truthy", "is_correct": false}'::json,
        '{"body": "False", "is_correct": true}'::json,
        '{"body": "None", "is_correct": false}'::json,
        '{"body": "Raises a ValueError", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What is the difference between `break` and `continue`?',
    "order"     => 7,
    choices     => array[
        '{"body": "`break` exits the loop entirely; `continue` skips the rest of this iteration and moves to the next one", "is_correct": true}'::json,
        '{"body": "They are aliases for the same behaviour", "is_correct": false}'::json,
        '{"body": "`break` works in `for`, `continue` works in `while`", "is_correct": false}'::json,
        '{"body": "`continue` exits the loop; `break` skips to the next iteration", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Rewrite as a list comprehension: `squared = []; for x in range(5): squared.append(x**2)`',
    "order"     => 8,
    choices     => array[
        '{"body": "squared = [x**2 for x in range(5)]", "is_correct": true}'::json,
        '{"body": "squared = list(range(5)**2)", "is_correct": false}'::json,
        '{"body": "squared = [for x in range(5): x**2]", "is_correct": false}'::json,
        '{"body": "squared = map(x**2, range(5))", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch4: Functions and Modules
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What does `if __name__ == "__main__":` allow a single .py file to do?',
    "order"     => 9,
    choices     => array[
        '{"body": "Skip the import system entirely", "is_correct": false}'::json,
        '{"body": "Be both an importable module AND a runnable script — code in the block runs only when the file is executed directly", "is_correct": true}'::json,
        '{"body": "Run faster than a normal script", "is_correct": false}'::json,
        '{"body": "Catch all uncaught exceptions", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why is `def add_record(records=[]):` a footgun?',
    "order"     => 10,
    choices     => array[
        '{"body": "Lists are slow as default values", "is_correct": false}'::json,
        '{"body": "The default `[]` is created once at function-definition time and shared between calls — state accumulates across invocations", "is_correct": true}'::json,
        '{"body": "Python forbids list defaults", "is_correct": false}'::json,
        '{"body": "It silently drops records", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'You have `utils.py` with a function `clean()`. Which two ways correctly import and use it from `main.py`?',
    "order"     => 11,
    choices     => array[
        '{"body": "`from utils import clean` (then `clean()`) and `import utils` (then `utils.clean()`)", "is_correct": true}'::json,
        '{"body": "`include ''utils.clean''` and `require utils.clean`", "is_correct": false}'::json,
        '{"body": "Only `import utils`; `from` does not exist in Python", "is_correct": false}'::json,
        '{"body": "`using utils.clean` and `with utils.clean()`", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch5: Type Hints
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Do Python type hints prevent you from passing the wrong type at runtime?',
    "order"     => 12,
    choices     => array[
        '{"body": "Yes — Python raises TypeError when the call does not match the hint", "is_correct": false}'::json,
        '{"body": "Yes — the program will not even start", "is_correct": false}'::json,
        '{"body": "No — hints are advisory; tools like mypy and Pylance flag mismatches in the editor, but the Python interpreter ignores them at runtime", "is_correct": true}'::json,
        '{"body": "Only when running `python --strict`", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'How do you annotate a parameter that is either a `str` or `None` (Python 3.10+ form)?',
    "order"     => 13,
    choices     => array[
        '{"body": "x: str | None", "is_correct": true}'::json,
        '{"body": "x: str?", "is_correct": false}'::json,
        '{"body": "x: Maybe[str]", "is_correct": false}'::json,
        '{"body": "x: NullableString", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What does `Callable[[int, int], int]` describe?',
    "order"     => 14,
    choices     => array[
        '{"body": "A list of integers", "is_correct": false}'::json,
        '{"body": "A function that takes two `int` arguments and returns an `int`", "is_correct": true}'::json,
        '{"body": "An integer generator", "is_correct": false}'::json,
        '{"body": "A class with two int attributes", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch6: CLI Habits
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why is `input()` (asking the user to type) a bad fit for automated data pipelines?',
    "order"     => 15,
    choices     => array[
        '{"body": "It is slow", "is_correct": false}'::json,
        '{"body": "Pipelines run unattended (cron, Airflow); `input()` blocks forever waiting for a keystroke nobody will type", "is_correct": true}'::json,
        '{"body": "`input()` is deprecated in Python 3", "is_correct": false}'::json,
        '{"body": "It returns bytes instead of a string", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What does an exit code of `0` signal to the operating system?',
    "order"     => 16,
    choices     => array[
        '{"body": "The program is starting", "is_correct": false}'::json,
        '{"body": "Success — `0` means \"no error\"; any non-zero value signals a failure of some kind", "is_correct": true}'::json,
        '{"body": "Out of memory", "is_correct": false}'::json,
        '{"body": "The user cancelled the run", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What does `argparse` give you for free?',
    "order"     => 17,
    choices     => array[
        '{"body": "Faster Python startup", "is_correct": false}'::json,
        '{"body": "Auto-generated `--help`, named flags, type validation, and clear errors when the user passes garbage", "is_correct": true}'::json,
        '{"body": "Encryption of CLI arguments", "is_correct": false}'::json,
        '{"body": "Logging by default", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch7: Errors and Debugging
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'What is the difference between a `SyntaxError` and a runtime exception?',
    "order"     => 18,
    choices     => array[
        '{"body": "SyntaxError happens before any code runs (the parser rejects the file); runtime exceptions happen mid-execution", "is_correct": true}'::json,
        '{"body": "They are synonyms", "is_correct": false}'::json,
        '{"body": "SyntaxError is a warning; runtime exceptions are fatal", "is_correct": false}'::json,
        '{"body": "Only runtime exceptions can be caught with try/except", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'In a Python traceback, where do you look first to understand what went wrong?',
    "order"     => 19,
    choices     => array[
        '{"body": "The first line — that is where the error originated", "is_correct": false}'::json,
        '{"body": "The bottom — the last line names the exception type and message; the line above it points at where it happened", "is_correct": true}'::json,
        '{"body": "The middle — the deepest frame", "is_correct": false}'::json,
        '{"body": "Tracebacks are illegible; rerun with `--verbose`", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'In the VS Code debugger you are paused on a line that calls a function. You want to walk through that function''s body. Which button?',
    "order"     => 20,
    choices     => array[
        '{"body": "Step Over — skips the function and moves to the next line in the current frame", "is_correct": false}'::json,
        '{"body": "Step Into — descends into the function so you can step through its body line-by-line", "is_correct": true}'::json,
        '{"body": "Continue — runs to the next breakpoint", "is_correct": false}'::json,
        '{"body": "Restart", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch8: Logging
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why use the `logging` module instead of `print()` in a production script?',
    "order"     => 21,
    choices     => array[
        '{"body": "Logging is faster than print", "is_correct": false}'::json,
        '{"body": "Logging gives you levels (DEBUG/INFO/WARNING/ERROR), timestamps, per-module filters, and configurable output destinations; print is one dumb stream", "is_correct": true}'::json,
        '{"body": "`print` was deprecated in Python 3.10", "is_correct": false}'::json,
        '{"body": "Logging encrypts the output", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Which logging level fits the message "User logged in successfully"?',
    "order"     => 22,
    choices     => array[
        '{"body": "ERROR", "is_correct": false}'::json,
        '{"body": "WARNING", "is_correct": false}'::json,
        '{"body": "INFO", "is_correct": true}'::json,
        '{"body": "CRITICAL", "is_correct": false}'::json
    ]
);


-- ----------------------------------------------------------------------------
-- Ch9: File Operations
-- ----------------------------------------------------------------------------

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why is `with open(...) as f:` safer than manually calling `open()` and `close()`?',
    "order"     => 23,
    choices     => array[
        '{"body": "It is faster", "is_correct": false}'::json,
        '{"body": "`with` always closes the file when the block exits, even if an exception is raised — manual close can leak handles when something errors mid-read", "is_correct": true}'::json,
        '{"body": "It is the only way to read binary files", "is_correct": false}'::json,
        '{"body": "Manual `close()` is deprecated in Python 3", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'You run `open("data.txt", "w")` on a file that already has content. What happens?',
    "order"     => 24,
    choices     => array[
        '{"body": "Appends to the end", "is_correct": false}'::json,
        '{"body": "Raises FileExistsError", "is_correct": false}'::json,
        '{"body": "Truncates the file — wipes the existing contents and starts fresh", "is_correct": true}'::json,
        '{"body": "Asks for confirmation", "is_correct": false}'::json
    ]
);

select add_question (
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000001'::uuid,
    body        => 'Why use `pathlib.Path("folder") / "file.txt"` instead of the string `"folder/file.txt"`?',
    "order"     => 25,
    choices     => array[
        '{"body": "It is faster than string concatenation", "is_correct": false}'::json,
        '{"body": "It uses the right separator on Windows (\\) vs macOS/Linux (/) automatically — your code stays portable without manual string-juggling", "is_correct": true}'::json,
        '{"body": "Strings cannot represent file paths in Python 3", "is_correct": false}'::json,
        '{"body": "`pathlib` paths are encrypted on disk", "is_correct": false}'::json
    ]
);
