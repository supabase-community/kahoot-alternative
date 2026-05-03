-- ============================================================================
-- Allow the author of a Q&A question to delete it themselves.
-- Mark-answered (UPDATE answered_at) is already permitted by the existing
-- "Author can update own question; anyone can mark answered" policy.
-- ============================================================================

create policy "Author can delete own question"
    on public.qa_questions for delete
    using (auth.uid() = author_user_id);
