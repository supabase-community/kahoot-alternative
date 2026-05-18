'use client'

export const runtime = 'edge'

import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Choice, Game, Participant, Question, supabase } from '@/types/types'
import Lobby from './lobby'
import Quiz from './quiz'

enum Screens {
  lobby = 'lobby',
  quiz = 'quiz',
  results = 'result',
}

export default function Home({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const onRegisterCompleted = (participant: Participant) => {
    setParticipant(participant)
    getGame()
  }

  const stateRef = useRef<Participant | null>()

  const [participant, setParticipant] = useState<Participant | null>()

  stateRef.current = participant

  const [currentScreen, setCurrentScreen] = useState(Screens.lobby)

  const [questions, setQuestions] = useState<Question[]>()

  const [currentQuestionSequence, setCurrentQuestionSequence] = useState(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
  const [questionStartedAt, setQuestionStartedAt] = useState<string | null>(null)

  const getGame = async () => {
    const { data: game } = await supabase
      .from('games')
      .select()
      .eq('id', gameId)
      .single()
    if (!game) return
    setCurrentScreen(game.phase as Screens)
    if (game.phase == Screens.quiz) {
      setCurrentQuestionSequence(game.current_question_sequence)
      setIsAnswerRevealed(game.is_answer_revealed)
      setQuestionStartedAt((game as any).question_started_at ?? null)
    }

    getQuestions(game.quiz_set_id)
  }

  const getQuestions = async (quizSetId: string, attempt: number = 0) => {
    const { data, error } = await supabase
      .from('questions')
      .select(`*, choices(*)`)
      .eq('quiz_set_id', quizSetId)
      .order('order', { ascending: true })
    if (error) {
      // Backoff retry, but cap at 5 attempts so we don't spam endless alerts
      // when the network is genuinely broken.
      if (attempt >= 5) {
        console.error('getQuestions: giving up after 5 retries', error)
        return
      }
      setTimeout(() => getQuestions(quizSetId, attempt + 1), 500 * (attempt + 1))
      return
    }
    setQuestions(data)
  }

  useEffect(() => {
    const setGameListner = (): RealtimeChannel => {
      return supabase
        .channel('game_participant')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'games',
            filter: `id=eq.${gameId}`,
          },
          (payload) => {
            if (!stateRef.current) return

            // start the quiz game
            const game = payload.new as Game

            if (game.phase == 'result') {
              setCurrentScreen(Screens.results)
            } else {
              setCurrentScreen(Screens.quiz)
              setCurrentQuestionSequence(game.current_question_sequence)
              setIsAnswerRevealed(game.is_answer_revealed)
              setQuestionStartedAt((game as any).question_started_at ?? null)
            }
          }
        )
        .subscribe()
    }

    const gameChannel = setGameListner()
    return () => {
      supabase.removeChannel(gameChannel)
    }
  }, [gameId])

  return (
    <main className="bg-green-500 min-h-screen">
      {currentScreen == Screens.lobby && (
        <Lobby
          onRegisterCompleted={onRegisterCompleted}
          gameId={gameId}
        ></Lobby>
      )}
      {currentScreen == Screens.quiz && questions && (
        <Quiz
          question={questions![currentQuestionSequence]}
          questionCount={questions!.length}
          participantId={participant!.id}
          isAnswerRevealed={isAnswerRevealed}
          questionStartedAt={questionStartedAt}
        ></Quiz>
      )}
      {currentScreen == Screens.results && (
        <Results participant={participant!} gameId={gameId}></Results>
      )}
    </main>
  )
}

type AnswerRow = { question_id: string; choice_id: string | null; score: number }
type QuestionWithChoices = Question & { choices: Choice[] }
type InspectTarget = { question: QuestionWithChoices; chosen: Choice | null; correct: Choice | null }

