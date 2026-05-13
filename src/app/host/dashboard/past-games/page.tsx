'use client'

import { supabase } from '@/types/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type GameRow = {
  id: string
  phase: string
  created_at: string
  quiz_set_id: string
  quiz_set: { name: string } | null
}

type Counts = {
  players: number
  total_pts: number
}

export default function PastGames() {
  const [games, setGames] = useState<GameRow[]>([])
  const [counts, setCounts] = useState<Map<string, Counts>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data: gameData } = await supabase
        .from('games')
        .select('id, phase, created_at, quiz_set_id, quiz_set:quiz_sets(name)')
        .order('created_at', { ascending: false })
      const list = (gameData ?? []) as any as GameRow[]
      setGames(list)

      // Per-game player + total-score counts (single batch query each)
      if (list.length > 0) {
        const gameIds = list.map((g) => g.id)
        const [partsRes, ansRes] = await Promise.all([
          supabase.from('participants').select('id, game_id').in('game_id', gameIds),
          supabase
            .from('game_results')
            .select('game_id, total_score')
            .in('game_id', gameIds),
        ])
        const c = new Map<string, Counts>()
        for (const id of gameIds) c.set(id, { players: 0, total_pts: 0 })
        for (const p of (partsRes.data ?? []) as any[]) {
          const cur = c.get(p.game_id)!
          c.set(p.game_id, { ...cur, players: cur.players + 1 })
        }
        for (const r of (ansRes.data ?? []) as any[]) {
          const cur = c.get(r.game_id)!
          c.set(r.game_id, { ...cur, total_pts: cur.total_pts + (r.total_score ?? 0) })
        }
        setCounts(c)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const deleteGame = async (id: string) => {
    if (!confirm('Delete this game? This wipes its participants and answers (cascades). The quiz definition stays.'))
      return
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (error) {
      alert(`Could not delete: ${error.message}`)
      return
    }
    setGames((cur) => cur.filter((g) => g.id !== id))
  }

  const fmt = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <p className="p-4">Loading past games…</p>
  if (games.length === 0)
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Past games</h1>
        <p className="text-gray-500">No games yet. Start one from the dashboard.</p>
      </div>
    )

  return (
    <div className="p-4 max-w-5xl">
      <h1 className="text-xl font-bold mb-4">Past games</h1>
      <p className="text-sm text-gray-500 mb-4">
        Each row is a game session. Click <strong>Open results</strong> to see its
        leaderboard and per-question grid. Toggle <em>Show all results</em> on the
        results page to reveal the full ranking.
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-3">Quiz</th>
            <th className="text-left py-2 pr-3">Started</th>
            <th className="text-left py-2 pr-3">Phase</th>
            <th className="text-right py-2 pr-3">Players</th>
            <th className="text-right py-2 pr-3">Total pts</th>
            <th className="text-right py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => {
            const c = counts.get(g.id) ?? { players: 0, total_pts: 0 }
            const finished = g.phase === 'result'
            return (
              <tr key={g.id} className="border-b last:border-b-0">
                <td className="py-2 pr-3 font-semibold">{g.quiz_set?.name ?? '(deleted quiz)'}</td>
                <td className="py-2 pr-3 text-gray-600">{fmt(g.created_at)}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      g.phase === 'result'
                        ? 'bg-green-100 text-green-800'
                        : g.phase === 'quiz'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {g.phase}
                  </span>
                </td>
                <td className="py-2 pr-3 text-right">{c.players}</td>
                <td className="py-2 pr-3 text-right">{c.total_pts}</td>
                <td className="py-2 pr-3 text-right">
                  <div className="flex gap-2 justify-end">
                    {finished && (
                      <Link
                        href={`/host/game/${g.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 text-xs"
                      >
                        Open results
                      </Link>
                    )}
                    <button
                      onClick={() => deleteGame(g.id)}
                      className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
