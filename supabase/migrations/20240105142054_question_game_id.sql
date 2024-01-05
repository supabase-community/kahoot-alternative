alter table public.questions add column game_id uuid not null references public.games(id) on delete cascade on update cascade;

create index questions_game_id_index on public.questions(game_id);