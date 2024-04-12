create or replace function add_question (
  quiz_set_id uuid,
  body text,
  "order" int,
  choices json[] -- i.e. [{"body": "Postgres", "is_correct": true},{"body": "MySQL", "is_correct": false}]
) returns void language plpgsql as $$
declare
  question_id uuid;
  choice json;
begin
  insert into questions(body, "order", quiz_set_id)
  values (add_question.body, add_question."order", add_question.quiz_set_id)
  returning id into question_id;

  foreach choice in array choices
  loop 
    insert into public.choices
        (question_id, body, is_correct)
        values (question_id, choice->>'body', (choice->>'is_correct')::boolean);
  end loop;
end;
$$ security invoker;