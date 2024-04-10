'use client'

import {
  Answer,
  Choice,
  Game,
  Participant,
  Question,
  supabase,
} from '@/types/types'
import { useEffect, useState } from 'react'
import Lobby from './lobby'
import Quiz from './quiz'
import Results from './results'

enum AdminScreens {
  lobby = 'lobby',
  quiz = 'quiz',
  result = 'result',
}

export default function Home({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const [currentScreen, setCurrentScreen] = useState<AdminScreens>(
    AdminScreens.lobby
  )

  const [participants, setParticipants] = useState<Participant[]>([])

  const [questions, setQuestions] = useState<Question[]>()

  useEffect(() => {
    getQuestions()
    setGameListner()
  }, [])

  const getQuestions = async () => {
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select()
      .eq('id', gameId)
      .single()
    if (gameError) {
      console.error(gameError.message)
      alert('Error getting game data')
      return
    }
    const { data, error } = await supabase
      .from('questions')
      .select(`*, choices(*)`)
      .eq('quiz_set_id', gameData.quiz_set_id)
      .order('order', { ascending: true })
    if (error) {
      console.error(error.message)
      getQuestions()
      return
    }
    setQuestions(data)

    const choiceCount = data.map((rows: Question) => rows.choices.length)

    const correctCount = data.map(
      (rows) =>
        rows.choices.filter((choice: Choice) => choice.is_correct).length
    )
  }

  const [currentQuestionSequence, setCurrentQuestionSequence] = useState(0)

  const setGameListner = async () => {
    const { data } = await supabase
      .from('participants')
      .select()
      .order('created_at')
    if (data) setParticipants(data)

    supabase
      .channel('game')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          setParticipants((currentParticipants) => {
            return [...currentParticipants, payload.new as Participant]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          // start the quiz game
          const game = payload.new as Game
          setCurrentQuestionSequence(game.current_question_sequence)
          if (game.phase === 'lobby') {
            setCurrentScreen(AdminScreens.lobby)
          } else if (game.phase === 'results') {
            setCurrentScreen(AdminScreens.result)
          } else {
            setCurrentScreen(AdminScreens.quiz)
          }
        }
      )
      .subscribe()

    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select()
      .eq('id', gameId)
      .single()

    if (gameError) {
      alert(gameError.message)
      console.error(gameError)
      return
    }

    setCurrentQuestionSequence(gameData.current_question_sequence)
    setCurrentScreen(gameData.phase as AdminScreens)
  }

  return (
    <main className="bg-green-500 min-h-screen">
      {currentScreen == AdminScreens.lobby && (
        <Lobby participants={participants} gameId={gameId}></Lobby>
      )}
      {currentScreen == AdminScreens.quiz && (
        <Quiz
          question={questions![currentQuestionSequence]}
          questionCount={questions!.length}
          gameId={gameId}
        ></Quiz>
      )}
      {currentScreen == AdminScreens.result && (
        <Results
          participants={participants!}
          questions={questions!}
          gameId={gameId}
        ></Results>
      )}
    </main>
  )
}
