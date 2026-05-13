-- ============================================================================
-- Standalone Q&A board: students drop free-text questions, others upvote.
-- Independent of any specific game session — students can ask before/during/
-- after a quiz. Teacher view (/host/qa) sees the live ranked list.
-- ============================================================================

create table public.qa_questions (
    id              uuid primary key default gen_random_uuid(),
    body            text not null check (length(trim(body)) > 0 and length(body) <= 500),
    author_user_id  uuid not null default auth.uid()
                       references auth.users(id) on delete set null,
    author_nickname text not null check (length(trim(author_nickname)) > 0 and length(author_nickname) <= 30),
    created_at      timestamptz not null default now(),
    answered_at     timestamptz
);

create index qa_questions_created_at_idx on public.qa_questions (created_at desc);

create table public.qa_upvotes (
    qa_question_id uuid not null references public.qa_questions(id) on delete cascade,
    user_id        uuid not null default auth.uid()
                      references auth.users(id) on delete cascade,
    created_at     timestamptz not null default now(),
    primary key (qa_question_id, user_id)
);

-- ----------------------------------------------------------------------------
-- RLS: anyone authenticated (incl. anon sign-ins) reads everything; writes are
-- scoped to the calling user's own rows.
-- ----------------------------------------------------------------------------

alter table public.qa_questions enable row level security;

create policy "QA questions readable by all"
    on public.qa_questions for select using (true);

create policy "Authenticated can ask a question"
    on public.qa_questions for insert
    with check (auth.uid() = author_user_id);

-- The teacher (= any authenticated session, since there is no role table) can
-- mark a question as answered. Authors can edit their own body.
create policy "Author can update own question; anyone can mark answered"
    on public.qa_questions for update
    using (auth.uid() = author_user_id or auth.uid() is not null)
    with check (auth.uid() = author_user_id or auth.uid() is not null);

alter table public.qa_upvotes enable row level security;

create policy "Upvotes readable by all"
    on public.qa_upvotes for select using (true);

create policy "Authenticated can upvote"
    on public.qa_upvotes for insert
    with check (auth.uid() = user_id);

create policy "Voter can remove own upvote"
    on public.qa_upvotes for delete
    using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Realtime: both tables stream to subscribers so the student & teacher views
-- update without polling.
-- ----------------------------------------------------------------------------

alter publication supabase_realtime add table public.qa_questions;
alter publication supabase_realtime add table public.qa_upvotes;
