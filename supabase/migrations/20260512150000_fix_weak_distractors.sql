-- Replace obviously-wrong distractors (encryption myths, "Reinstall Python",
-- "deprecated in Python 3" lies, "It is slow/faster" non-answers, and
-- "only way" absolutes) with plausible-but-incorrect alternatives that
-- actually require knowledge to dismiss.

-- argparse "Encryption of CLI arguments"
UPDATE public.choices SET body = 'A GUI window with input fields for each argument'
WHERE id = '73742073-9ee5-47dc-aebe-52c81b7edabc';

-- ETL "Encrypt, Translate, Log"
UPDATE public.choices SET body = 'Evaluate, Test, Launch'
WHERE id = 'e4f06631-1f9e-4be3-abd8-7db4b6df35ba';

-- input() bad for pipelines: "deprecated in Python 3"
UPDATE public.choices SET body = 'Automated schedulers like cron run as a different OS user, so `input()` prompts go to the wrong terminal'
WHERE id = '255dee19-8a9f-47bd-9165-e33d29aadfa5';

-- input() bad for pipelines: "It is slow"
UPDATE public.choices SET body = '`input()` returns a string but pipeline data is usually numeric, causing a type mismatch'
WHERE id = '98014c73-3f93-4b59-b608-b629e7f8f21f';

-- product.price vs product["price"]: "Dictionaries are deprecated in Python 3.12"
UPDATE public.choices SET body = '`product["price"]` always returns a string even when the value is a number'
WHERE id = 'e5657850-a390-4c0c-a138-1853640015c3';

-- with open: "It is faster"
UPDATE public.choices SET body = '`with` loads the entire file into memory up front, so reads inside the block are instant'
WHERE id = '8090354f-fba6-42c9-a341-4abd170065c4';

-- with open: "It is the only way to read binary files"
UPDATE public.choices SET body = '`with` acquires an exclusive lock on the file so other processes cannot read it at the same time'
WHERE id = 'be43cbd4-27e6-4fa9-8e66-0b5e5e14e5ba';

UPDATE public.choices SET body = '`with` acquires an exclusive lock on the file so other processes cannot read it at the same time'
WHERE id = 'be43cbd4-2e30-4fa9-8e66-0b5e5e14e5ba';

-- with open alt IDs (use body match as fallback)
UPDATE public.choices
SET body = '`with` acquires an exclusive lock on the file so other processes cannot read it at the same time'
WHERE body = 'It is the only way to read binary files' AND is_correct = false;

-- with open: "Manual close() is deprecated in Python 3"
UPDATE public.choices
SET body = 'Calling `open()` without `with` buffers all writes in RAM until the program exits'
WHERE body = 'Manual `close()` is deprecated in Python 3' AND is_correct = false;

-- with open: "with automatically encrypts the file contents"
UPDATE public.choices
SET body = '`with` compresses the file on close to save disk space'
WHERE body = '`with` automatically encrypts the file contents' AND is_correct = false;

-- with open: "with is the only way to read text files in Python 3"
UPDATE public.choices
SET body = '`with` releases the GIL so other threads can write to the file concurrently'
WHERE body = '`with` is the only way to read text files in Python 3' AND is_correct = false;

-- pathlib: "String paths stopped working in Python 3.12"
UPDATE public.choices
SET body = 'String paths raise a `TypeError` when passed to functions that expect `bytes`-like objects'
WHERE body = 'String paths stopped working in Python 3.12' AND is_correct = false;

-- pathlib: "It is faster than string concatenation"
UPDATE public.choices
SET body = '`pathlib` validates that the path exists before returning it, raising `FileNotFoundError` early'
WHERE body = 'It is faster than string concatenation' AND is_correct = false;

-- pathlib: "pathlib paths are encrypted on disk"
UPDATE public.choices
SET body = '`Path` objects URL-encode spaces in directory names so the OS never sees a space in a path'
WHERE body = '`pathlib` paths are encrypted on disk' AND is_correct = false;

-- logging: "Logging encrypts the output"
UPDATE public.choices
SET body = '`logging` writes to a background thread so log calls never block the pipeline'
WHERE body = 'Logging encrypts the output' AND is_correct = false;

-- logging: "print was deprecated in Python 3.10"
UPDATE public.choices
SET body = '`print` raises `BrokenPipeError` when the terminal closes; `logging` silently discards the message'
WHERE body = '`print` was deprecated in Python 3.10' AND is_correct = false;

-- config.py: "config.py automatically encrypts the values"
UPDATE public.choices
SET body = '`config.py` caches each value in a module-level dict so `os.environ` is only read once per run'
WHERE body = '`config.py` automatically encrypts the values it reads' AND is_correct = false;

-- argparse: "It encrypts the arguments so other users cannot see them"
UPDATE public.choices
SET body = '`argparse` stores parsed values in `os.environ` so subprocesses inherit them automatically'
WHERE body = 'It encrypts the arguments so other users on the machine cannot see them' AND is_correct = false;

-- argparse: "It is the only way to read command-line arguments in Python 3.10+"
UPDATE public.choices
SET body = '`sys.argv` only works from a terminal; `argparse` also handles arguments passed via environment variables'
WHERE body = 'It is the only way to read command-line arguments in Python 3.10+' AND is_correct = false;

-- ModuleNotFoundError: "Reinstall Python" (appears in 2 quiz sets)
UPDATE public.choices
SET body = 'Delete `__pycache__` — it holds stale bytecode that overrides the installed package'
WHERE body = 'Reinstall Python' AND is_correct = false;

-- ModuleNotFoundError: "Restart your computer" (appears in 2 quiz sets)
UPDATE public.choices
SET body = 'Run `pip install --upgrade pandas` — the installed version is too old to import'
WHERE body = 'Restart your computer' AND is_correct = false;

-- input() bad for pipelines: "It is slow" (catch-all for any remaining instance)
UPDATE public.choices
SET body = '`input()` only works if `sys.stdin` is a TTY; file-based redirects raise an `EOFError`'
WHERE body = 'It is slow' AND is_correct = false;

-- with open: "It is faster" (catch-all)
UPDATE public.choices
SET body = '`with` loads the entire file into memory up front, so reads inside the block are instant'
WHERE body = 'It is faster' AND is_correct = false;
