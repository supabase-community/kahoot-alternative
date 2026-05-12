insert into public.quiz_sets (id, name, description) values (
    'aaaaaaaa-bbbb-cccc-dddd-000000000099',
    'Demo — 1 Question Test',
    'Single-question quiz for testing the live quiz flow end-to-end before class.'
) on conflict do nothing;

select add_question(
    quiz_set_id => 'aaaaaaaa-bbbb-cccc-dddd-000000000099'::uuid,
    body        => 'What does a data pipeline do?',
    "order"     => 0,
    choices     => array[
        '{"body": "Moves and transforms data from a source to a destination", "is_correct": true}'::json,
        '{"body": "Stores data permanently in a spreadsheet", "is_correct": false}'::json,
        '{"body": "Deletes duplicate rows from a database", "is_correct": false}'::json,
        '{"body": "Converts Python code to SQL", "is_correct": false}'::json
    ]
);
