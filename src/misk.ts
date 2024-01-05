import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export type Player = Database['public']['Tables']['players']['Row']

export type Choice = Database['public']['Tables']['choices']['Row']

export type Question = Database['public']['Tables']['questions']['Row'] & {
  choices: Choice[]
}

export type Answer = Database['public']['Tables']['answers']['Row']

export type Game = Database['public']['Tables']['games']['Row']

export const gameId = 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'
