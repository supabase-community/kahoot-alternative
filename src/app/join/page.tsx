'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function JoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) { setError(true); return }
    router.push(`/game/${trimmed}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 text-center">Join a Quiz</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the game code from your teacher
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Game code"
            value={code}
            onChange={e => { setCode(e.target.value); setError(false) }}
            className="border rounded-lg px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
            autoComplete="off"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">Enter a game code to continue.</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Join
          </button>
        </form>
      </div>
    </main>
  )
}
