'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { setRequestMeta } from 'next/dist/server/request-meta'

const supabase = createClient(
  'https://aofiufmhphqtsjpatqdy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZml1Zm1ocGhxdHNqcGF0cWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyNjY4MjIsImV4cCI6MjAxNzg0MjgyMn0.AE6Aq1h7mxmiWI0q-qc0NEcw42MNz0fJDWPWbckaiz0'
)

type Player = {
  nickname: string
  id: string
}

type Problem = {
  id: string
  body: string
  order: number
  image_url: string
  choices: Choice[]
}

type Choice = {
  id: string
  problem_id: string
  is_correct: boolean
  body: string
}

type Answer = {
  id: string
  problem_id: string
  player_id: string
  choice_id: string
}

type Session = {
  id: string
  current_problem_sequence: number
}

enum Screens {
  register,
  lobby,
  quiz,
  // problemShown,
  // problemAnswering,
  // problemAnswered,
  // problemResult,
  results,
}

export default function Home() {
  const onRegisterCompleted = (player: Player) => {
    console.log(player)
    setPlayer(player)
    setCurrentScreen(Screens.lobby)
  }

  const [player, setPlayer] = useState<Player | null>()

  const [currentScreen, setCurrentScreen] = useState(Screens.register)

  const [problems, setProblems] = useState<Problem[]>()

  const getProblems = async () => {
    const { data, error } = await supabase
      .from('problems')
      .select(`*, choices(*)`)
      .order('order', { ascending: true })
    if (error) {
      getProblems()
      return
    }
    setProblems(data)
    console.log({ problems: data })
    const choiceCount = data.map((rows: Problem) => rows.choices.length)
    console.log({ choiceCount })
    const correctCount = data.map(
      (rows) =>
        rows.choices.filter((choice: Choice) => choice.is_correct).length
    )
    console.log({ correctCount })
  }

  const sessionId = 'dc84bced-bb8b-4bff-b7b1-9eb21cae92ca'

  const [currentProblemSequence, setCurrentProblemSequence] = useState(0)

  const setSessionListner = () => {
    supabase
      .channel('session')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          console.log(payload.new)
          const session = payload.new as Session
          setCurrentProblemSequence(session.current_problem_sequence)

          // start the quiz session

          setCurrentScreen(Screens.quiz)
          console.log({ currentScreen })
          console.log(session.current_problem_sequence)
        }
      )
      .subscribe()
  }

  useEffect(() => {
    getProblems()
    setSessionListner()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="max-w-md m-auto p-8 bg-black text-white">
        {currentScreen == Screens.register && (
          <Register onRegisterCompleted={onRegisterCompleted}></Register>
        )}
        {currentScreen == Screens.lobby && <Lobby player={player!}></Lobby>}
        {currentScreen == Screens.quiz && (
          <Quiz
            problem={problems![currentProblemSequence]}
            problemCount={problems!.length}
            playerId={player!.id}
          ></Quiz>
        )}
      </div>
    </main>
  )
}

function Quiz({
  problem,
  problemCount,
  playerId,
}: {
  problem: Problem
  problemCount: number
  playerId: string
}) {
  const [hasAnswered, setHasAnswered] = useState(false)

  useEffect(() => {
    setHasAnswered(false)
  }, [problem.id])

  const answer = async (choiceId: string) => {
    setHasAnswered(true)
    const { data, error } = await supabase.from('answers').insert({
      player_id: playerId,
      problem_id: problem.id,
      choice_id: choiceId,
      answer_time: 100,
    })
    if (error) {
      setHasAnswered(false)
      alert(error)
    }
  }

  if (hasAnswered) {
    return <div>他のプレーヤーさんの回答が終わるのをお待ちください。</div>
  }

  return (
    <div>
      <div className="absolute left-4 top-4">
        {problem.order + 1}/{problemCount}
      </div>

      <h1 className="pb-4 text-xl">{problem.body}</h1>
      <div className="flex justify-between flex-wrap">
        {problem.choices.map((choice) => (
          <div key={choice.id} className="w-1/2 p-1">
            <button
              onClick={() => answer(choice.id)}
              className="p-2 bg-green-500 w-full text-center"
            >
              {choice.body}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Lobby({ player }: { player: Player }) {
  return (
    <div>
      <h1 className="text-xl pb-4">ようこそ{player.nickname}さん！</h1>
      <p>
        ゲームに参加できました！画面に名前が表示されるはずです！他の皆様が登録されるのをもう少々お待ちください。
      </p>
    </div>
  )
}

function Register({
  onRegisterCompleted: onRegisterComplete,
}: {
  onRegisterCompleted: (player: Player) => void
}) {
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    console.log(nickname)
    if (!nickname) {
      return
    }
    const { data: player, error } = await supabase
      .from('players')
      .insert({ nickname })
      .select()
      .single()

    if (error) {
      setSending(false)

      return alert(
        `正常に登録ができませんでした。もう一度お試しください。Error: ${error}`
      )
    }

    onRegisterComplete(player)
  }

  const [nickname, setNickname] = useState('')
  const [sending, setSending] = useState(false)

  return (
    <form onSubmit={(e) => onFormSubmit(e)}>
      <input
        className="p-2 w-full border border-black text-black"
        type="text"
        onChange={(val) => setNickname(val.currentTarget.value)}
        placeholder="ニックネーム"
      />
      <button disabled={sending} className="w-full py-2 bg-amber-500 mt-4">
        参加
      </button>
    </form>
  )
}
