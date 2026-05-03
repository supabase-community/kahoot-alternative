'use client'

import { supabase } from '@/types/types'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type Question = {
  id: string
  body: string
  author_user_id: string | null
  author_nickname: string
  created_at: string
  answered_at: string | null
}

type Upvote = {
  qa_question_id: string
  user_id: string
}

const NICK_KEY = 'hyf_qa_nickname'

export default function QAPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string>('')
  const [nickInput, setNickInput] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [upvotes, setUpvotes] = useState<Upvote[]>([])

  // 1. Sign in anonymously + restore nickname from localStorage
  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      let uid = sessionData.session?.user.id ?? null
      if (!uid) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          console.error(error)
          return
        }
        uid = data?.user?.id ?? null
      }
      setUserId(uid)
      const stored = typeof window !== 'undefined' ? localStorage.getItem(NICK_KEY) : null
      if (stored) {
        setNickname(stored)
        setNickInput(stored)
      }
    }
    init()
  }, [])

  // 2. Fetch initial state + subscribe to realtime
  useEffect(() => {
    if (!userId) return

    const refresh = async () => {
      const [qRes, uRes] = await Promise.all([
        supabase.from('qa_questions' as any).select('*').is('answered_at', null),
        supabase.from('qa_upvotes' as any).select('*'),
      ])
      if (qRes.data) setQuestions(qRes.data as Question[])
      if (uRes.data) setUpvotes(uRes.data as Upvote[])
    }
    refresh()

    const channel = supabase
      .channel('qa-board')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'qa_questions' },
        () => refresh()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'qa_upvotes' },
        () => refresh()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const ranked = useMemo(() => {
    const counts = new Map<string, number>()
    for (const u of upvotes) counts.set(u.qa_question_id, (counts.get(u.qa_question_id) ?? 0) + 1)
    const myVotes = new Set(upvotes.filter((u) => u.user_id === userId).map((u) => u.qa_question_id))
    return questions
      .map((q) => ({ ...q, upvotes: counts.get(q.id) ?? 0, votedByMe: myVotes.has(q.id) }))
      .sort((a, b) => {
        if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [questions, upvotes, userId])

  const saveNickname = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = nickInput.trim().slice(0, 30)
    if (!trimmed) return
    setNickname(trimmed)
    if (typeof window !== 'undefined') localStorage.setItem(NICK_KEY, trimmed)
  }

  const submitQuestion = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || !nickname || submitting) return
    setSubmitting(true)
    const { error } = await supabase.from('qa_questions' as any).insert({
      body: trimmed,
      author_nickname: nickname,
    })
    setSubmitting(false)
    if (error) {
      alert(`Could not post: ${error.message}`)
      return
    }
    setBody('')
  }

  const toggleUpvote = async (questionId: string, currentlyVoted: boolean) => {
    if (currentlyVoted) {
      await supabase.from('qa_upvotes' as any).delete().eq('qa_question_id', questionId).eq('user_id', userId!)
    } else {
      await supabase.from('qa_upvotes' as any).insert({ qa_question_id: questionId })
    }
  }

  const markOwnAnswered = async (questionId: string) => {
    await supabase
      .from('qa_questions' as any)
      .update({ answered_at: new Date().toISOString() })
      .eq('id', questionId)
  }

  const deleteOwn = async (questionId: string) => {
    if (!confirm('Delete your question?')) return
    await supabase.from('qa_questions' as any).delete().eq('id', questionId)
  }

  // ----- render -----

  if (!nickname) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <form
          onSubmit={saveNickname}
          className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-2">HYF Q&A board</h1>
          <p className="text-slate-300 mb-4 text-sm">
            Pick a nickname so the teacher can see whose question is whose.
            Saved in this browser only — pick anything.
          </p>
          <input
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-slate-400 mb-3"
            placeholder="Nickname"
            maxLength={30}
            value={nickInput}
            onChange={(e) => setNickInput(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            disabled={!nickInput.trim()}
            className="w-full py-3 rounded bg-green-500 disabled:opacity-50 font-bold"
          >
            Continue
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">HYF Q&A</h1>
          <span className="text-sm text-slate-400">
            you are <strong className="text-white">{nickname}</strong>
          </span>
        </header>

        <form onSubmit={submitQuestion} className="bg-slate-800 p-4 rounded-lg mb-6">
          <textarea
            className="w-full p-3 rounded bg-slate-700 text-white placeholder-slate-400 resize-none"
            placeholder="What did you struggle with? What do you want the teacher to cover?"
            maxLength={500}
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-400">{body.length}/500</span>
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="px-4 py-2 rounded bg-green-500 disabled:opacity-40 font-semibold"
            >
              {submitting ? 'Posting…' : 'Post question'}
            </button>
          </div>
        </form>

        <h2 className="text-lg font-bold mb-3">
          {ranked.length === 0
            ? 'No questions yet — be the first.'
            : `${ranked.length} open question${ranked.length === 1 ? '' : 's'}`}
        </h2>

        <ul className="space-y-3">
          {ranked.map((q) => {
            const isMine = q.author_user_id === userId
            return (
              <li key={q.id} className="bg-slate-800 rounded-lg p-4 flex gap-4">
                <button
                  onClick={() => toggleUpvote(q.id, q.votedByMe)}
                  className={`flex flex-col items-center justify-center w-14 rounded ${
                    q.votedByMe ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                  aria-label={q.votedByMe ? 'Remove upvote' : 'Upvote'}
                >
                  <span className="text-xl leading-none">▲</span>
                  <span className="font-bold text-lg leading-none mt-1">{q.upvotes}</span>
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-white whitespace-pre-wrap break-words">{q.body}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {q.author_nickname}
                    {isMine && <span className="text-green-400 ml-1">(you)</span>}
                    {' · '}
                    {new Date(q.created_at).toLocaleTimeString()}
                  </p>
                  {isMine && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => markOwnAnswered(q.id)}
                        className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
                      >
                        ✓ Mark answered
                      </button>
                      <button
                        onClick={() => deleteOwn(q.id)}
                        className="text-xs px-2 py-1 rounded bg-red-900 text-red-200 hover:bg-red-800"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
