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
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_configs: {
        Row: {
          avatar: string | null
          created_at: string
          custom_params: Json | null
          id: string
          is_active: boolean | null
          max_history_messages: number | null
          name: string
          theme_color: string | null
          timeout: number | null
          updated_at: string
          webhook_url: string | null
          welcome_message: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          custom_params?: Json | null
          id?: string
          is_active?: boolean | null
          max_history_messages?: number | null
          name?: string
          theme_color?: string | null
          timeout?: number | null
          updated_at?: string
          webhook_url?: string | null
          welcome_message?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          custom_params?: Json | null
          id?: string
          is_active?: boolean | null
          max_history_messages?: number | null
          name?: string
          theme_color?: string | null
          timeout?: number | null
          updated_at?: string
          webhook_url?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          bot_name: string
          created_at: string
          id: string
          session_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bot_name: string
          created_at?: string
          id?: string
          session_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bot_name?: string
          created_at?: string
          id?: string
          session_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chatbot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          sender: string
          type: string | null
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_metrics: {
        Row: {
          created_at: string
          event: string
          id: string
          metadata: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          metadata?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          metadata?: Json | null
          session_id?: string
        }
        Relationships: []
      }
      chatbot_users: {
        Row: {
          created_at: string
          id: string
          session_id: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      configuracoes_usuario: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nome_usuario: string
          perfil_usuario: string
          tipo_log: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome_usuario: string
          perfil_usuario: string
          tipo_log: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome_usuario?: string
          perfil_usuario?: string
          tipo_log?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_usuario_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      course_landing_pages: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          layout_body: Json | null
          layout_images: Json | null
          layout_name: string | null
          mentor_id: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          layout_body?: Json | null
          layout_images?: Json | null
          layout_name?: string | null
          mentor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          layout_body?: Json | null
          layout_images?: Json | null
          layout_name?: string | null
          mentor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_landing_pages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string
          description: string | null
          discount: number | null
          discounted_price: number | null
          id: string
          image_url: string | null
          is_paid: boolean
          is_public: boolean
          is_published: boolean | null
          landing_page_id: string | null
          mentor_id: string
          price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount?: number | null
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          is_paid?: boolean
          is_public?: boolean
          is_published?: boolean | null
          landing_page_id?: string | null
          mentor_id: string
          price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount?: number | null
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          is_paid?: boolean
          is_public?: boolean
          is_published?: boolean | null
          landing_page_id?: string | null
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
          {
            foreignKeyName: "cursos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
            referencedRelation: "cursos"
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
      notificacoes: {
        Row: {
          acao: string
          created_at: string
          id: string
          mensagem: string
          mensagem_lida: boolean
          mentor_id: string
          mentorado_id: string
          nome_mentor: string
          nome_mentorado: string
        }
        Insert: {
          acao: string
          created_at?: string
          id?: string
          mensagem: string
          mensagem_lida?: boolean
          mentor_id: string
          mentorado_id: string
          nome_mentor: string
          nome_mentorado: string
        }
        Update: {
          acao?: string
          created_at?: string
          id?: string
          mensagem?: string
          mensagem_lida?: boolean
          mentor_id?: string
          mentorado_id?: string
          nome_mentor?: string
          nome_mentorado?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_url: string | null
          status: string
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_url?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_url?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          category: string | null
          category_id: string | null
          full_name: string | null
          highlight_message: string | null
          id: string
          phone: string | null
          role: string
          sm_desc1: string | null
          sm_desc2: string | null
          sm_desc3: string | null
          sm_tit1: string | null
          sm_tit2: string | null
          sm_tit3: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          category_id?: string | null
          full_name?: string | null
          highlight_message?: string | null
          id: string
          phone?: string | null
          role: string
          sm_desc1?: string | null
          sm_desc2?: string | null
          sm_desc3?: string | null
          sm_tit1?: string | null
          sm_tit2?: string | null
          sm_tit3?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          category_id?: string | null
          full_name?: string | null
          highlight_message?: string | null
          id?: string
          phone?: string | null
          role?: string
          sm_desc1?: string | null
          sm_desc2?: string | null
          sm_desc3?: string | null
          sm_tit1?: string | null
          sm_tit2?: string | null
          sm_tit3?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_name: string | null
          plan_price: number | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string | null
          plan_price?: number | null
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string | null
          plan_price?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_orphaned_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_default_landing_page_sections: {
        Args: {
          course_id_param: string
          course_title?: string
          course_price?: number
        }
        Returns: string
      }
      obter_detalhes_cursos_do_mentor: {
        Args: { p_mentor_id: string }
        Returns: {
          id: string
          title: string
          description: string
          mentor_id: string
          is_public: boolean
          is_paid: boolean
          price: number
          image_url: string
          is_published: boolean
          created_at: string
          updated_at: string
          enrollment_count: number
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
