'use client'

import {
  Answer,
  Choice,
  Player,
  Problem,
  Session,
  sessionId,
  supabase,
} from '@/misk'
import { useEffect, useState } from 'react'

enum AdminScreens {
  lobby,
  quiz,
  results,
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AdminScreens>(
    AdminScreens.lobby
  )

  const [players, setPlayers] = useState<Player[]>([])

  const [problems, setProblems] = useState<Problem[]>()

  useEffect(() => {
    getProblems()
    setSessionListner()
  }, [])

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

    const choiceCount = data.map((rows: Problem) => rows.choices.length)

    const correctCount = data.map(
      (rows) =>
        rows.choices.filter((choice: Choice) => choice.is_correct).length
    )
  }

  const [currentProblemSequence, setCurrentProblemSequence] = useState(0)

  const setSessionListner = () => {
    supabase
      .channel('session')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
        },
        (payload) => {
          setPlayers((currentPlayers) => {
            return [...currentPlayers, payload.new as Player]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          // start the quiz session
          const session = payload.new as Session
          setCurrentProblemSequence(session.current_problem_sequence)
          if (session.is_done) {
            setCurrentScreen(AdminScreens.results)
          } else {
            setCurrentScreen(AdminScreens.quiz)
          }
        }
      )
      .subscribe()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="m-auto p-8 bg-black  text-white">
        {currentScreen == AdminScreens.lobby && (
          <Lobby players={players}></Lobby>
        )}
        {currentScreen == AdminScreens.quiz && (
          <Quiz
            problem={problems![currentProblemSequence]}
            problemCount={problems!.length}
          ></Quiz>
        )}
        {currentScreen == AdminScreens.results && (
          <Results players={players!} problems={problems!}></Results>
        )}
      </div>
    </main>
  )
}

function Results({
  players,
  problems,
}: {
  players: Player[]
  problems: Problem[]
}) {
  const [finalOrderedPlayers, setOrderedPlayers] = useState<
    {
      id: string
      correctCount: number
      player: Player
    }[]
  >([])

  const getResults = async () => {
    const { data, error } = await supabase.from('answers').select()
    if (error) {
      return alert(error.message)
    }
    const answers = data as Answer[]
    console.log({ answers })
    const correctAnswers = answers.filter((answer) => {
      const targetProblem = problems.find((problem) => {
        return problem.id == answer.problem_id
      })
      if (!targetProblem) return false

      const targetChoice = targetProblem.choices.find((choice) => {
        return choice.id == answer.choice_id
      })

      if (!targetChoice) return false
      return targetChoice.is_correct
    })
    console.log({ correctAnswers })

    const resultMap: { [key: string]: number } = {}
    correctAnswers.forEach((answer) => {
      if (!resultMap[answer.player_id]) {
        resultMap[answer.player_id] = 0
      }
      resultMap[answer.player_id]++
    })
    console.log({ resultMap })

    // const orderedPlayers = Object.keys(resultMap)
    const filteredPlayers = Object.keys(resultMap).filter((key) => {
      console.log({ players })
      const targetPlayer = players.find((player) => player.id == key)
      if (!targetPlayer) return false
      return true
    })

    console.log({ filteredPlayers })

    const orderedPlayers = filteredPlayers
      .map((key) => {
        const targetPlayer = players.find((player) => player.id == key)
        return { id: key, correctCount: resultMap[key], player: targetPlayer! }
      })
      .sort((a, b) => a.correctCount - b.correctCount)

    setOrderedPlayers(orderedPlayers)
    console.log({ orderedPlayers })
  }

  useEffect(() => {
    getResults()
  }, [])

  return (
    <div>
      <h1 className="text-xl pb-4">結果発表！</h1>
      {finalOrderedPlayers.map((player) => (
        <div key={player.id}>{player.player?.nickname}</div>
      ))}
    </div>
  )
}

function Quiz({
  problem,
  problemCount,
}: {
  problem: Problem
  problemCount: number
}) {
  const [hasShownAnswer, setHasShownAnswer] = useState(false)

  const [hasShownChoices, setHasShownChoices] = useState(false)

  const getNextQuestion = async () => {
    var updateData
    if (problemCount == problem.order + 1) {
      updateData = { is_done: true }
    } else {
      updateData = { current_problem_sequence: problem.order + 1 }
    }

    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', sessionId)
    if (error) {
      return alert(error.message)
    }
  }

  useEffect(() => {
    setHasShownAnswer(false)
    setHasShownChoices(false)

    setTimeout(() => {
      setHasShownChoices(true)
    }, 5)
  }, [problem.id])

  return (
    <div>
      <div className="absolute left-4 top-4">
        {problem.order + 1}/{problemCount}
      </div>

      <h1 className="pb-4 text-xl">{problem.body}</h1>
      {hasShownChoices && (
        <div className="flex justify-between flex-wrap">
          {problem.choices.map((choice) => (
            <div key={choice.id} className="w-1/2 p-1">
              <div
                className={`p-2 w-full text-center 
              ${
                hasShownAnswer
                  ? choice.is_correct
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                  : 'bg-green-500'
              }`}
              >
                {choice.body}
              </div>
            </div>
          ))}
        </div>
      )}
      {!hasShownChoices && (
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex justify-between pt-4">
        <div></div>
        {!hasShownAnswer && (
          <button
            className="p-2 bg-white text-black"
            onClick={() => setHasShownAnswer(true)}
          >
            答えを見る
          </button>
        )}
        {hasShownAnswer && (
          <button className="p-2 bg-white text-black" onClick={getNextQuestion}>
            次の問題へ
          </button>
        )}
      </div>
    </div>
  )
}

function Lobby({ players }: { players: Player[] }) {
  const onClickStartGame = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ current_problem_sequence: 0 })
      .eq('id', sessionId)
    if (error) {
      return alert(error.message)
    }
  }

  return (
    <div>
      <div className="flex justify-start flex-wrap pb-4">
        {players.map((player) => (
          <div className="text-xl m-2 p-2 bg-green-500" key={player.id}>
            {player.nickname}
          </div>
        ))}
      </div>

      <button
        className="mx-auto bg-white py-4 px-12 block text-black"
        onClick={onClickStartGame}
      >
        ゲームを始める
      </button>
    </div>
  )
}
