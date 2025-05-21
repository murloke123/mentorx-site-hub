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
      avaliacoes: {
        Row: {
          comentario: string | null
          criado_em: string
          curso_id: string
          id: string
          nota: number
          usuario_id: string
        }
        Insert: {
          comentario?: string | null
          criado_em?: string
          curso_id: string
          id?: string
          nota: number
          usuario_id: string
        }
        Update: {
          comentario?: string | null
          criado_em?: string
          curso_id?: string
          id?: string
          nota?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_ratings_course_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudo_concluido: {
        Row: {
          conteudo_id: string
          created_at: string
          curso_id: string
          id: string
          modulo_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo_id: string
          created_at?: string
          curso_id: string
          id?: string
          modulo_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo_id?: string
          created_at?: string
          curso_id?: string
          id?: string
          modulo_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conteudo_concluido_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conteudo_concluido_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conteudo_concluido_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudos: {
        Row: {
          created_at: string
          dados_conteudo: Json | null
          descricao_conteudo: string | null
          id: string
          modulo_id: string
          nome_conteudo: string
          ordem: number
          tipo_conteudo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dados_conteudo?: Json | null
          descricao_conteudo?: string | null
          id?: string
          modulo_id: string
          nome_conteudo: string
          ordem?: number
          tipo_conteudo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dados_conteudo?: Json | null
          descricao_conteudo?: string | null
          id?: string
          modulo_id?: string
          nome_conteudo?: string
          ordem?: number
          tipo_conteudo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conteudos_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          atualizado_em: string
          criado_em: string
          descricao: string | null
          eh_pago: boolean
          eh_publico: boolean
          foi_publicado: boolean | null
          id: string
          mentor_id: string
          preco: number | null
          titulo: string
          url_imagem: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          eh_pago?: boolean
          eh_publico?: boolean
          foi_publicado?: boolean | null
          id?: string
          mentor_id: string
          preco?: number | null
          titulo: string
          url_imagem?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          eh_pago?: boolean
          eh_publico?: boolean
          foi_publicado?: boolean | null
          id?: string
          mentor_id?: string
          preco?: number | null
          titulo?: string
          url_imagem?: string | null
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
      inscricoes: {
        Row: {
          curso_id: string
          data_inscricao: string
          id: string
          progresso: Json | null
          usuario_id: string
        }
        Insert: {
          curso_id: string
          data_inscricao?: string
          id?: string
          progresso?: Json | null
          usuario_id: string
        }
        Update: {
          curso_id?: string
          data_inscricao?: string
          id?: string
          progresso?: Json | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      modulos: {
        Row: {
          created_at: string
          curso_id: string
          descricao_modulo: string | null
          id: string
          nome_modulo: string
          ordem: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          curso_id: string
          descricao_modulo?: string | null
          id?: string
          nome_modulo: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          curso_id?: string
          descricao_modulo?: string | null
          id?: string
          nome_modulo?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modulos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
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
      sumario_avaliacoes_cursos: {
        Row: {
          curso_id: string | null
          media_geral_avaliacoes: number | null
          total_num_avaliacoes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_ratings_course_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      obter_detalhes_cursos_do_mentor: {
        Args: { p_mentor_id: string }
        Returns: {
          id: string
          titulo: string
          descricao: string
          mentor_id: string
          eh_publico: boolean
          eh_pago: boolean
          preco: number
          url_imagem: string
          foi_publicado: boolean
          criado_em: string
          atualizado_em: string
          contagem_inscricoes: number
          media_avaliacoes: number
          total_avaliacoes: number
        }[]
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
