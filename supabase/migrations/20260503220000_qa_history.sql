-- ============================================================================
-- Q&A historic-analysis additions:
--   1. session_label on qa_questions so each cohort/week's board can be tagged
--      and filtered (e.g. "week-1-2026-spring", "week-3-2026-spring"). Default
--      null so existing behaviour is unchanged; the host UI can set this via
--      a query-string override or a hard-coded constant per cohort.
--   2. qa_history view: one row per question with author, timestamps, current
--      upvote count, and (de-normalised) session_label. Use this for export
--      and ad-hoc analysis without having to remember the join shape.
-- ============================================================================

alter table public.qa_questions
    add column if not exists session_label text;

create index if not exists qa_questions_session_label_idx
    on public.qa_questions (session_label);

create or replace view public.qa_history as
    select
        q.id              as question_id,
        q.session_label,
        q.author_nickname,
        q.body            as question,
        q.created_at      as asked_at,
        q.answered_at,
        coalesce(uv.upvote_count, 0)::int as upvotes
    from public.qa_questions q
    left join (
        select qa_question_id, count(*) as upvote_count
        from public.qa_upvotes
        group by qa_question_id
    ) uv on uv.qa_question_id = q.id
    order by q.created_at desc;

comment on view public.qa_history is
    'Flat history of every question asked, with author + upvote count + session tag. Use for cross-cohort analysis: SELECT * FROM qa_history WHERE session_label = ''week-1-2026-spring'';';
