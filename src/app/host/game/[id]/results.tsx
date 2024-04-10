import { Answer, Participant, Question, supabase } from '@/types/types'
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
  const [finalOrderedPlayers, setOrderedPlayers] = useState<
    {
      id: string
      correctCount: number
      player: Participant
    }[]
  >([])

  const getResults = async () => {
    const { data, error } = await supabase
      .from('answers')
      .select()
      .eq('quiz_set_id', gameId)
    if (error) {
      return alert(error.message)
    }
    const answers = data as Answer[]

    // setOrderedPlayers(orderedPlayers)
  }

  useEffect(() => {
    getResults()
  }, [])

  return (
    <div>
      <h1 className="text-xl pb-4">View Results！</h1>
      {finalOrderedPlayers.map((player, index) => (
        <div
          key={player.id}
          className="flex justify-between border-b-white border-b-2 py-2"
        >
          <div>{player.player?.nickname}</div>
          <div className="flex-grow"></div>
          <div>
            {player.correctCount}/{questions.length}
          </div>
        </div>
      ))}
    </div>
  )
}
