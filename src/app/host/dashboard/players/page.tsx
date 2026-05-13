'use client'

import { supabase } from '@/types/types'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// One row per (nickname, game) — joined from game_results so the score is
// already aggregated by player+game. The view is owned by the public schema.
type Result = {
  nickname: string
  total_score: number
  game_id: string
  // Joined fields (filled below):
  game_created_at?: string
  quiz_name?: string
}

type SortKey = 'best' | 'avg' | 'latest' | 'games' | 'nickname'

type Aggregate = {
  nickname: string
  games: number
  avg: number
  best: number
  worst: number
  latest_score: number
  latest_at: string
  per_game: Result[]
}

export default function PlayerTracking() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('best')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      // Pull every game_results row, plus the parent game's created_at and
      // quiz_set name. game_results is a view so it has no realtime sub —
      // refresh by reloading the page.
      const [gr, games] = await Promise.all([
        supabase.from('game_results').select('nickname, total_score, game_id'),
        supabase.from('games').select('id, created_at, quiz_set:quiz_sets(name)'),
      ])
      const gameMeta = new Map<string, { created_at: string; quiz_name: string }>()
      for (const g of (games.data ?? []) as any[]) {
        gameMeta.set(g.id, {
          created_at: g.created_at,
          quiz_name: g.quiz_set?.name ?? '(deleted quiz)',
        })
      }
      const enriched = ((gr.data ?? []) as Result[]).map((r) => ({
        ...r,
        game_created_at: gameMeta.get(r.game_id)?.created_at,
        quiz_name: gameMeta.get(r.game_id)?.quiz_name,
      }))
      setResults(enriched)
      setLoading(false)
    }
    fetch()
  }, [])

  const aggregates = useMemo<Aggregate[]>(() => {
    const byNick = new Map<string, Result[]>()
    for (const r of results) {
      const arr = byNick.get(r.nickname) ?? []
      arr.push(r)
      byNick.set(r.nickname, arr)
    }
    const out: Aggregate[] = []
    for (const [nickname, rows] of byNick.entries()) {
      const sorted = [...rows].sort((a, b) =>
        (b.game_created_at ?? '').localeCompare(a.game_created_at ?? '')
      )
      const scores = rows.map((r) => r.total_score)
      const sum = scores.reduce((a, b) => a + b, 0)
      out.push({
        nickname,
        games: rows.length,
        avg: Math.round(sum / rows.length),
        best: Math.max(...scores),
        worst: Math.min(...scores),
        latest_score: sorted[0]?.total_score ?? 0,
        latest_at: sorted[0]?.game_created_at ?? '',
        per_game: sorted,
      })
    }
    const filtered = search.trim()
      ? out.filter((a) =>
          a.nickname.toLowerCase().includes(search.trim().toLowerCase())
        )
      : out
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'best':
          return b.best - a.best
        case 'avg':
          return b.avg - a.avg
        case 'latest':
          return (b.latest_at ?? '').localeCompare(a.latest_at ?? '')
        case 'games':
          return b.games - a.games
        case 'nickname':
          return a.nickname.localeCompare(b.nickname)
      }
    })
    return sorted
  }, [results, search, sort])

  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—'

  if (loading) return <p className="p-4">Loading player history…</p>

  return (
    <div className="p-4 max-w-6xl">
      <h1 className="text-xl font-bold mb-1">Player tracking</h1>
      <p className="text-sm text-gray-500 mb-4">
        Aggregated across every game in the database. Players are matched by
        nickname; if the same student joins under different nicknames they
        appear as separate rows. Click a row to expand its per-game history.
      </p>

      <div className="flex flex-wrap gap-2 items-center mb-3">
        <input
          type="text"
          placeholder="Search by nickname…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border border-gray-300 px-3 py-1 rounded text-sm"
        >
          <option value="best">Sort: best score (desc)</option>
          <option value="avg">Sort: avg score (desc)</option>
          <option value="latest">Sort: most recent game</option>
          <option value="games">Sort: most games played</option>
          <option value="nickname">Sort: nickname (A-Z)</option>
        </select>
        <span className="text-xs text-gray-500 ml-auto">
          {aggregates.length} player{aggregates.length === 1 ? '' : 's'}, {results.length} game-runs total
        </span>
      </div>

      {aggregates.length === 0 && (
        <p className="text-gray-500 italic">
          {search ? 'No players match that nickname.' : 'No game data yet.'}
        </p>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-3">Nickname</th>
            <th className="text-right py-2 pr-3">Games</th>
            <th className="text-right py-2 pr-3">Avg</th>
            <th className="text-right py-2 pr-3">Best</th>
            <th className="text-right py-2 pr-3">Worst</th>
            <th className="text-right py-2 pr-3">Latest</th>
            <th className="text-left py-2 pr-3">When</th>
          </tr>
        </thead>
        <tbody>
          {aggregates.map((a) => (
            <>
              <tr
                key={a.nickname}
                className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => setExpanded(expanded === a.nickname ? null : a.nickname)}
              >
                <td className="py-2 pr-3 font-semibold">
                  {expanded === a.nickname ? '▾' : '▸'} {a.nickname}
                </td>
                <td className="py-2 pr-3 text-right">{a.games}</td>
                <td className="py-2 pr-3 text-right">{a.avg}</td>
                <td className="py-2 pr-3 text-right font-bold text-green-700">{a.best}</td>
                <td className="py-2 pr-3 text-right text-gray-500">{a.worst}</td>
                <td className="py-2 pr-3 text-right">{a.latest_score}</td>
                <td className="py-2 pr-3 text-gray-600">{fmt(a.latest_at)}</td>
              </tr>
              {expanded === a.nickname && (
                <tr key={a.nickname + '-detail'} className="bg-gray-50 border-b">
                  <td colSpan={7} className="p-3">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="text-left py-1 pr-3">Game</th>
                          <th className="text-left py-1 pr-3">When</th>
                          <th className="text-right py-1 pr-3">Score</th>
                          <th className="text-right py-1 pr-3">Open</th>
                        </tr>
                      </thead>
                      <tbody>
                        {a.per_game.map((r) => (
                          <tr key={r.game_id} className="border-t border-gray-200">
                            <td className="py-1 pr-3">{r.quiz_name}</td>
                            <td className="py-1 pr-3 text-gray-600">{fmt(r.game_created_at)}</td>
                            <td className="py-1 pr-3 text-right font-semibold">{r.total_score}</td>
                            <td className="py-1 pr-3 text-right">
                              <Link
                                href={`/host/game/${r.game_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                results →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
