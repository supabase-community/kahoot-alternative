import { Participant, supabase } from '@/types/types'
import { useQRCode } from 'next-qrcode'
import { useEffect, useState } from 'react'

export default function Lobby({
  participants: participants,
  gameId,
}: {
  participants: Participant[]
  gameId: string
}) {
  const { Canvas } = useQRCode()
  // Read window.location.origin only after mount so SSR and the first CSR
  // render agree on the value (both empty), avoiding a hydration warning.
  const [playerUrl, setPlayerUrl] = useState<string>('')
  useEffect(() => {
    setPlayerUrl(`${window.location.origin}/game/${gameId}`)
  }, [gameId])

  const onClickStartGame = async () => {
    const { data, error } = await supabase
      .from('games')
      .update({ phase: 'quiz' })
      .eq('id', gameId)
    if (error) {
      return alert(error.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex justify-between m-auto bg-black p-12">
        <div className="w-96">
          <div className="flex justify-start flex-wrap pb-4">
            {participants.map((participant) => (
              <div
                className="text-xl m-2 p-2 bg-green-500"
                key={participant.id}
              >
                {participant.nickname}
              </div>
            ))}
          </div>

          <button
            className="mx-auto bg-white py-4 px-12 block text-black"
            onClick={onClickStartGame}
          >
            Start Game
          </button>
        </div>
        <div className="pl-4">
          {playerUrl && (
            <>
              <Canvas
                text={playerUrl}
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 400,
                }}
              />
              <p className="text-white text-center mt-2 break-all text-sm">
                {playerUrl}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
