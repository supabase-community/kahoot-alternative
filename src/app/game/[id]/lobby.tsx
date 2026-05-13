import { Participant, supabase } from '@/types/types'
import { on } from 'events'
import { FormEvent, useEffect, useState } from 'react'

export default function Lobby({
  gameId,
  onRegisterCompleted,
}: {
  gameId: string
  onRegisterCompleted: (participant: Participant) => void
}) {
  const [participant, setParticipant] = useState<Participant | null>(null)

  useEffect(() => {
    const fetchParticipant = async () => {
      let userId: string | null = null

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionData.session) {
        userId = sessionData.session?.user.id ?? null
      } else {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) console.error(error)
        userId = data?.user?.id ?? null
      }

      if (!userId) {
        return
      }

      const { data: participantData, error } = await supabase
        .from('participants')
        .select()
        .eq('game_id', gameId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        // Don't alert on transient lobby-fetch errors; they crash the UX with
        // an alert loop. Just log and let the user retry by interacting.
        console.error('fetchParticipant:', error)
        return
      }

      if (participantData) {
        setParticipant(participantData)
        onRegisterCompleted(participantData)
      }
    }

    fetchParticipant()
  }, [gameId, onRegisterCompleted])

  return (
    <div className="bg-green-500 flex justify-center items-center min-h-screen">
      <div className="bg-black p-12">
        {!participant && (
          <Register
            gameId={gameId}
            onRegisterCompleted={(participant) => {
              onRegisterCompleted(participant)
              setParticipant(participant)
            }}
          />
        )}

        {participant && (
          <div className="text-white max-w-md">
            <h1 className="text-xl pb-4">Welcome {participant.nickname}！</h1>
            <p>
              You have been registered and your nickname should show up on the
              admin screen. Please sit back and wait until the game master
              starts the game.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Register({
  onRegisterCompleted,
  gameId,
}: {
  onRegisterCompleted: (player: Participant) => void
  gameId: string
}) {
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)

    if (!nickname) {
      setSending(false)
      return
    }

    const tryInsert = async () =>
      supabase
        .from('participants')
        .insert({ nickname, game_id: gameId })
        .select()
        .single()

    let { data: participant, error } = await tryInsert()

    // 23503 = FK violation on participants.user_id (stale anon JWT pointing
    // at a user that no longer exists in auth.users — happens after a
    // `supabase db reset` between cohorts, or any time we wiped users). Sign
    // out, mint a fresh anon user, retry once.
    if (error && (error as any).code === '23503') {
      await supabase.auth.signOut()
      await supabase.auth.signInAnonymously()
      ;({ data: participant, error } = await tryInsert())
    }

    if (error || !participant) {
      setSending(false)
      return alert(error?.message ?? 'Could not join the game')
    }

    onRegisterCompleted(participant)
  }

  const [nickname, setNickname] = useState('')
  const [sending, setSending] = useState(false)

  return (
    <form onSubmit={(e) => onFormSubmit(e)}>
      <input
        className="p-2 w-full border border-black text-black"
        type="text"
        onChange={(val) => setNickname(val.currentTarget.value)}
        placeholder="Nickname"
        maxLength={20}
      />
      <button disabled={sending} className="w-full py-2 bg-green-500 mt-4">
        Join
      </button>
    </form>
  )
}
