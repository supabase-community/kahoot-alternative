'use client'

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
        ></Quiz>
      )}
      {currentScreen == Screens.results && (
        <Results participant={participant!} gameId={gameId}></Results>
      )}
    </main>
  )
}

function Results({ participant, gameId }: { participant: Participant; gameId: string }) {
  const [winner, setWinner] = useState<{ participant_id: string; nickname: string; total_score: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinner = async () => {
      const { data } = await supabase
        .from('game_results')
        .select()
        .eq('game_id', gameId)
        .order('total_score', { ascending: false })
        .limit(1)
      setLoading(false)
      if (data && data.length > 0) setWinner(data[0] as any)
    }
    fetchWinner()
  }, [gameId])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <p className="text-white/80 mb-2">Thanks for playing, {participant.nickname}!</p>
      <h1 className="text-4xl font-bold text-white mb-8">🏆 Winner</h1>
      {loading && <p className="text-white/70 italic">Calculating final scores…</p>}
      {!loading && !winner && <p className="text-white/70 italic">No scores recorded.</p>}
      {winner && (
        <div className="bg-white text-black rounded-2xl px-8 py-10 shadow-2xl flex flex-col items-center max-w-md w-full">
          <span className="text-7xl mb-2">🥇</span>
          <span className="text-4xl font-bold mb-3 break-words">{winner.nickname}</span>
          <span className="text-2xl font-bold">
            {winner.total_score}
            <span className="text-base ml-1 font-normal text-gray-500">pts</span>
          </span>
        </div>
      )}
    </div>
  )
}
