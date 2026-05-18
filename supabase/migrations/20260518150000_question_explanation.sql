-- Question-level explanation text shown to host + students during the
-- "result" phase (after the answer is revealed). Nullable so existing
-- rows are unaffected and existing `select add_question(...)` callers
-- without the new arg keep working.
--
-- Authored to be populated from per-week lesson-plan cribs in the
-- HYF curriculum repo (one short, student-facing "why" per question).
alter table public.questions
  add column if not exists explanation text;

-- Replace add_question() to accept the new optional `explanation` arg.
-- Default null preserves back-compat with every existing seed SQL.
create or replace function add_question (
  quiz_set_id uuid,
  body text,
  "order" int,
  choices json[],
  explanation text default null
) returns void language plpgsql as $$
declare
  question_id uuid;
  choice json;
begin
  insert into questions(body, "order", quiz_set_id, explanation)
  values (
    add_question.body,
    add_question."order",
    add_question.quiz_set_id,
    add_question.explanation
  )
  returning id into question_id;

  foreach choice in array choices
  loop
    insert into public.choices
        (question_id, body, is_correct)
        values (question_id, choice->>'body', (choice->>'is_correct')::boolean);
  end loop;
end;
$$ security invoker;
