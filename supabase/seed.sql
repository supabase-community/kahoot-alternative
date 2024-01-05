insert into public.games
    (id)
    values ('bb2ddb95-f632-48bd-a042-eb07b3f7ef8d');

insert into public.questions 
    (id, body, "order", game_id) 
    values ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'What database does Supabase use?', 0, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d');

insert into public.choices
    (question_id, body, is_correct)
    values ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'PostgreSQL', true),
           ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'MySQL', false),
           ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'MongoDB', false),
           ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'SQLite', false);
