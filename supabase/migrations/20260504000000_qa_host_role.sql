-- ============================================================================
-- Tighten Q&A authorisation:
--   1. Students can only update / delete their OWN question.
--   2. Anyone visiting the teacher view (/host/qa) self-claims a host
--      privilege via the claim_qa_host() RPC; that uid is then allowed to
--      mark any question as answered through the host_mark_answered() RPC.
--      Hosts cannot edit the question body or delete questions — only flip
--      the answered_at flag.
--
-- Trade-off: the host URL must not be shared with students. Anyone who
-- visits /host/qa becomes a host. This is acceptable for a classroom tool
-- where the URL is private to the teacher. A hardened version would gate
-- claim_qa_host() behind an external secret.
-- ============================================================================

-- Replace the previous overly-permissive UPDATE policy ("anyone authenticated
-- can update") with a strictly-authored one.
drop policy if exists "Author can update own question; anyone can mark answered"
    on public.qa_questions;

create policy "Author can update own question"
    on public.qa_questions for update
    using (auth.uid() = author_user_id)
    with check (auth.uid() = author_user_id);

-- ----------------------------------------------------------------------------
-- qa_hosts: opt-in registry of users granted teacher privileges.
-- Reads are open so the UI can show "you are host" indicators; writes go
-- through the security-definer RPC only.
-- ----------------------------------------------------------------------------

create table if not exists public.qa_hosts (
    user_id    uuid primary key default auth.uid()
                  references auth.users(id) on delete cascade,
    claimed_at timestamptz not null default now()
);

alter table public.qa_hosts enable row level security;
create policy "Hosts list readable by all"
    on public.qa_hosts for select using (true);
-- No INSERT/UPDATE/DELETE policies → only superuser / SECURITY DEFINER
-- functions can write.

-- ----------------------------------------------------------------------------
-- RPCs
-- ----------------------------------------------------------------------------

-- Self-claim host privilege (idempotent). Any authenticated user (incl. anon)
-- can call this. The teacher view calls it on mount.
create or replace function public.claim_qa_host() returns void
    language plpgsql
    security definer
    set search_path = public
as $$
begin
    insert into public.qa_hosts (user_id)
        values (auth.uid())
        on conflict do nothing;
end;
$$;
revoke all on function public.claim_qa_host() from public;
grant execute on function public.claim_qa_host() to authenticated;

-- Mark a question answered (or unanswer it). Only callers who are in
-- qa_hosts succeed; everyone else gets an exception. Restricts the host's
-- power to the answered_at column — no editing the body, no deletion.
create or replace function public.host_mark_answered(
    question_id uuid,
    mark_as_answered boolean default true
) returns void
    language plpgsql
    security definer
    set search_path = public
as $$
begin
    if not exists (select 1 from public.qa_hosts where user_id = auth.uid()) then
        raise exception 'not authorized: caller is not a Q&A host';
    end if;
    update public.qa_questions
       set answered_at = case when mark_as_answered then now() else null end
     where id = question_id;
end;
$$;
revoke all on function public.host_mark_answered(uuid, boolean) from public;
grant execute on function public.host_mark_answered(uuid, boolean) to authenticated;
