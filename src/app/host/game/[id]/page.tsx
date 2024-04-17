'use client'

import {
  Answer,
  Choice,
  Game,
  Participant,
  Question,
  QuizSet,
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

  const [quizSet, setQuizSet] = useState<QuizSet>()

  useEffect(() => {
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
        .from('quiz_sets')
        .select(`*, questions(*, choices(*))`)
        .eq('id', gameData.quiz_set_id)
        .order('order', {
          ascending: true,
          referencedTable: 'questions',
        })
        .single()
      if (error) {
        console.error(error.message)
        getQuestions()
        return
      }
      setQuizSet(data)
    }

    const setGameListner = async () => {
      const { data } = await supabase
        .from('participants')
        .select()
        .eq('game_id', gameId)
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
            setCurrentScreen(game.phase as AdminScreens)
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

    getQuestions()
    setGameListner()
  }, [gameId])

  const [currentQuestionSequence, setCurrentQuestionSequence] = useState(0)

  return (
    <main className="bg-green-600 min-h-screen">
      {currentScreen == AdminScreens.lobby && (
        <Lobby participants={participants} gameId={gameId}></Lobby>
      )}
      {currentScreen == AdminScreens.quiz && (
        <Quiz
          question={quizSet!.questions![currentQuestionSequence]}
          questionCount={quizSet!.questions!.length}
          gameId={gameId}
          participants={participants}
        ></Quiz>
      )}
      {currentScreen == AdminScreens.result && (
        <Results
          participants={participants!}
          quizSet={quizSet!}
          gameId={gameId}
        ></Results>
      )}
    </main>
  )
}
