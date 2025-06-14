
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
      categories: {
        Row: {
          id: string
          name: string
          description: string
          color: string
          icon: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          color?: string
          icon?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          color?: string
          icon?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes_usuario: {
        Row: {
          id: string
          user_id: string
          nome_usuario: string
          perfil_usuario: string
          tipo_log: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome_usuario: string
          perfil_usuario: string
          tipo_log: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome_usuario?: string
          perfil_usuario?: string
          tipo_log?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_landing_pages: {
        Row: {
          id: string
          course_id: string
          mentor_id: string
          layout_name: string
          layout_body: Json
          layout_images: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id?: string
          mentor_id?: string
          layout_name?: string
          layout_body?: Json
          layout_images?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          mentor_id?: string
          layout_name?: string
          layout_body?: Json
          layout_images?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cursos: {
        Row: {
          id: string
          title: string
          description: string
          mentor_id: string
          category: string
          category_id: string
          price: number
          discounted_price: number
          discount: number
          image_url: string
          is_paid: boolean
          is_public: boolean
          is_published: boolean
          landing_page_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          mentor_id: string
          category?: string
          category_id?: string
          price?: number
          discounted_price?: number
          discount?: number
          image_url?: string
          is_paid?: boolean
          is_public?: boolean
          is_published?: boolean
          landing_page_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          mentor_id?: string
          category?: string
          category_id?: string
          price?: number
          discounted_price?: number
          discount?: number
          image_url?: string
          is_paid?: boolean
          is_public?: boolean
          is_published?: boolean
          landing_page_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          current_period_start: string
          current_period_end: string
          plan_name: string
          plan_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          status: string
          current_period_start?: string
          current_period_end?: string
          plan_name?: string
          plan_price?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          plan_name?: string
          plan_price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string
          stripe_payment_intent_id: string
          amount: number
          currency: string
          status: string
          invoice_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          subscription_id?: string
          stripe_payment_intent_id?: string
          amount: number
          currency?: string
          status: string
          invoice_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          currency?: string
          status?: string
          invoice_url?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
  }
}

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"])
    ? (PublicSchema["Tables"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"])
    ? (PublicSchema["Tables"])[PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"])
    ? (PublicSchema["Tables"])[PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
