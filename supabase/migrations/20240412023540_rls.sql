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


alter table public.quiz_sets enable row level security;
create policy "Quiz sets are viewable by everyone" on public.quiz_sets for select using (true);

alter table public.questions enable row level security;
create policy "Questions are viewable by everyone" on public.questions for select using (true);

alter table public.choices enable row level security;
create policy "Choices are viewable by everyone" on public.choices for select using (true);

alter table public.games
  add column host_user_id uuid default auth.uid() references auth.users(id) on delete set null on update cascade;

alter table public.games enable row level security;
create policy "Choices are viewable by everyone" on public.games for select using (true);
create policy "Host can start a game" on public.games for insert with check (auth.uid() = host_user_id);
create policy "Host can update their games" on public.games for update using (auth.uid() = host_user_id) with check (auth.uid() = host_user_id);

alter table public.participants enable row level security;
create policy "Participants are viewable by everyone." on public.participants for select using (true);
create policy "Participants can insert theirselves" on public.participants for insert with check (auth.uid() = user_id);

alter table public.answers enable row level security;
create policy "Answers are viewable by everyone." on public.answers for select using (true);
create policy "Participants can insert their own answers" on public.answers for insert with check (true);

alter table public.answers add column choice_id uuid references public.choices(id) on delete set null on update cascade;

alter publication supabase_realtime add table public.answers;
