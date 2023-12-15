import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://aofiufmhphqtsjpatqdy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZml1Zm1ocGhxdHNqcGF0cWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyNjY4MjIsImV4cCI6MjAxNzg0MjgyMn0.AE6Aq1h7mxmiWI0q-qc0NEcw42MNz0fJDWPWbckaiz0'
)

export type Player = {
  id: string
  nickname: string
}

export type Problem = {
  id: string
  body: string
  order: number
  image_url: string
  choices: Choice[]
}

export type Choice = {
  id: string
  problem_id: string
  is_correct: boolean
  body: string
}

export type Answer = {
  id: string
  problem_id: string
  player_id: string
  choice_id: string
}

export type Game = {
  id: string
  current_problem_sequence: number
  is_done: boolean
}

export const gameId = 'dc84bced-bb8b-4bff-b7b1-9eb21cae92ca'
