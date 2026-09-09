export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          github: string | null
          headline: string | null
          id: string
          linkedin: string | null
          location: string | null
          phone: string | null
          resume_content: Json
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          github?: string | null
          headline?: string | null
          id: string
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          resume_content?: Json
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          github?: string | null
          headline?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          resume_content?: Json
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      resume_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          resume_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          resume_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          resume_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: Json
          created_at: string
          id: string
          template_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          template_id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          template_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_public_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
