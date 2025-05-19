export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_paid: boolean
          is_public: boolean
          mentor_id: string
          price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_paid?: boolean
          is_public?: boolean
          mentor_id: string
          price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_paid?: boolean
          is_public?: boolean
          mentor_id?: string
          price?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          id: string
          progress: Json | null
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: Json | null
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          file_url: string | null
          id: string
          is_published: boolean | null
          lesson_order: number
          module_id: string
          title: string
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          is_published?: boolean | null
          lesson_order?: number
          module_id: string
          title: string
          type: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          is_published?: boolean | null
          lesson_order?: number
          module_id?: string
          title?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_followers: {
        Row: {
          followed_at: string
          follower_id: string
          mentor_id: string
        }
        Insert: {
          followed_at?: string
          follower_id: string
          mentor_id: string
        }
        Update: {
          followed_at?: string
          follower_id?: string
          mentor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_followers_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          content_data: Json | null
          content_type: string
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_free: boolean
          module_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content_data?: Json | null
          content_type: string
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean
          module_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_data?: Json | null
          content_type?: string
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean
          module_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
