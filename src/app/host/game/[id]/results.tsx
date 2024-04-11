import {
  Answer,
  GameResult,
  Participant,
  Question,
  supabase,
} from '@/types/types'
import { useEffect, useState } from 'react'

export default function Results({
  participants,
  questions: questions,
  gameId,
}: {
  participants: Participant[]
  questions: Question[]
  gameId: string
}) {
  const [gameResults, setGameResults] = useState<GameResult[]>([])

  const getResults = async () => {
    const { data, error } = await supabase
      .from('game_results')
      .select()
      .eq('game_id', gameId)
    if (error) {
      return alert(error.message)
    }

    setGameResults(data)
  }

  useEffect(() => {
    getResults()
  }, [])

  return (
    <div>
      <h1 className="text-xl pb-4">View Results！</h1>
      {gameResults.map((gameResult, index) => (
        <div
          key={gameResult.participant_id}
          className="flex justify-between border-b-white border-b-2 py-2"
        >
          <div>{gameResult.nickname}</div>
          <div className="flex-grow"></div>
          <div>{gameResult.total_score}</div>
        </div>
      ))}
    </div>
  )
}
