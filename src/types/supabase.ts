export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          choice_id: string | null
          created_at: string
          id: string
          participant_id: string
          question_id: string
          score: number
        }
        Insert: {
          choice_id?: string | null
          created_at?: string
          id?: string
          participant_id?: string
          question_id: string
          score: number
        }
        Update: {
          choice_id?: string | null
          created_at?: string
          id?: string
          participant_id?: string
          question_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "answers_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "game_results"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      choices: {
        Row: {
          body: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          current_question_sequence: number
          host_user_id: string | null
          id: string
          is_answer_revealed: boolean
          phase: string
          question_started_at: string | null
          quiz_set_id: string
        }
        Insert: {
          created_at?: string
          current_question_sequence?: number
          host_user_id?: string | null
          id?: string
          is_answer_revealed?: boolean
          phase?: string
          question_started_at?: string | null
          quiz_set_id: string
        }
        Update: {
          created_at?: string
          current_question_sequence?: number
          host_user_id?: string | null
          id?: string
          is_answer_revealed?: boolean
          phase?: string
          question_started_at?: string | null
          quiz_set_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_quiz_set_id_fkey"
            columns: ["quiz_set_id"]
            isOneToOne: false
            referencedRelation: "quiz_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          created_at: string
          game_id: string
          id: string
          nickname: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          nickname: string
          user_id?: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          nickname?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game_results"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_hosts: {
        Row: {
          claimed_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          user_id?: string
        }
        Update: {
          claimed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qa_questions: {
        Row: {
          answered_at: string | null
          author_nickname: string
          author_user_id: string
          body: string
          created_at: string
          id: string
          session_label: string | null
        }
        Insert: {
          answered_at?: string | null
          author_nickname: string
          author_user_id?: string
          body: string
          created_at?: string
          id?: string
          session_label?: string | null
        }
        Update: {
          answered_at?: string | null
          author_nickname?: string
          author_user_id?: string
          body?: string
          created_at?: string
          id?: string
          session_label?: string | null
        }
        Relationships: []
      }
      qa_upvotes: {
        Row: {
          created_at: string
          qa_question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          qa_question_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          qa_question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_upvotes_qa_question_id_fkey"
            columns: ["qa_question_id"]
            isOneToOne: false
            referencedRelation: "qa_history"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "qa_upvotes_qa_question_id_fkey"
            columns: ["qa_question_id"]
            isOneToOne: false
            referencedRelation: "qa_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          body: string
          created_at: string
          explanation: string | null
          id: string
          image_url: string | null
          order: number
          quiz_set_id: string
        }
        Insert: {
          body: string
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          order: number
          quiz_set_id: string
        }
        Update: {
          body?: string
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          order?: number
          quiz_set_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_set_id_fkey"
            columns: ["quiz_set_id"]
            isOneToOne: false
            referencedRelation: "quiz_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      game_results: {
        Row: {
          game_id: string | null
          nickname: string | null
          participant_id: string | null
          total_score: number | null
        }
        Relationships: []
      }
      qa_history: {
        Row: {
          answered_at: string | null
          asked_at: string | null
          author_nickname: string | null
          question: string | null
          question_id: string | null
          session_label: string | null
          upvotes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_question:
        | {
            Args: {
              body: string
              choices: Json[]
              order: number
              quiz_set_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              body: string
              choices: Json[]
              explanation?: string
              order: number
              quiz_set_id: string
            }
            Returns: undefined
          }
      claim_qa_host: { Args: never; Returns: undefined }
      host_mark_answered: {
        Args: { mark_as_answered?: boolean; question_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
A new version of Supabase CLI is available: v2.99.0 (currently installed v)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
