'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useState } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/qa'
  const role: 'host' | 'client' = next.startsWith('/host') ? 'host' : 'client'

  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, password: input }),
    })
    setLoading(false)
    if (res.ok) {
      router.push(next)
    } else {
      setError(true)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 text-center">HYF Live Tools</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {role === 'host' ? 'Host login' : 'Student login'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center">Wrong password, try again.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
