'use client'

import { QuizSet, supabase } from '@/types/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const runtime = 'edge'

export default function QuizPreview({ params }: { params: { id: string } }) {
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase
        .from('quiz_sets')
        .select(`*, questions(*, choices(*))`)
        .eq('id', params.id)
        .order('order', { referencedTable: 'questions', ascending: true })
        .order('id', { referencedTable: 'questions.choices', ascending: true })
        .single()
      if (error || !data) {
        setError(error?.message ?? 'Quiz not found')
        setLoading(false)
        return
      }
      setQuizSet(data as QuizSet)
      setLoading(false)
    }
    fetchQuiz()
  }, [params.id])

  if (loading) return <p className="p-4">Loading quiz…</p>
  if (error) return <p className="p-4 text-red-700">Could not load quiz: {error}</p>
  if (!quizSet) return <p className="p-4">Quiz not found.</p>

  const total = quizSet.questions.length
  if (total === 0)
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">{quizSet.name}</h1>
        <p className="text-gray-500">This quiz has no questions.</p>
      </div>
    )

  return (
    <div className="p-4 max-w-3xl">
      <div className="mb-4">
        <Link
          href="/host/dashboard/past-games"
          className="text-sm text-blue-700 hover:underline"
        >
          ← Back to past games
        </Link>
      </div>

      <h1 className="text-2xl font-bold">{quizSet.name}</h1>
      {quizSet.description && (
        <p className="text-gray-600 mt-1">{quizSet.description}</p>
      )}

      <div className="flex items-center justify-between mt-4 mb-4 border-b pb-2">
        <p className="text-sm text-gray-600">
          {total} question{total === 1 ? '' : 's'}. Preview mode: no game is
          started, no players join. Correct choices are marked ✓.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          Show all questions
        </label>
      </div>

      {showAll ? (
        <div className="space-y-6">
          {quizSet.questions.map((q, qi) => (
            <QuestionCard key={q.id} question={q} qIndex={qi} total={total} />
          ))}
        </div>
      ) : (
        <>
          <QuestionCard
            question={quizSet.questions[index]}
            qIndex={index}
            total={total}
          />
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-600">
              {index + 1} / {total}
            </span>
            <button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function QuestionCard({
  question,
  qIndex,
  total,
}: {
  question: QuizSet['questions'][number]
  qIndex: number
  total: number
}) {
  return (
    <div className="border rounded p-4">
      <p className="text-xs text-gray-500 mb-1">
        Question {qIndex + 1} of {total}
      </p>
      <h2 className="text-lg font-semibold mb-3">{question.body}</h2>
      <ul className="space-y-2">
        {question.choices.map((c) => (
          <li
            key={c.id}
            className={`flex items-start gap-2 p-2 rounded ${
              c.is_correct
                ? 'bg-green-100 border border-green-300'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="font-bold w-5 text-center">
              {c.is_correct ? '✓' : '·'}
            </span>
            <span>{c.body}</span>
          </li>
        ))}
      </ul>
      {question.explanation && (
        <div className="mt-3 p-3 rounded bg-blue-50 border border-blue-200 text-sm">
          <span className="font-semibold text-blue-900">Why: </span>
          <span className="text-blue-900">{question.explanation}</span>
        </div>
      )}
    </div>
  )
}
