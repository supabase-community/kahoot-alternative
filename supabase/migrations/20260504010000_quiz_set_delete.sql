-- ============================================================================
-- Allow the host to delete a quiz_set from the dashboard.
--
-- Trust model: any authenticated user (including anonymous sign-ins) can
-- delete. Same posture as the rest of the kahoot-alternative — the host
-- URL is the gate, not RLS. Deletes cascade to questions / choices via
-- their existing FKs, and to games / participants / answers the same way.
-- ============================================================================

create policy "Authenticated can delete quiz sets"
    on public.quiz_sets for delete
    using (auth.uid() is not null);