function Results({ participant, gameId }: { participant: Participant; gameId: string }) {
  const [winner, setWinner] = useState<{ participant_id: string; nickname: string; total_score: number } | null>(null)
  const [myRank, setMyRank] = useState<number | null>(null)
  const [myScore, setMyScore] = useState<number>(0)
  const [answers, setAnswers] = useState<AnswerRow[]>([])
  const [questions, setQuestions] = useState<QuestionWithChoices[]>([])
  const [loading, setLoading] = useState(true)
  const [inspect, setInspect] = useState<InspectTarget | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      const [resultsRes, answersRes, gameRes] = await Promise.all([
        supabase.from('game_results').select().eq('game_id', gameId).order('total_score', { ascending: false }),
        supabase.from('answers').select('question_id, choice_id, score').eq('participant_id', participant.id),
        supabase.from('games').select('quiz_set_id').eq('id', gameId).single(),
      ])

      const allResults = (resultsRes.data ?? []) as any[]
      if (allResults.length > 0) setWinner(allResults[0])
      const rank = allResults.findIndex((r: any) => r.participant_id === participant.id)
      setMyRank(rank >= 0 ? rank + 1 : null)
      const me = allResults.find((r: any) => r.participant_id === participant.id)
      if (me) setMyScore(me.total_score)

      setAnswers((answersRes.data ?? []) as AnswerRow[])

      if (gameRes.data?.quiz_set_id) {
        const { data: qData } = await supabase
          .from('questions')
          .select('*, choices(*)')
          .eq('quiz_set_id', gameRes.data.quiz_set_id)
          .order('order', { ascending: true })
        setQuestions((qData ?? []) as QuestionWithChoices[])
      }

      setLoading(false)
    }
    fetchAll()
  }, [gameId, participant.id])

  const answerMap = new Map(answers.map(a => [a.question_id, a]))
  const correctCount = answers.filter(a => a.score > 0).length
  const medals = ['🥇', '🥈', '🥉']
  const medal = myRank && myRank <= 3 ? medals[myRank - 1] : null

  function openInspect(q: QuestionWithChoices) {
    const a = answerMap.get(q.id)
    const chosen = a?.choice_id ? (q.choices.find(c => c.id === a.choice_id) ?? null) : null
    const correct = q.choices.find(c => c.is_correct) ?? null
    setInspect({ question: q, chosen, correct })
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center px-4 py-10 gap-8">
      {/* Winner card */}
      {loading && <p className="text-white/70 italic mt-20">Calculating final scores…</p>}
      {!loading && winner && (
        <div className="bg-slate-800 rounded-2xl px-8 py-8 shadow-2xl flex flex-col items-center w-full max-w-sm text-center">
          <span className="text-6xl mb-2">{medal ?? '🏅'}</span>
          <p className="text-white/60 text-sm mb-1">
            {participant.id === winner.participant_id ? 'You won!' : `Winner`}
          </p>
          <span className="text-4xl font-bold text-white mb-1">{winner.nickname}</span>
          <span className="text-2xl font-bold text-white">
            {winner.total_score}
            <span className="text-base ml-1 font-normal text-white/50">pts</span>
          </span>
          {myRank && myRank > 1 && (
            <p className="text-white/50 text-sm mt-3">
              You: #{myRank} · {myScore} pts
            </p>
          )}
        </div>
      )}

      {/* Correct count */}
      {!loading && questions.length > 0 && (
        <div className="text-white text-center">
          <span className="text-3xl font-bold">{correctCount}</span>
          <span className="text-white/50 text-xl"> / {questions.length} correct</span>
        </div>
      )}

      {/* Per-question grid */}
      {!loading && questions.length > 0 && (
        <div className="w-full max-w-2xl bg-slate-800 rounded-xl p-5">
          <h2 className="text-white font-bold text-lg mb-1">Your answers</h2>
          <p className="text-white/50 text-xs mb-4">Tap a cell to see the question and correct answer.</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const a = answerMap.get(q.id)
              const correct = a && a.score > 0
              const answered = !!a
              return (
                <button
                  key={q.id}
                  onClick={() => openInspect(q)}
                  className={`w-10 h-10 rounded text-sm font-bold flex items-center justify-center transition
                    ${correct ? 'bg-green-600 text-white' : answered ? 'bg-red-700 text-white' : 'bg-slate-600 text-white/50'}
                  `}
                  title={`Q${i + 1}`}
                >
                  {correct ? '✓' : answered ? '✗' : '—'}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Inspect modal */}
      {inspect && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => setInspect(null)}
        >
          <div
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white font-semibold text-lg mb-4">{inspect.question.body}</p>
            <div className="flex flex-col gap-2 mb-5">
              {inspect.question.choices.map(c => {
                const isChosen = c.id === inspect.chosen?.id
                const isCorrect = c.is_correct
                return (
                  <div
                    key={c.id}
                    className={`px-4 py-2 rounded text-sm font-medium
                      ${isCorrect ? 'bg-green-600 text-white' : isChosen ? 'bg-red-700 text-white' : 'bg-slate-700 text-white/50'}
                    `}
                  >
                    {c.body}
                    {isCorrect && <span className="ml-2 text-xs">✓ correct</span>}
                    {isChosen && !isCorrect && <span className="ml-2 text-xs">← your answer</span>}
                  </div>
                )
              })}
            </div>
            {inspect.question.explanation && (
              <div className="mb-5 p-3 rounded bg-blue-900/40 border border-blue-700/60 text-sm">
                <span className="font-semibold text-blue-200">Why: </span>
                <span className="text-blue-100">{inspect.question.explanation}</span>
              </div>
            )}
            <button
              onClick={() => setInspect(null)}
              className="w-full py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
