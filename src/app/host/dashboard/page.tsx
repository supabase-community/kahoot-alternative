'use client'

import { QuizSet, supabase } from '@/types/types'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Parsed = {
  week: number | null
  round: number | null
  difficulty: string | null
  rest: string
}

function parseName(name: string): Parsed {
  // Examples:
  //   "HYF Week 3 : Live Quiz Round 2 (Ch5-6 + Gotchas, harder)"
  //   "HYF Week 1 : Live Quiz Round 1 (Ch1-5, easier)"
  //   "Demo — 1 Question Test"
  const weekMatch = name.match(/Week\s+(\d+)/i)
  const roundMatch = name.match(/Round\s+(\d+)/i)
  const parenMatch = name.match(/\(([^)]+)\)/)
  let difficulty: string | null = null
  let rest = ''
  if (parenMatch) {
    const inside = parenMatch[1]
    const parts = inside.split(',').map((s) => s.trim())
    const diffIdx = parts.findIndex((p) => /^(easier|harder|easy|hard|medium)$/i.test(p))
    if (diffIdx >= 0) {
      difficulty = parts[diffIdx].toLowerCase()
      parts.splice(diffIdx, 1)
    }
    rest = parts.join(', ')
  } else {
    rest = name
      .replace(/^HYF\s+/i, '')
      .replace(/Week\s+\d+\s*:?\s*/i, '')
      .replace(/Live Quiz\s*/i, '')
      .replace(/Round\s+\d+\s*/i, '')
      .trim()
  }
  return {
    week: weekMatch ? Number(weekMatch[1]) : null,
    round: roundMatch ? Number(roundMatch[1]) : null,
    difficulty,
    rest,
  }
}

const difficultyClass = (d: string | null) => {
  if (!d) return ''
  if (/easi|easy/.test(d)) return 'bg-emerald-100 text-emerald-800'
  if (/hard/.test(d)) return 'bg-orange-100 text-orange-800'
  return 'bg-slate-100 text-slate-700'
}

export default function Home() {
  const [quizSet, setQuizSet] = useState<QuizSet[]>([])
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const getQuizSets = async () => {
      const { data, error } = await supabase
        .from('quiz_sets')
        .select(`*, questions(*, choices(*))`)
        .order('created_at', { ascending: false })
      if (error) {
        alert('Failed to fetch quiz sets')
        return
      }
      setQuizSet(data)
    }
    getQuizSets()
  }, [])

  const startGame = async (quizSetId: string) => {
    const tryInsert = async () =>
      supabase.from('games').insert({ quiz_set_id: quizSetId }).select().single()

    const ensureSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        await supabase.auth.signInAnonymously()
      }
    }

    await ensureSession()
    let { data, error } = await tryInsert()

    // 23503 = foreign-key violation on games.host_user_id (stale JWT for a user
    // that no longer exists, e.g. after `supabase db reset`). Sign out, get a
    // fresh anon user, retry once.
    if (error && (error as any).code === '23503') {
      await supabase.auth.signOut()
      await supabase.auth.signInAnonymously()
      ;({ data, error } = await tryInsert())
    }

    if (error || !data) {
      console.error(error)
      alert(`Failed to start game: ${error?.message ?? 'unknown'}`)
      return
    }

    window.open(`/host/game/${data.id}`, '_blank', 'noopener,noreferrer')
  }

  const deleteQuiz = async (id: string, name: string) => {
    if (
      !confirm(
        `Delete quiz "${name}"?\n\nThis also deletes every game session, ` +
          `participant, and answer linked to it. Cannot be undone.`
      )
    )
      return
    const { error } = await supabase.from('quiz_sets').delete().eq('id', id)
    if (error) {
      alert(`Could not delete: ${error.message}`)
      return
    }
    setQuizSet((current) => current.filter((q) => q.id !== id))
  }

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? quizSet.filter((qs) => qs.name.toLowerCase().includes(q))
      : quizSet

    const byKey = new Map<
      string,
      { label: string; weekNum: number; items: (QuizSet & { _p: Parsed })[] }
    >()
    for (const qs of filtered) {
      const p = parseName(qs.name)
      const key = p.week !== null ? `week-${p.week}` : 'other'
      const label = p.week !== null ? `Week ${p.week}` : 'Other'
      const weekNum = p.week ?? -1
      const bucket = byKey.get(key) ?? { label, weekNum, items: [] }
      bucket.items.push({ ...qs, _p: p })
      byKey.set(key, bucket)
    }
    const arr = Array.from(byKey.entries()).map(([key, v]) => ({ key, ...v }))
    arr.sort((a, b) => b.weekNum - a.weekNum)
    for (const g of arr) {
      g.items.sort((a, b) => {
        const ra = a._p.round ?? 99
        const rb = b._p.round ?? 99
        if (ra !== rb) return ra - rb
        return a.name.localeCompare(b.name)
      })
    }
    return arr
  }, [quizSet, query])

  const toggle = (key: string) =>
    setCollapsed((c) => ({ ...c, [key]: !c[key] }))

  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter quizzes…"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <span className="text-sm text-gray-500">
          {quizSet.length} quiz{quizSet.length === 1 ? '' : 'zes'}
        </span>
      </div>

      {groups.map((group) => {
        const isCollapsed = collapsed[group.key]
        return (
          <section key={group.key} className="mb-4">
            <button
              onClick={() => toggle(group.key)}
              className="w-full flex items-center gap-2 text-left py-2 px-1 border-b border-gray-200 hover:bg-gray-50"
            >
              <span className="text-gray-500 text-sm w-4">
                {isCollapsed ? '▸' : '▾'}
              </span>
              <h2 className="font-semibold text-gray-800">{group.label}</h2>
              <span className="text-xs text-gray-500">
                ({group.items.length})
              </span>
            </button>

            {!isCollapsed && (
              <ul className="divide-y divide-gray-100">
                {group.items.map((qs) => {
                  const p = qs._p
                  const count = qs.questions.length
                  return (
                    <li
                      key={qs.id}
                      className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50 group"
                    >
                      <div className="flex items-center gap-1.5 w-40 shrink-0">
                        {p.round !== null && (
                          <span className="text-xs font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            R{p.round}
                          </span>
                        )}
                        {p.difficulty && (
                          <span
                            className={`text-xs font-medium px-1.5 py-0.5 rounded ${difficultyClass(p.difficulty)}`}
                          >
                            {p.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="text-sm text-gray-900 truncate">
                          {p.rest || qs.name}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 w-16 text-right shrink-0">
                        {count} Q
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          className="text-gray-400 hover:text-red-600 text-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteQuiz(qs.id, qs.name)}
                          title="Delete this quiz, including all of its game sessions"
                        >
                          🗑
                        </button>
                        <Link
                          href={`/host/quiz/${qs.id}/preview`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-100 text-blue-700 py-1 px-3 rounded hover:bg-blue-200 text-sm"
                          title="Walk through the quiz questions and answers without starting a game"
                        >
                          Preview
                        </Link>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded text-sm font-medium"
                          onClick={() => startGame(qs.id)}
                        >
                          Start
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      })}

      {groups.length === 0 && (
        <div className="text-gray-500 text-sm py-8 text-center">
          No quizzes match “{query}”.
        </div>
      )}
    </div>
  )
}
