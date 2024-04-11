create table if not exists public.quiz_sets (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    name text not null,
    description text
);

create table if not exists public.questions (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    body text not null,
    image_url text,
    "order" smallint not null,
    quiz_set_id uuid not null references quiz_sets(id) on delete cascade on update cascade
);

create table if not exists public.choices (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    question_id uuid not null references questions(id) on delete cascade on update cascade,
    body text not null,
    is_correct boolean default false not null
);

create table if not exists public.games (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    current_question_sequence smallint default 0 not null,
    is_answer_revealed boolean default false not null,
    phase text default 'lobby' not null,
    quiz_set_id uuid not null references quiz_sets(id) on delete cascade on update cascade
);

alter table public.games
    add constraint check_game_phase check (phase in ('lobby', 'quiz', 'result'));

create table if not exists public.participants (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    nickname text not null,
    game_id uuid not null references games(id) on delete cascade on update cascade,
    user_id uuid default auth.uid() not null references auth.users(id) on delete cascade on update cascade,
    unique (game_id, user_id)
);

create table if not exists public.answers (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    participant_id uuid default auth.uid() not null references public.participants(id) on delete cascade on update cascade,
    question_id uuid not null references public.questions(id) on delete cascade on update cascade,
    score smallint not null,
    unique (participant_id, question_id)
);

alter publication supabase_realtime add table games;
alter publication supabase_realtime add table participants;
