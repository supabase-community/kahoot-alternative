import {
  Answer,
  GameResult,
  Participant,
  Question,
  QuizSet,
  supabase,
} from '@/types/types'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

type AnswerRow = {
  participant_id: string
  question_id: string
  score: number
  choice_id: string | null
}

type ChoiceRow = { id: string; question_id: string; body: string; is_correct: boolean }

export default function Results({
  quizSet,
  gameId,
}: {
  participants: Participant[]
  quizSet: QuizSet
  gameId: string
}) {
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [answers, setAnswers] = useState<AnswerRow[]>([])
  const [choicesByQuestion, setChoicesByQuestion] = useState<Map<string, ChoiceRow[]>>(new Map())

  const { width, height } = useWindowSize()

  useEffect(() => {
    const getResults = async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select()
        .eq('game_id', gameId)
        .order('total_score', { ascending: false })
      if (error) return alert(error.message)
      setGameResults(data)
    }

    const getAnswerGrid = async () => {
      const participantIds = (
        await supabase.from('participants').select('id').eq('game_id', gameId)
      ).data?.map((p: any) => p.id) ?? []
      if (participantIds.length === 0) return
      const { data: ans } = await supabase
        .from('answers')
        .select('participant_id, question_id, score, choice_id')
        .in('participant_id', participantIds)
      if (ans) setAnswers(ans as AnswerRow[])
      const questionIds = quizSet.questions.map((q) => q.id)
      const { data: chs } = await supabase
        .from('choices')
        .select('id, question_id, body, is_correct')
        .in('question_id', questionIds)
      if (chs) {
        const map = new Map<string, ChoiceRow[]>()
        for (const c of chs as ChoiceRow[]) {
          const arr = map.get(c.question_id) ?? []
          arr.push(c)
          map.set(c.question_id, arr)
        }
        setChoicesByQuestion(map)
      }
    }

    getResults()
    getAnswerGrid()
  }, [gameId, quizSet])

  // Build participant → question → chosen choice + correctness lookup
  const cellFor = (participantId: string, questionId: string) => {
    const ans = answers.find(
      (a) => a.participant_id === participantId && a.question_id === questionId
    )
    if (!ans) return { text: '—', correct: null as boolean | null, score: 0 }
    if (!ans.choice_id) return { text: '(no answer)', correct: false, score: 0 }
    const choice = (choicesByQuestion.get(questionId) ?? []).find((c) => c.id === ans.choice_id)
    return {
      text: choice?.body ?? '?',
      correct: choice?.is_correct ?? false,
      score: ans.score,
    }
  }

  const orderedQuestions = [...quizSet.questions].sort((a, b) => a.order - b.order)
  // Default to winner-only on the projector — preserves suspense + privacy.
  // Teacher flips the toggle to reveal the full leaderboard + per-Q grid for
  // debrief.
  const [showFullResults, setShowFullResults] = useState(false)
  const winner = gameResults[0]

  return (
    <div className="min-h-screen bg-black">
      <div className="text-center relative">
        <h1 className="text-3xl my-4 py-4 px-12 bg-white inline-block rounded font-bold">
          {quizSet.name}
        </h1>
        {/* Toggle: winner-only ↔ full results. Default off (winner only). */}
        <button
          onClick={() => setShowFullResults((v) => !v)}
          className={`absolute right-4 top-4 px-4 py-2 rounded text-sm font-semibold shadow ${
            showFullResults
              ? 'bg-yellow-300 text-black hover:bg-yellow-400'
              : 'bg-white/90 text-black hover:bg-white'
          }`}
          title={
            showFullResults
              ? 'Showing full ranking + per-question grid. Click to hide and show only the winner.'
              : 'Showing only the winner. Click to reveal the full ranking + per-question grid (debrief view).'
          }
        >
          {showFullResults ? '🏆 Show winner only' : '📊 Show all results'}
        </button>
      </div>

      {!showFullResults && (
        // Winner-only view (default). Mirrors the player view so the projector
        // doesn't reveal everyone's score.
        <div className="flex flex-col justify-center items-center text-center px-4 mt-12">
          {winner ? (
            <div className="bg-white text-black rounded-2xl px-12 py-12 shadow-2xl flex flex-col items-center max-w-2xl w-full">
              <span className="text-8xl mb-4">🥇</span>
              <span className="text-6xl font-bold mb-4 break-words">{winner.nickname}</span>
              <span className="text-3xl font-bold">
                {winner.total_score}
                <span className="text-lg ml-2 font-normal text-gray-500">pts</span>
              </span>
            </div>
          ) : (
            <p className="text-white/70 italic mt-12">No scores recorded.</p>
          )}
        </div>
      )}

      {showFullResults && (
        <>
          {/* Full leaderboard (top 3 highlighted) */}
          <div className="flex justify-center items-stretch">
            <div>
              {gameResults.map((gameResult, index) => (
                <div
                  key={gameResult.participant_id}
                  className={`flex justify-between items-center bg-white py-2 px-4 rounded my-4 max-w-2xl w-full ${
                    index < 3 ? 'shadow-xl font-bold' : ''
                  }`}
                >
                  <div className={`pr-4 ${index < 3 ? 'text-3xl' : 'text-l'}`}>
                    {index + 1}
                  </div>
                  <div
                    className={`flex-grow font-bold ${
                      index < 3 ? 'text-5xl' : 'text-2xl'
                    }`}
                  >
                    {gameResult.nickname}
                  </div>
                  <div className="pl-2">
                    <span className="text-xl font-bold">{gameResult.total_score}</span>
                    <span>pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-player per-question answer grid (host-only debrief view) */}
          <div className="bg-white text-black mx-auto max-w-6xl my-8 p-4 rounded">
            <h2 className="text-xl font-bold mb-3">Per-question answers</h2>
            <p className="text-sm text-gray-600 mb-3">
              Green ✓ = correct, red ✗ = wrong, dash = no answer. Hover a cell to read the chosen
              option.
            </p>
            <div className="overflow-auto">
              <table className="text-sm border-collapse w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white text-left pr-3 py-1 border-b">Player</th>
                    {orderedQuestions.map((q, i) => (
                      <th
                        key={q.id}
                        className="px-2 py-1 border-b text-center"
                        title={q.body}
                      >
                        Q{i + 1}
                      </th>
                    ))}
                    <th className="px-2 py-1 border-b text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {gameResults.map((gr) => (
                    <tr key={gr.participant_id} className="border-b last:border-b-0">
                      <td className="sticky left-0 bg-white pr-3 py-1 font-semibold whitespace-nowrap">
                        {gr.nickname}
                      </td>
                      {orderedQuestions.map((q) => {
                        const cell = cellFor(gr.participant_id, q.id)
                        const bg =
                          cell.correct === true
                            ? 'bg-green-100'
                            : cell.correct === false
                            ? 'bg-red-100'
                            : 'bg-gray-50'
                        const mark =
                          cell.correct === true ? '✓' : cell.correct === false ? '✗' : '—'
                        return (
                          <td
                            key={q.id}
                            className={`px-2 py-1 text-center ${bg}`}
                            title={cell.text}
                          >
                            {mark}
                          </td>
                        )
                      })}
                      <td className="px-2 py-1 text-right font-bold">{gr.total_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Confetti width={width} height={height} recycle={true} />
    </div>
  )
}
