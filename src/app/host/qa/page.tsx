'use client'

import { supabase } from '@/types/types'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Question = {
  id: string
  body: string
  author_nickname: string
  created_at: string
  answered_at: string | null
}

type Upvote = { qa_question_id: string; user_id: string }

export default function HostQA() {
  const [showAnswered, setShowAnswered] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [upvotes, setUpvotes] = useState<Upvote[]>([])

  // Sign-in once so RLS policies that require auth.uid() (mark-answered) work.
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) await supabase.auth.signInAnonymously()
    }
    init()
  }, [])

  useEffect(() => {
    const refresh = async () => {
      const [qRes, uRes] = await Promise.all([
        supabase.from('qa_questions' as any).select('*'),
        supabase.from('qa_upvotes' as any).select('*'),
      ])
      if (qRes.data) setQuestions(qRes.data as Question[])
      if (uRes.data) setUpvotes(uRes.data as Upvote[])
    }
    refresh()

    const channel = supabase
      .channel('qa-host-board')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qa_questions' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qa_upvotes' }, () => refresh())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const ranked = useMemo(() => {
    const counts = new Map<string, number>()
    for (const u of upvotes) counts.set(u.qa_question_id, (counts.get(u.qa_question_id) ?? 0) + 1)
    return questions
      .filter((q) => showAnswered || !q.answered_at)
      .map((q) => ({ ...q, upvotes: counts.get(q.id) ?? 0 }))
      .sort((a, b) => {
        if (!!a.answered_at !== !!b.answered_at) return a.answered_at ? 1 : -1
        if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [questions, upvotes, showAnswered])

  const open = ranked.filter((q) => !q.answered_at).length
  const totalUpvotes = upvotes.length

  const markAnswered = async (id: string, answered: boolean) => {
    await supabase
      .from('qa_questions' as any)
      .update({ answered_at: answered ? null : new Date().toISOString() })
      .eq('id', id)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Q&A — Teacher view</h1>
            <Link href="/host/dashboard" className="text-sm text-slate-400 hover:text-white">
              ← Dashboard
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Live ranked list of student questions. Tell students to visit{' '}
            <code className="text-green-400">/qa</code> on the same URL.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <Stat label="Open" value={open} />
          <Stat label="Total" value={questions.length} />
          <Stat label="Upvotes" value={totalUpvotes} />
        </div>

        <label className="flex items-center gap-2 mb-4 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={showAnswered}
            onChange={(e) => setShowAnswered(e.target.checked)}
          />
          Show questions already marked answered
        </label>

        <ul className="space-y-3">
          {ranked.length === 0 && (
            <li className="text-slate-400 italic">No questions yet.</li>
          )}
          {ranked.map((q) => (
            <li
              key={q.id}
              className={`rounded-lg p-4 flex gap-4 ${
                q.answered_at ? 'bg-slate-800/50 opacity-60' : 'bg-slate-800'
              }`}
            >
              <div className="flex flex-col items-center justify-center w-14 bg-slate-700 rounded text-slate-200">
                <span className="text-xl leading-none">▲</span>
                <span className="font-bold text-lg leading-none mt-1">{q.upvotes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white whitespace-pre-wrap break-words">{q.body}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {q.author_nickname} · {new Date(q.created_at).toLocaleTimeString()}
                  {q.answered_at && (
                    <span className="ml-2 text-green-400">✓ answered</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => markAnswered(q.id, !!q.answered_at)}
                className={`self-start px-3 py-1 rounded text-xs font-semibold ${
                  q.answered_at
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              >
                {q.answered_at ? 'Reopen' : 'Mark answered'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800 rounded-lg px-4 py-3">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  )
}
