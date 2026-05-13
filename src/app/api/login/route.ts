import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const { role, password } = await request.json()

  const expected =
    role === 'host' ? process.env.HOST_PASSWORD : process.env.CLIENT_PASSWORD

  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const cookie = role === 'host' ? 'hyf_host' : 'hyf_client'
  const response = NextResponse.json({ ok: true })
  response.cookies.set(cookie, '1', {
    path: '/',
    maxAge: 43200,
    sameSite: 'lax',
    httpOnly: true,
  })
  return response
}
