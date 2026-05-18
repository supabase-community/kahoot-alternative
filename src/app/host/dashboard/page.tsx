'use client'

import { QuizSet, supabase } from '@/types/types'
import { useEffect, useState } from 'react'

export default function Home() {
  const [quizSet, setQuizSet] = useState<QuizSet[]>([])

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

  return (
    <>
      {quizSet.map((quizSet) => (
        <div
          key={quizSet.id}
          className="flex justify-start shadow my-4 mx-2 rounded"
        >
          <img className="h-28" src="/default.png" alt="default quiz image" />
          <div className="p-2 flex flex-col justify-between items-stretch flex-grow">
            <h2 className="font-bold">{quizSet.name}</h2>
            <div className="flex justify-between items-end">
              <div>{quizSet.questions.length} questions</div>
              <div className="flex gap-2">
                <button
                  className="bg-red-100 text-red-700 py-1 px-3 rounded hover:bg-red-200 text-sm"
                  onClick={() => deleteQuiz(quizSet.id, quizSet.name)}
                  title="Delete this quiz, including all of its game sessions"
                >
                  🗑 Delete
                </button>
                <a
                  href={`/host/quiz/${quizSet.id}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-700 py-1 px-3 rounded hover:bg-blue-200 text-sm"
                  title="Walk through the quiz questions and answers without starting a game"
                >
                  🔍 Preview
                </a>
                <button
                  className="bg-green-500 text-white py-1 px-4 rounded"
                  onClick={() => startGame(quizSet.id)}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
