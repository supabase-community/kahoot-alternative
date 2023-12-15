import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
)

export type Player = {
  id: string
  nickname: string
}

export type Question = {
  id: string
  body: string
  order: number
  image_url: string
  choices: Choice[]
}

export type Choice = {
  id: string
  question_id: string
  is_correct: boolean
  body: string
}

export type Answer = {
  id: string
  player_id: string
  choice_id: string
  /** Time it took to answer the question */
  time: number
}

export type Game = {
  id: string
  current_question_sequence: number
  has_started: boolean
  is_done: boolean
}

export const gameId = 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'
